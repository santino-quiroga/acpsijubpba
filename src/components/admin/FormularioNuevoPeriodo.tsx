"use client";

import { useActionState, useState } from "react";
import { crearPeriodoAction } from "@/actions/comision-directiva";
import { Boton } from "@/components/ui/Boton";

export function FormularioNuevoPeriodo({ periodoActualId }: { periodoActualId?: string }) {
  const [abierto, setAbierto] = useState(false);
  const [estado, accion, pendiente] = useActionState(crearPeriodoAction, undefined);

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
      >
        Nuevo período
      </button>
    );
  }

  return (
    <form
      action={accion}
      className="flex flex-col gap-4 rounded-tarjeta border border-tierra-100 p-5"
    >
      {periodoActualId && <input type="hidden" name="periodoOrigenId" value={periodoActualId} />}

      <div className="flex flex-col gap-2">
        <label htmlFor="nombre-periodo" className="font-bold text-texto">
          Nombre del período
        </label>
        <input
          id="nombre-periodo"
          name="nombre"
          type="text"
          required
          placeholder="Ej: 2027–2029"
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>

      {periodoActualId && (
        <label className="flex items-center gap-3 font-bold text-texto">
          <input type="checkbox" name="copiarMiembros" defaultChecked className="h-6 w-6" />
          Copiar los miembros del período actual como punto de partida
        </label>
      )}

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <div className="flex gap-3">
        <Boton type="submit" disabled={pendiente}>
          Crear período
        </Boton>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="min-h-boton rounded-boton border-2 border-tierra-900 px-4 font-bold text-tierra-900"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
