import type { Metadata } from "next";
import { Cardo, Work_Sans } from "next/font/google";
import "./globals.css";

const cardo = Cardo({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "PersonaAI — Chaque client reçoit l'offre faite pour lui",
  description:
    "Moteur de recommandation personnalisée en temps réel — produits, contenus, offres adaptés à chaque profil utilisateur.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cardo.variable} ${workSans.variable}`}>
      <body
        style={{
          backgroundColor: "#fff5f5",
          fontFamily: "var(--font-body)",
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
