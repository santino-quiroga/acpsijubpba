import type { NextConfig } from "next";

// CSP básico (sección 9.5): permite recursos propios, las imágenes de
// actividades en Vercel Blob y los scripts/estilos inline que ya usa la app
// (script anti-FOUC y JSON-LD en layout.tsx, `@font-face` inyectado por
// next/font). No hay scripts ni recursos de terceros.
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https://*.public.blob.vercel-storage.com",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join("; ");

// Solo en producción: en `next dev`, Turbopack/React usan eval() para el
// hot reload y los overlays de error, que un CSP sin 'unsafe-eval' bloquea
// (rompe la app en desarrollo). No tiene sentido relajar el CSP real para
// esto, así que en dev directamente no se manda el header.
const esProduccion = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    // Imágenes de actividades subidas a Vercel Blob (sección 12 del SDD).
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    // "Noticias" se renombró a "Actividades" (pedido de la asociación, ver
    // docs/DECISIONES.md). El sitio ya estaba en producción con las URLs
    // viejas, así que se redirigen en vez de romperlas.
    return [
      { source: "/noticias", destination: "/actividades", permanent: true },
      {
        source: "/noticias/proximas",
        destination: "/actividades/proximas",
        permanent: true,
      },
      {
        source: "/noticias/realizadas",
        destination: "/actividades/realizadas",
        permanent: true,
      },
      {
        source: "/noticias/:slug",
        destination: "/actividades/:slug",
        permanent: true,
      },
      {
        source: "/admin/noticias",
        destination: "/admin/actividades",
        permanent: true,
      },
      {
        source: "/admin/noticias/nueva",
        destination: "/admin/actividades/nueva",
        permanent: true,
      },
      {
        source: "/admin/noticias/:id",
        destination: "/admin/actividades/:id",
        permanent: true,
      },
      {
        source: "/admin/noticias/:id/vista-previa",
        destination: "/admin/actividades/:id/vista-previa",
        permanent: true,
      },
    ];
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
          ...(esProduccion
            ? [{ key: "Content-Security-Policy", value: CSP }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
