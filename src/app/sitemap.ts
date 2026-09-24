import type { MetadataRoute } from "next";
import { obtenerSlugsNoticiasPublicadas } from "@/lib/noticias";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PAGINAS_ESTATICAS = [
  "",
  "/historia",
  "/objetivos",
  "/comision-directiva",
  "/contacto",
  "/noticias",
  "/noticias/proximas",
  "/noticias/realizadas",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const noticias = await obtenerSlugsNoticiasPublicadas();

  const estaticas: MetadataRoute.Sitemap = PAGINAS_ESTATICAS.map((ruta) => ({
    url: `${SITE_URL}${ruta}`,
  }));

  const deNoticias: MetadataRoute.Sitemap = noticias.map((noticia) => ({
    url: `${SITE_URL}/noticias/${noticia.slug}`,
    lastModified: noticia.updatedAt,
  }));

  return [...estaticas, ...deNoticias];
}
