"use client";

import { useState } from "react";
import { ICONOS_COMISION } from "@/lib/iconos-comisiones";

// Grilla visual cerrada de íconos (sección 8.5): sin selector de texto.
export function SelectorIcono({
  nombre,
  valorInicial,
}: {
  nombre: string;
  valorInicial?: string;
}) {
  const [seleccionado, setSeleccionado] = useState(valorInicial || "users");

  return (
    <div>
      <input type="hidden" name={nombre} value={seleccionado} />
      <div
        role="radiogroup"
        aria-label="Ícono de la comisión"
        className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6"
      >
        {Object.entries(ICONOS_COMISION).map(([clave, Icono]) => {
          const activo = seleccionado === clave;
          return (
            <button
              key={clave}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => setSeleccionado(clave)}
              className={`flex flex-col items-center gap-1 rounded-boton border-2 p-3 ${
                activo
                  ? "border-verde-900 bg-verde-100 text-verde-900"
                  : "border-tierra-100 text-texto"
              }`}
            >
              <Icono size={24} aria-hidden="true" />
              <span className="text-chico">{clave}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
