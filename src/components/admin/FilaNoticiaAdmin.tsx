"use client";

import Link from "next/link";
import type { EstadoNoticia } from "@prisma/client";
import { eliminarNoticia } from "@/actions/noticias";
import { ConfirmacionEliminar } from "@/components/ui/ConfirmacionEliminar";

export function FilaNoticiaAdmin({
  id,
  titulo,
  estado,
  fecha,
  slug,
}: {
  id: string;
  titulo: string;
  estado: EstadoNoticia;
  fecha: string;
  slug: string;
}) {
  const publicada = estado === "PUBLICADA";

  return (
    <li className="flex flex-col gap-3 rounded-tarjeta border border-tierra-100 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <span
          className={`inline-flex w-fit rounded-boton px-3 py-1 text-chico font-bold ${
            publicada ? "bg-verde-100 text-verde-900" : "bg-tierra-100 text-tierra-900"
          }`}
        >
          {publicada ? "Publicada" : "Borrador"}
        </span>
        <p className="font-display text-h3 font-bold text-texto">{titulo}</p>
        <p className="text-chico text-texto-suave">{fecha}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/actividades/${id}`}
          className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900 flex items-center"
        >
          Editar
        </Link>
        <Link
          href={publicada ? `/actividades/${slug}` : `/admin/actividades/${id}/vista-previa`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 font-bold text-texto flex items-center"
        >
          Ver
        </Link>
        <ConfirmacionEliminar
          mensaje={`Se va a eliminar "${titulo}" para siempre. Esta acción no se puede deshacer.`}
          accionConfirmar={eliminarNoticia.bind(null, id)}
        />
      </div>
    </li>
  );
}
