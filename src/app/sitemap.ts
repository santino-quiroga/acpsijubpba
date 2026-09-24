import type { MetadataRoute } from "next";
import { obtenerSlugsNoticiasPublicadas } from "@/lib/noticias";
import { obtenerUrlSitio } from "@/lib/site-url";

const SITE_URL = obtenerUrlSitio();

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
