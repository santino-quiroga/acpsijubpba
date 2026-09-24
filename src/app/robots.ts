import type { MetadataRoute } from "next";
import { obtenerUrlSitio } from "@/lib/site-url";

const SITE_URL = obtenerUrlSitio();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/ingresar"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
