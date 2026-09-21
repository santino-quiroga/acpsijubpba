"use client";

import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { eliminarComision, moverComisionOrden } from "@/actions/comisiones";
import { obtenerIconoComision } from "@/lib/iconos-comisiones";
import { ConfirmacionEliminar } from "@/components/ui/ConfirmacionEliminar";

export function FilaComision({
  comision,
  cantidadNoticias,
  esPrimera,
  esUltima,
}: {
  comision: { id: string; nombre: string; icono: string; activa: boolean };
  cantidadNoticias: number;
  esPrimera: boolean;
  esUltima: boolean;
}) {
  // El lookup siempre devuelve un componente estable desde un mapa fijo
  // (ICONOS_COMISION); no "crea" un componente distinto en cada render.
  const Icono = obtenerIconoComision(comision.icono);

  const mensajeEliminar =
    cantidadNoticias > 0
      ? `Se va a eliminar "${comision.nombre}". ${cantidadNoticias} noticia${cantidadNoticias === 1 ? "" : "s"} quedarán sin categoría.`
      : `Se va a eliminar "${comision.nombre}" para siempre. Esta acción no se puede deshacer.`;

  return (
    <li className="flex flex-col gap-3 rounded-tarjeta border border-tierra-100 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line react-hooks/static-components -- Icono viene de un mapa fijo, no se crea en cada render */}
        <Icono aria-hidden="true" size={28} className="text-verde-900" />
        <div>
          <p className="font-display text-h3 font-bold text-texto">{comision.nombre}</p>
          <span
            className={`inline-flex rounded-boton px-3 py-1 text-chico font-bold ${
              comision.activa ? "bg-verde-100 text-verde-900" : "bg-tierra-100 text-tierra-900"
            }`}
          >
            {comision.activa ? "Activa" : "Inactiva"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <form action={moverComisionOrden.bind(null, comision.id, "subir")}>
          <button
            type="submit"
            disabled={esPrimera}
            aria-label="Subir"
            className="flex h-11 w-11 items-center justify-center rounded-boton border-2 border-tierra-100 text-texto disabled:opacity-40"
          >
            <ChevronUp aria-hidden="true" />
          </button>
        </form>
        <form action={moverComisionOrden.bind(null, comision.id, "bajar")}>
          <button
            type="submit"
            disabled={esUltima}
            aria-label="Bajar"
            className="flex h-11 w-11 items-center justify-center rounded-boton border-2 border-tierra-100 text-texto disabled:opacity-40"
          >
            <ChevronDown aria-hidden="true" />
          </button>
        </form>
        <Link
          href={`/admin/comisiones/${comision.id}`}
          className="min-h-boton inline-flex items-center rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
        >
          Editar
        </Link>
        <ConfirmacionEliminar
          mensaje={mensajeEliminar}
          accionConfirmar={eliminarComision.bind(null, comision.id)}
        />
      </div>
    </li>
  );
}
