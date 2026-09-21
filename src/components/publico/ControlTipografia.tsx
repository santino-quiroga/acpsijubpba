"use client";

import { useEffect, useState } from "react";

// 3 niveles de escala de texto (sección 3.2). El valor se aplica como
// variable CSS `--escala-texto`, que multiplica el font-size base del
// <html> definido en globals.css. El script anti-parpadeo en el layout
// raíz aplica el valor guardado antes de la primera pintura.
export const NIVELES_ESCALA_TEXTO = [1, 1.15, 1.3] as const;
export const CLAVE_ESCALA_TEXTO = "acp-escala-texto";

function aplicarNivel(indice: number) {
  document.documentElement.style.setProperty(
    "--escala-texto",
    String(NIVELES_ESCALA_TEXTO[indice]),
  );
}

export function ControlTipografia() {
  const [nivel, setNivel] = useState(0);

  useEffect(() => {
    // Lectura única de localStorage al montar, para reflejar en los botones
    // (deshabilitados en los extremos) el nivel que el script anti-parpadeo
    // del layout raíz ya aplicó visualmente antes de esta hidratación.
    const guardado = window.localStorage.getItem(CLAVE_ESCALA_TEXTO);
    const inicial = guardado ? Number(guardado) : 0;
    if (inicial >= 0 && inicial <= 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNivel(inicial);
    }
  }, []);

  function cambiar(delta: number) {
    setNivel((actual) => {
      const siguiente = Math.min(2, Math.max(0, actual + delta));
      aplicarNivel(siguiente);
      window.localStorage.setItem(CLAVE_ESCALA_TEXTO, String(siguiente));
      return siguiente;
    });
  }

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Tamaño de letra"
    >
      <button
        type="button"
        onClick={() => cambiar(-1)}
        disabled={nivel === 0}
        aria-label="Achicar letra"
        className="flex h-11 w-11 items-center justify-center rounded-boton border-2 border-verde-900 font-bold text-verde-900 disabled:opacity-40"
      >
        A−
      </button>
      <button
        type="button"
        onClick={() => cambiar(1)}
        disabled={nivel === 2}
        aria-label="Agrandar letra"
        className="flex h-11 w-11 items-center justify-center rounded-boton border-2 border-verde-900 font-bold text-verde-900 disabled:opacity-40"
      >
        A+
      </button>
    </div>
  );
}
