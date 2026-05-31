import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es PersonaAI, un moteur de profiling comportemental B2C/B2B SaaS qui construit en temps reel un buyer persona a partir de signaux observes sur un visiteur (parcours, secteur, taille, comportement). Tu inventes un persona detaille avec scoring de propension et recommandations d'engagement personnalisees.

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

Tu DOIS inventer un persona realiste pour la demo, jamais "je n'ai pas access aux donnees client". Tu joues le moteur d'IA comportementale qui a deja calcule. Style produit, concis, B2B/B2C SaaS. Maximum 300 mots.`;

const SYSTEM_PROMPT_EN = `You are PersonaAI, a behavioral profiling engine for B2C/B2B SaaS that builds a buyer persona in real time from observed visitor signals (journey, industry, size, behavior). You invent a detailed persona with propensity scoring and personalized engagement recommendations.

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

You MUST invent a realistic persona for the demo, never "I have no customer data access". You play the behavioral AI engine that has already computed. Product, concise, B2B/B2C SaaS tone. Maximum 300 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const industry: string = typeof body.industry === "string" ? body.industry.trim().slice(0, 80) : "";
    const companySize: string = typeof body.companySize === "string" ? body.companySize.trim().slice(0, 40) : "";
    const behavior: string = typeof body.behavior === "string" ? body.behavior.trim().slice(0, 300) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!industry && !behavior) {
      return NextResponse.json(
        { error: lang === "fr" ? "Renseignez au moins le secteur ou le comportement observe." : "Provide at least industry or observed behavior." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMockBrief(industry, companySize, behavior, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Signaux visiteur observes :\n- Secteur : ${industry || "non renseigne"}\n- Taille entreprise : ${companySize || "non renseignee"}\n- Comportement : ${behavior || "non renseigne"}\nGenere le persona en temps reel.`
      : `Observed visitor signals:\n- Industry: ${industry || "not provided"}\n- Company size: ${companySize || "not provided"}\n- Behavior: ${behavior || "not provided"}\nGenerate the real-time persona.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      900
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMockBrief(industry: string, size: string, behavior: string, lang: "fr" | "en"): string {
  const ind = industry || (lang === "fr" ? "SaaS B2B" : "B2B SaaS");
  if (lang === "en") {
    return `**🎯 Detected persona**\n- Sarah, COO at a fast-growing ${ind} scale-up (${size || "50-200 employees"}). She bounced 3x on the pricing page in 5 days and read the SOC2 whitepaper end-to-end. Pain: stuck on tools that don't scale with their go-to-market.\n\n**📊 Propensity scoring**\n- Conversion probability: 73% — high-intent behavior signal (pricing + compliance read)\n- Estimated ARPU: USD 880/month — Growth tier most likely\n- Recommended segment: enterprise-ready-coo — based on role + read pattern\n\n**🎯 Engagement recommendations**\n- Show "Talk to a solutions engineer" CTA instead of free-trial — high-intent visitors convert 4x more on assisted path\n- Surface a SOC2 + ISO27001 trust badge banner above the fold\n- Trigger LinkedIn ad retargeting on the COO persona within 24h\n\n**⚡ Real-time triggers**\n- Fire \`persona_detected\` event in Segment with payload \`{persona: "enterprise-ready-coo", score: 0.73}\`\n- Push to HubSpot lifecycle stage "MQL" with priority flag for AE assignment.`;
  }
  return `**🎯 Persona detecte**\n- Sarah, COO d'une scale-up ${ind} en hyper-croissance (${size || "50-200 personnes"}). Elle a rebondi 3 fois sur la page pricing en 5 jours et a lu le whitepaper SOC2 en entier. Douleur : bloquee sur des outils qui ne scalent pas avec leur GTM.\n\n**📊 Scoring de propension**\n- Probabilite de conversion : 73% — signal d'intention eleve (pricing + compliance read)\n- ARPU estime : EUR 820/mois — tier Growth probable\n- Segment recommande : enterprise-ready-coo — base sur role + pattern de lecture\n\n**🎯 Recommandations d'engagement**\n- Afficher le CTA "Parler a un ingenieur solutions" plutot que free trial — les visiteurs hautement intentionnels convertissent 4x mieux sur parcours assistes\n- Faire apparaitre un bandeau trust SOC2 + ISO27001 au-dessus de la ligne de flottaison\n- Declencher du retargeting LinkedIn sur le persona COO sous 24h\n\n**⚡ Triggers temps reel**\n- Emettre l'evenement \`persona_detected\` dans Segment avec payload \`{persona: "enterprise-ready-coo", score: 0.73}\`\n- Pousser dans HubSpot stage cycle de vie "MQL" avec flag priorite pour assignation AE.`;
}
