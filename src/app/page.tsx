export default function Page() {
  return (
    <main style={{ color: "#1a0a0a", fontFamily: "var(--font-body)" }}>
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 2.5rem",
          borderBottom: "1px solid #fecaca",
          backgroundColor: "#fff5f5",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#991b1b",
            letterSpacing: "0.02em",
          }}
        >
          PersonaAI
        </span>
        <a
          href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer"
          style={{
            backgroundColor: "#991b1b",
            color: "#fff",
            padding: "0.55rem 1.4rem",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Demander une démo
        </a>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "5rem 2rem 3rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#991b1b",
            marginBottom: "1.5rem",
          }}
        >
          Personnalisation en temps réel
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            lineHeight: 1.2,
            fontWeight: 700,
            marginBottom: "1.25rem",
            color: "#1a0a0a",
          }}
        >
          Chaque client reçoit l'offre faite pour lui
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#450a0a",
            lineHeight: 1.75,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            marginBottom: "2.5rem",
          }}
        >
          Deux visiteurs, deux expériences. PersonaAI analyse les comportements en temps réel
          et délivre la recommandation la plus pertinente à chaque individu.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://calendly.com/wikolabs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#991b1b",
              color: "#fff",
              padding: "0.85rem 2.2rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            📅 Réserver un créneau →
          </a>
          <a
            href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20PersonaAI%20avec%20Wikolabs."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#25d366",
              color: "#fff",
              padding: "0.85rem 2.2rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            💬 WhatsApp →
          </a>
        </div>
      </section>

      {/* Profiles comparison */}
      <section
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            textAlign: "center",
            fontSize: "1.5rem",
            marginBottom: "2rem",
            color: "#1a0a0a",
          }}
        >
          Même plateforme. Expériences personnalisées.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {[
            {
              name: "Sophie, 34 ans",
              tags: ["Running", "Nutrition sportive", "Marathons"],
              recs: [
                { name: "Chaussures trail X-Pro", price: "149 €", badge: "Votre taille en stock" },
                { name: "Pack gel énergétique 12×", price: "28 €", badge: "Réassort automatique" },
                { name: "Programme marathon 16 sem.", price: "Inclus", badge: "Recommandé par l'IA" },
              ],
            },
            {
              name: "Marc, 52 ans",
              tags: ["Golf", "Voyages", "Premium"],
              recs: [
                { name: "Driver Titleist TSR3", price: "549 €", badge: "Édition limitée" },
                { name: "Séjour golf Algarve 5J", price: "1 290 €", badge: "Offre exclusive" },
                { name: "Gants cuir premium", price: "89 €", badge: "Assort. profil" },
              ],
            },
          ].map((profile, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "1.75rem",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: "#fecaca",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "#991b1b",
                    fontSize: "1rem",
                  }}
                >
                  {profile.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a0a0a" }}>{profile.name}</div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                    {profile.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          backgroundColor: "#fff5f5",
                          border: "1px solid #fecaca",
                          color: "#991b1b",
                          fontSize: "0.7rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "3px",
                          fontWeight: 600,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.08em" }}>
                Recommandations personnalisées
              </p>
              {profile.recs.map((r, j) => (
                <div
                  key={j}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "6px",
                    backgroundColor: "#fff5f5",
                    marginBottom: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem" }}>{r.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#991b1b", marginTop: "0.15rem" }}>{r.badge}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: "#991b1b", fontSize: "0.9rem" }}>{r.price}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: "#fef2f2", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              textAlign: "center",
              fontSize: "1.5rem",
              marginBottom: "2.5rem",
              color: "#1a0a0a",
            }}
          >
            La personnalisation de précision
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { title: "Collaborative filtering", desc: "Analyse les patterns comportementaux collectifs pour affiner chaque recommandation individuelle." },
              { title: "Scoring en temps réel", desc: "Chaque action déclenche un recalcul immédiat du score de pertinence — latence < 50ms." },
              { title: "A/B testing intégré", desc: "Testez plusieurs stratégies de recommandation en parallèle avec significativité statistique automatique." },
            ].map((f, i) => (
              <div key={i} style={{ padding: "1.5rem 0" }}>
                <div style={{ width: "32px", height: "2px", backgroundColor: "#991b1b", marginBottom: "1rem" }} />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#450a0a", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "#1a0a0a" }}>
          Chaque client mérite une expérience sur mesure
        </h2>
        <p style={{ color: "#450a0a", fontFamily: "var(--font-display)", fontStyle: "italic", marginBottom: "2rem" }}>
          Déploiement en 1 semaine. ROI mesurable dès le premier mois.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://calendly.com/wikolabs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: "2px solid #991b1b",
              color: "#991b1b",
              padding: "0.85rem 2.5rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.04em",
            }}
          >
            📅 Réserver un créneau →
          </a>
          <a
            href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20PersonaAI%20avec%20Wikolabs."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#25d366",
              border: "2px solid #25d366",
              color: "#fff",
              padding: "0.85rem 2.5rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.04em",
            }}
          >
            💬 WhatsApp →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #fecaca",
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "0.8rem",
          color: "#991b1b",
          fontFamily: "var(--font-display)",
        }}
      >
        © 2025 PersonaAI — Un produit Wikolabs
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "0.5rem", fontSize: "0.8rem" }}>
          <a href="mailto:team@wikolabs.com" style={{ textDecoration: "none", color: "inherit" }}>team@wikolabs.com</a>
          <span>·</span>
          <a href="tel:+261386626100" style={{ textDecoration: "none", color: "inherit" }}>+261 38 66 261 00</a>
          <span>·</span>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>Prendre RDV</button>
        </div>
      </footer>
    </main>
  );
}
