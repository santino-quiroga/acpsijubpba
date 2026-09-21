import Image from "next/image";
import Link from "next/link";
import type { ComisionTrabajo, Noticia } from "@prisma/client";
import { formatearFecha } from "@/lib/formato";
import { BotonCopiarEnlace } from "@/components/publico/BotonCopiarEnlace";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function DetalleNoticia({
  noticia,
}: {
  noticia: Noticia & { comision: ComisionTrabajo | null };
}) {
  const url = `${SITE_URL}/noticias/${noticia.slug}`;
  const textoWhatsapp = encodeURIComponent(`${noticia.titulo} ${url}`);

  return (
    <article className="mx-auto max-w-prosa px-4 py-12 md:px-6">
      <Link href="/noticias" className="font-bold text-verde-900 underline">
        ← Volver a noticias
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-chico text-texto-suave">
        <time dateTime={noticia.fechaPublicacion?.toISOString()}>
          {noticia.fechaPublicacion ? formatearFecha(noticia.fechaPublicacion) : ""}
        </time>
        {noticia.comision && (
          <span className="rounded-boton bg-verde-100 px-3 py-1 font-bold text-verde-900">
            {noticia.comision.nombre}
          </span>
        )}
      </div>

      <h1 className="mt-3 font-display text-h1 font-bold text-verde-900">
        {noticia.titulo}
      </h1>

      {noticia.imagenUrl && (
        <Image
          src={noticia.imagenUrl}
          alt={noticia.imagenAlt ?? ""}
          width={800}
          height={450}
          className="mt-6 h-auto w-full rounded-tarjeta object-cover"
        />
      )}

      <div
        className="contenido-html mt-6 text-cuerpo"
        dangerouslySetInnerHTML={{ __html: noticia.contenidoHtml }}
      />

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`https://wa.me/?text=${textoWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-boton items-center rounded-boton bg-verde-900 px-4 font-bold text-crema hover:bg-verde-700"
        >
          Compartir por WhatsApp
        </a>
        <BotonCopiarEnlace url={url} />
      </div>
    </article>
  );
}
