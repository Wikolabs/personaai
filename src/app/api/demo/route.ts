import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In docker-compose: BACKEND_URL=http://personaai-backend:8000
// In local dev (next dev outside compose): falls back to localhost
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: Request) {
  let body: {
    industry?: string;
    companySize?: string;
    behavior?: string;
    signals?: string;
    behaviors?: string;
    lang?: "fr" | "en";
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const industry = typeof body.industry === "string" ? body.industry.trim().slice(0, 80) : "";
  const companySize = typeof body.companySize === "string" ? body.companySize.trim().slice(0, 40) : "";
  const behavior =
    typeof body.behavior === "string"
      ? body.behavior.trim().slice(0, 300)
      : typeof body.behaviors === "string"
      ? body.behaviors.trim().slice(0, 300)
      : "";
  const signals = typeof body.signals === "string" ? body.signals.trim().slice(0, 300) : "";
  const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

  if (!industry && !behavior && !signals) {
    return NextResponse.json(
      {
        error:
          lang === "fr"
            ? "Renseignez au moins le secteur ou le comportement observe."
            : "Provide at least industry or observed behavior.",
      },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        industry,
        company_size: companySize,
        behaviors: behavior,
        signals,
        lang,
      }),
      cache: "no-store",
    });
    const j = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: j.detail || "backend_error" }, { status: r.status });
    }
    return NextResponse.json({
      brief: j.brief,
      model: j.model,
      generatedAt: j.generated_at,
      staticMode: Boolean(j.static_mode),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ error: `backend_unreachable: ${msg}` }, { status: 502 });
  }
}
