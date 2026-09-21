import type { NextConfig } from "next";

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
};

export default nextConfig;
