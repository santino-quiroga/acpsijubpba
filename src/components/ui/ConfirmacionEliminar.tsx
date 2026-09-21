"use client";

import { useState } from "react";

// Confirmación en modal antes de cualquier eliminación (sección 3.2 del SDD).
export function ConfirmacionEliminar({
  etiquetaBoton = "Eliminar",
  mensaje,
  accionConfirmar,
}: {
  etiquetaBoton?: string;
  mensaje: string;
  accionConfirmar: () => void | Promise<void>;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="min-h-boton rounded-boton border-2 border-error px-4 font-bold text-error"
      >
        {etiquetaBoton}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-confirmacion"
          className="fixed inset-0 z-50 flex items-center justify-center bg-texto/40 p-4"
        >
          <div className="w-full max-w-sm rounded-tarjeta bg-crema p-6">
            <h2 id="titulo-confirmacion" className="font-display text-h3 font-bold text-texto">
              ¿Confirmás esta acción?
            </h2>
            <p className="mt-2 text-cuerpo">{mensaje}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
              >
                Cancelar
              </button>
              <form
                action={async () => {
                  await accionConfirmar();
                }}
              >
                <button
                  type="submit"
                  className="min-h-boton rounded-boton bg-error px-6 font-bold text-crema hover:bg-error/90"
                >
                  {etiquetaBoton}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
