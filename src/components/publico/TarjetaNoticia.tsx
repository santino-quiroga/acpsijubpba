import Image from "next/image";
import Link from "next/link";
import type { ComisionTrabajo, Noticia } from "@prisma/client";
import { formatearFecha } from "@/lib/formato";

export function TarjetaNoticia({
  noticia,
}: {
  noticia: Noticia & { comision: ComisionTrabajo | null };
}) {
  return (
    <li className="flex flex-col overflow-hidden rounded-tarjeta border border-tierra-100 bg-crema">
      {noticia.imagenUrl ? (
        <Image
          src={noticia.imagenUrl}
          alt={noticia.imagenAlt ?? ""}
          width={400}
          height={225}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="h-44 w-full bg-verde-100" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-chico text-texto-suave">
          {noticia.fechaPublicacion && (
            <time dateTime={noticia.fechaPublicacion.toISOString()}>
              {formatearFecha(noticia.fechaPublicacion)}
            </time>
          )}
          {noticia.comision && (
            <span className="rounded-boton bg-verde-100 px-2 py-0.5 font-bold text-verde-900">
              {noticia.comision.nombre}
            </span>
          )}
        </div>
        <h3 className="font-display text-h3 font-bold text-texto">{noticia.titulo}</h3>
        <p className="flex-1 text-cuerpo text-texto-suave">{noticia.resumen}</p>
        <Link
          href={`/noticias/${noticia.slug}`}
          className="mt-2 font-bold text-verde-900 underline"
        >
          Leer noticia completa
        </Link>
      </div>
    </li>
  );
}
