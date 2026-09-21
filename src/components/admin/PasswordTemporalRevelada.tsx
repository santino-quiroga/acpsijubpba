"use client";

import { useState } from "react";
import { Boton } from "@/components/ui/Boton";

// Contraseña temporal mostrada una sola vez, con botón "Copiar" (sección 8.8).
export function PasswordTemporalRevelada({
  usuario,
  passwordTemporal,
  onCerrar,
}: {
  usuario: string;
  passwordTemporal: string;
  onCerrar: () => void;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(passwordTemporal);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      // Si no se puede copiar automáticamente, el texto ya está visible
      // para copiarlo a mano.
    }
  }

  return (
    <div className="rounded-tarjeta border-2 border-verde-900 bg-verde-100 p-5">
      <p className="font-bold text-verde-900">
        Contraseña temporal para &ldquo;{usuario}&rdquo;
      </p>
      <p className="mt-2 text-cuerpo">
        Copiala y compartísela ahora: no se vuelve a mostrar.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <code className="rounded-boton bg-crema px-4 py-2 text-h3 font-bold text-texto">
          {passwordTemporal}
        </code>
        <Boton type="button" onClick={copiar}>
          {copiado ? "¡Copiado!" : "Copiar"}
        </Boton>
      </div>
      <button
        type="button"
        onClick={onCerrar}
        className="mt-4 font-bold text-verde-900 underline"
      >
        Listo
      </button>
    </div>
  );
}
