import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerNoticiaPorSlug } from "@/lib/noticias";
import { DetalleNoticia } from "@/components/publico/DetalleNoticia";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await obtenerNoticiaPorSlug(slug);

  if (!noticia || noticia.estado !== "PUBLICADA") {
    return { title: "Noticia no encontrada" };
  }

  return {
    title: noticia.titulo,
    description: noticia.resumen,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen,
      images: noticia.imagenUrl ? [noticia.imagenUrl] : undefined,
    },
  };
}

export default async function PaginaDetalleNoticia({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = await obtenerNoticiaPorSlug(slug);

  // Un borrador responde 404 públicamente (sección 7.7); los admins lo ven
  // desde /admin/noticias/[id]/vista-previa.
  if (!noticia || noticia.estado !== "PUBLICADA") notFound();

  return <DetalleNoticia noticia={noticia} />;
}
