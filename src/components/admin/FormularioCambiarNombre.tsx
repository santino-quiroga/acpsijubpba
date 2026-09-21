"use client";

import { useActionState } from "react";
import { cambiarNombrePropio } from "@/actions/auth";
import { Boton } from "@/components/ui/Boton";

export function FormularioCambiarNombre({ nombreActual }: { nombreActual: string }) {
  const [estado, accion, pendiente] = useActionState(cambiarNombrePropio, undefined);

  return (
    <form action={accion} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="font-bold text-texto">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          defaultValue={nombreActual}
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={pendiente} className="self-start">
        Guardar nombre
      </Boton>
    </form>
  );
}
