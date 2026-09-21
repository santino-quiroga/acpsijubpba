"use client";

import { useActionState, useState } from "react";
import type { ComisionTrabajo } from "@prisma/client";
import { guardarComisionAction } from "@/actions/comisiones";
import { SelectorIcono } from "@/components/admin/SelectorIcono";
import { Boton } from "@/components/ui/Boton";

export function FormularioComision({ comision }: { comision?: ComisionTrabajo | null }) {
  const [estado, accion, pendiente] = useActionState(guardarComisionAction, undefined);
  const [descripcion, setDescripcion] = useState(comision?.descripcion ?? "");

  return (
    <form action={accion} className="flex max-w-prosa flex-col gap-6">
      {comision && <input type="hidden" name="id" value={comision.id} />}

      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="font-bold text-texto">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          maxLength={80}
          required
          defaultValue={comision?.nombre}
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="descripcion" className="font-bold text-texto">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          maxLength={400}
          required
          rows={3}
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
          className="rounded-boton border-2 border-tierra-100 px-4 py-2 text-cuerpo focus:border-verde-700"
        />
        <p className="text-chico text-texto-suave">{descripcion.length}/400 caracteres</p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold text-texto">Ícono</span>
        <SelectorIcono nombre="icono" valorInicial={comision?.icono} />
      </div>

      <label className="flex items-center gap-3 font-bold text-texto">
        <input
          type="checkbox"
          name="activa"
          defaultChecked={comision?.activa ?? true}
          className="h-6 w-6"
        />
        Activa (se muestra en el sitio)
      </label>

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={pendiente} className="self-start">
        {comision ? "Guardar cambios" : "Crear comisión"}
      </Boton>
    </form>
  );
}
