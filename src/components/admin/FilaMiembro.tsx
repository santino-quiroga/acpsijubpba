"use client";

import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { MiembroComision } from "@prisma/client";
import { eliminarMiembro, moverMiembroOrden } from "@/actions/comision-directiva";
import { AvatarIniciales } from "@/components/publico/AvatarIniciales";
import { formatearNombreConTitulo } from "@/lib/formato";
import { ConfirmacionEliminar } from "@/components/ui/ConfirmacionEliminar";

export function FilaMiembro({
  miembro,
  esPrimero,
  esUltimo,
}: {
  miembro: MiembroComision;
  esPrimero: boolean;
  esUltimo: boolean;
}) {
  return (
    <li className="flex flex-col gap-3 rounded-tarjeta border border-tierra-100 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <AvatarIniciales
          nombre={miembro.nombre}
          apellido={miembro.apellido}
          fotoUrl={miembro.fotoUrl}
        />
        <div>
          {miembro.cargo && (
            <p className="font-display font-bold text-verde-900">{miembro.cargo}</p>
          )}
          <p className="text-cuerpo">
            {formatearNombreConTitulo(miembro.titulo, miembro.nombre, miembro.apellido)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <form action={moverMiembroOrden.bind(null, miembro.id, miembro.periodoId, "subir")}>
          <button
            type="submit"
            disabled={esPrimero}
            aria-label="Subir"
            className="flex h-11 w-11 items-center justify-center rounded-boton border-2 border-tierra-100 text-texto disabled:opacity-40"
          >
            <ChevronUp aria-hidden="true" />
          </button>
        </form>
        <form action={moverMiembroOrden.bind(null, miembro.id, miembro.periodoId, "bajar")}>
          <button
            type="submit"
            disabled={esUltimo}
            aria-label="Bajar"
            className="flex h-11 w-11 items-center justify-center rounded-boton border-2 border-tierra-100 text-texto disabled:opacity-40"
          >
            <ChevronDown aria-hidden="true" />
          </button>
        </form>
        <Link
          href={`/admin/comision-directiva/miembros/${miembro.id}`}
          className="min-h-boton inline-flex items-center rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
        >
          Editar
        </Link>
        <ConfirmacionEliminar
          mensaje={`Se va a eliminar a "${miembro.nombre} ${miembro.apellido}" de este período. Esta acción no se puede deshacer.`}
          accionConfirmar={eliminarMiembro.bind(null, miembro.id, miembro.periodoId)}
        />
      </div>
    </li>
  );
}
