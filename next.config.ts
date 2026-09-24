import type { NextConfig } from "next";

// CSP básico (sección 9.5): permite recursos propios, las imágenes de Vercel
// Blob (noticias, fotos de comisión directiva) y los estilos/inline scripts
// que ya usa la app (script anti-FOUC de escala de texto en layout.tsx,
// estilos de Tailwind). No hay scripts ni recursos de terceros.
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https://*.public.blob.vercel-storage.com",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // Imágenes de noticias subidas a Vercel Blob (sección 12 del SDD).
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Tope de tamaño para el Server Action de subida de imágenes (sección 9.5).
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
