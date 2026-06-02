"use client";
import { useState } from "react";

const PRODUCT = "PersonaAI";

const PAL = {
  bg: "#FFFBF5",
  bg2: "#FEE7D2",
  surface: "rgba(0,0,0,0.035)",
  surfaceHover: "rgba(0,0,0,0.06)",
  border: "rgba(0,0,0,0.08)",
  txt1: "#1F1611",
  txt2: "#5A4738",
  txt3: "#9A8470",
  accent: "#C2410C",
  accentSoft: "rgba(194,65,12,0.10)",
  accentBorder: "rgba(194,65,12,0.30)",
  accentGlow: "rgba(194,65,12,0.15)",
  navBg: "rgba(255,251,245,0.85)",
};

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [behavior, setBehavior] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " — buyer persona genere en temps reel",
    desc: "Renseignez les signaux observes sur un visiteur de votre site. Le moteur IA construit un persona detaille avec scoring de propension et recommandations d'engagement. Aucune connexion reelle aux trackers — c'est un POC qui montre la logique de production.",
    indLabel: "Secteur du visiteur", indPlaceholder: "ex: SaaS B2B, retail, finance, healthtech",
    sizeLabel: "Taille de l'entreprise", sizePlaceholder: "ex: 50-200 personnes",
    behaviorLabel: "Comportement observe", behaviorPlaceholder: "ex: 3 visites en 5 jours, pricing page revue, whitepaper SOC2 lu jusqu'au bout, demande de demo abandonnee a l'etape 2",
    generate: "Generer le persona", generating: "Calcul en cours...",
    briefTitle: "Persona genere", emptyHint: "Le persona, scoring et recommandations apparaitront ici.",
    sendSegment: "Pousser dans Segment", syncHubspot: "Sync vers HubSpot", retargetLinkedin: "Retargeter sur LinkedIn",
    sentMock: "Event \`persona_detected\` envoye dans Segment (mode demo, pas de connexion reelle)",
    syncedMock: "Lead pousse dans HubSpot lifecycle MQL (mode demo, pas de connexion reelle)",
    retargetedMock: "Audience LinkedIn Ads creee : COO scale-up SaaS B2B (mode demo)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC — aucune connexion reelle a Segment, HubSpot, LinkedIn Ads. L'IA imagine le persona pour la demonstration.",
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " — real-time buyer persona generation",
    desc: "Provide observed signals from a visitor on your site. The AI engine builds a detailed persona with propensity scoring and engagement recommendations. No real tracker connection — this is a POC showing production logic.",
    indLabel: "Visitor industry", indPlaceholder: "e.g. B2B SaaS, retail, finance, healthtech",
    sizeLabel: "Company size", sizePlaceholder: "e.g. 50-200 employees",
    behaviorLabel: "Observed behavior", behaviorPlaceholder: "e.g. 3 visits in 5 days, pricing page reviewed, SOC2 whitepaper read end-to-end, demo request abandoned at step 2",
    generate: "Generate persona", generating: "Computing...",
    briefTitle: "Generated persona", emptyHint: "Persona, scoring and recommendations will appear here.",
    sendSegment: "Push to Segment", syncHubspot: "Sync to HubSpot", retargetLinkedin: "Retarget on LinkedIn",
    sentMock: "Event \`persona_detected\` pushed to Segment (demo mode, no real connection)",
    syncedMock: "Lead pushed to HubSpot lifecycle MQL (demo mode, no real connection)",
    retargetedMock: "LinkedIn Ads audience created: COO B2B SaaS scale-up (demo mode)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC — no real connection to Segment, HubSpot, LinkedIn Ads. The AI imagines the persona for demonstration.",
  };

  async function generate() {
    setError(""); setBrief(""); setModel(""); setStaticMode(false);
    if (!industry.trim() && !behavior.trim()) {
      setError(lang === "fr" ? "Renseignez au moins le secteur ou le comportement." : "Provide at least industry or behavior.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/offers/personaai/demo/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: industry.trim(), companySize: companySize.trim(), behavior: behavior.trim(), lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setBrief(j.mockBrief || "");
        setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setBrief(j.brief || "");
        setModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #FFFFFF; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: ${PAL.surface}; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← {t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: PAL.surface }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} · <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
          <section style={{ background: PAL.surface, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 14px" }}>{t.indLabel}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <input className="wk-input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder={t.indPlaceholder} />
              <label style={{ fontSize: 11, color: PAL.txt3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginTop: 6 }}>{t.sizeLabel}</label>
              <input className="wk-input" value={companySize} onChange={(e) => setCompanySize(e.target.value)} placeholder={t.sizePlaceholder} />
              <label style={{ fontSize: 11, color: PAL.txt3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginTop: 6 }}>{t.behaviorLabel}</label>
              <textarea className="wk-input" value={behavior} onChange={(e) => setBehavior(e.target.value)} placeholder={t.behaviorPlaceholder} rows={4} style={{ resize: "vertical", fontFamily: "inherit" }} />
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? `⏳ ${t.generating}` : `🧬 ${t.generate}`}
            </button>
            {error && <div style={{ marginTop: 12, color: "#B91C1C", fontSize: 13, padding: "8px 12px", background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.3)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: brief ? "#16A34A" : PAL.txt3 }} />
                {t.briefTitle}
              </h2>
              {model && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {model}</span>}
            </div>

            {!brief ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>
                {t.emptyHint}
              </div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} />
            )}

            {brief && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.sentMock)}>📡 {t.sendSegment}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.syncedMock)}>🧲 {t.syncHubspot}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.retargetedMock)}>🎯 {t.retargetLinkedin}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, backdropFilter: "blur(20px)", boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}
