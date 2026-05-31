"""PersonaAI demo backend — production-ready POC.

In production: this service would ingest visitor events from Segment/RudderStack,
maintain a feature store, score against an XGBoost propensity model, and emit
real-time triggers back to Segment/HubSpot. For the demo: it only invokes the
LLM and returns a simulated persona detection.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="PersonaAI Demo Backend",
    description="POC backend — Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es PersonaAI, un moteur de profiling comportemental B2C/B2B SaaS qui construit en temps reel un buyer persona a partir de signaux observes sur un visiteur (parcours, secteur, taille, comportement). Tu inventes un persona detaille avec scoring de propension et recommandations d'engagement personnalisees.

Format de sortie exact en MARKDOWN :
**🎯 Persona detecte**
- [Nom de persona (ex: "Sarah, COO scale-up SaaS B2B"), 2 phrases qui le decrivent : role, contexte business, douleur principale]

**📊 Scoring de propension**
- [Probabilite de conversion : XX% — justification 1 ligne]
- [ARPU estime : EUR XX/mois — justification 1 ligne]
- [Segment recommande : nom-de-segment — justification 1 ligne]

**🎯 Recommandations d'engagement**
- [3 puces : message a afficher / offre a presenter / canal a privilegier — concretes et actionnables]

**⚡ Triggers temps reel**
- [2 puces : evenements a declencher dans Segment, HubSpot, ou via webhook]

Tu DOIS inventer un persona realiste pour la demo, jamais "je n'ai pas access aux donnees client". Tu joues le moteur d'IA comportementale qui a deja calcule. Style produit, concis, B2B/B2C SaaS. Maximum 300 mots."""

SYSTEM_PROMPT_EN = """You are PersonaAI, a behavioral profiling engine for B2C/B2B SaaS that builds a buyer persona in real time from observed visitor signals (journey, industry, size, behavior). You invent a detailed persona with propensity scoring and personalized engagement recommendations.

Exact MARKDOWN output format:
**🎯 Detected persona**
- [Persona name (e.g. "Sarah, COO scale-up SaaS B2B"), 2 sentences describing them: role, business context, primary pain]

**📊 Propensity scoring**
- [Conversion probability: XX% — 1-line justification]
- [Estimated ARPU: USD XX/month — 1-line justification]
- [Recommended segment: segment-name — 1-line justification]

**🎯 Engagement recommendations**
- [3 bullets: message to show / offer to present / preferred channel — concrete and actionable]

**⚡ Real-time triggers**
- [2 bullets: events to fire in Segment, HubSpot, or via webhook]

You MUST invent a realistic persona for the demo, never "I have no customer data access". You play the behavioral AI engine that has already computed. Product, concise, B2B/B2C SaaS tone. Maximum 300 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    industry: str = Field("", max_length=80)
    company_size: str = Field("", max_length=40)
    behaviors: str = Field("", max_length=300)
    signals: str = Field("", max_length=300)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "personaai-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    industry = (req.industry or "").strip()
    size = (req.company_size or "").strip()
    behavior = (req.behaviors or req.signals or "").strip()

    if not industry and not behavior:
        raise HTTPException(status_code=400, detail="industry_or_behavior_required")

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = (
        "Signaux visiteur observes :\n"
        f"- Secteur : {industry or 'non renseigne'}\n"
        f"- Taille entreprise : {size or 'non renseignee'}\n"
        f"- Comportement : {behavior or 'non renseigne'}\n"
        "Genere le persona en temps reel."
        if req.lang == "fr"
        else (
            "Observed visitor signals:\n"
            f"- Industry: {industry or 'not provided'}\n"
            f"- Company size: {size or 'not provided'}\n"
            f"- Behavior: {behavior or 'not provided'}\n"
            "Generate the real-time persona."
        )
    )

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(industry, size, behavior, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception:
        return GenerateResponse(
            brief=_build_mock_brief(industry, size, behavior, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief (used when no LLM key configured)
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(industry: str, size: str, behavior: str, lang: str) -> str:
    ind = industry or ("SaaS B2B" if lang == "fr" else "B2B SaaS")
    if lang == "en":
        return (
            f"**🎯 Detected persona**\n"
            f"- Sarah, COO at a fast-growing {ind} scale-up ({size or '50-200 employees'}). She bounced 3x on the pricing page in 5 days and read the SOC2 whitepaper end-to-end. Pain: stuck on tools that don't scale with their go-to-market.\n\n"
            f"**📊 Propensity scoring**\n"
            f"- Conversion probability: 73% — high-intent behavior signal (pricing + compliance read)\n"
            f"- Estimated ARPU: USD 880/month — Growth tier most likely\n"
            f"- Recommended segment: enterprise-ready-coo — based on role + read pattern\n\n"
            f"**🎯 Engagement recommendations**\n"
            f"- Show \"Talk to a solutions engineer\" CTA instead of free-trial — high-intent visitors convert 4x more on assisted path\n"
            f"- Surface a SOC2 + ISO27001 trust badge banner above the fold\n"
            f"- Trigger LinkedIn ad retargeting on the COO persona within 24h\n\n"
            f"**⚡ Real-time triggers**\n"
            f"- Fire `persona_detected` event in Segment with payload `{{persona: \"enterprise-ready-coo\", score: 0.73}}`\n"
            f"- Push to HubSpot lifecycle stage \"MQL\" with priority flag for AE assignment."
        )
    return (
        f"**🎯 Persona detecte**\n"
        f"- Sarah, COO d'une scale-up {ind} en hyper-croissance ({size or '50-200 personnes'}). Elle a rebondi 3 fois sur la page pricing en 5 jours et a lu le whitepaper SOC2 en entier. Douleur : bloquee sur des outils qui ne scalent pas avec leur GTM.\n\n"
        f"**📊 Scoring de propension**\n"
        f"- Probabilite de conversion : 73% — signal d'intention eleve (pricing + compliance read)\n"
        f"- ARPU estime : EUR 820/mois — tier Growth probable\n"
        f"- Segment recommande : enterprise-ready-coo — base sur role + pattern de lecture\n\n"
        f"**🎯 Recommandations d'engagement**\n"
        f"- Afficher le CTA \"Parler a un ingenieur solutions\" plutot que free trial — les visiteurs hautement intentionnels convertissent 4x mieux sur parcours assistes\n"
        f"- Faire apparaitre un bandeau trust SOC2 + ISO27001 au-dessus de la ligne de flottaison\n"
        f"- Declencher du retargeting LinkedIn sur le persona COO sous 24h\n\n"
        f"**⚡ Triggers temps reel**\n"
        f"- Emettre l'evenement `persona_detected` dans Segment avec payload `{{persona: \"enterprise-ready-coo\", score: 0.73}}`\n"
        f"- Pousser dans HubSpot stage cycle de vie \"MQL\" avec flag priorite pour assignation AE."
    )
