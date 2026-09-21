"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function BotonCopiarEnlace({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);

  async function alHacerClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      // Si el navegador no permite copiar, no rompemos nada: el usuario
      // puede copiar el enlace de la barra de direcciones.
    }
  }

  return (
    <button
      type="button"
      onClick={alHacerClick}
      className="inline-flex min-h-boton items-center gap-2 rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
    >
      {copiado ? <Check size={20} aria-hidden="true" /> : <Link2 size={20} aria-hidden="true" />}
      {copiado ? "¡Enlace copiado!" : "Copiar enlace"}
    </button>
  );
}
