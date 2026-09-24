import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Lora } from "next/font/google";
import { obtenerUrlSitio } from "@/lib/site-url";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const SITE_URL = obtenerUrlSitio();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ACPSIJUPBA",
    template: "%s | ACPSIJUPBA",
  },
  description:
    "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires.",
};

// JSON-LD Organization (sección 12 del SDD). Datos fijos: el nombre, la
// descripción y el logo no dependen del contenido editable del panel.
const JSON_LD_ORGANIZACION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires",
  alternateName: "ACPSIJUPBA",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires.",
};

// Aplica antes del primer pintado la escala de texto guardada por el control
// A−/A+ (ControlTipografia.tsx), para que no haya un salto visible al cargar.
const SCRIPT_ESCALA_TEXTO = `(function () {
  try {
    var niveles = [1, 1.15, 1.3];
    var guardado = window.localStorage.getItem("acp-escala-texto");
    var indice = guardado ? parseInt(guardado, 10) : 0;
    if (indice >= 0 && indice <= 2) {
      document.documentElement.style.setProperty("--escala-texto", String(niveles[indice]));
    }
  } catch (error) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      className={`${atkinson.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ESCALA_TEXTO }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORGANIZACION) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
