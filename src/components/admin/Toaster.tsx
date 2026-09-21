"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

// Notificaciones tipo toast (sección 8.1): duran al menos 6 segundos y se
// pueden cerrar. Las Server Actions redirigen con ?aviso=...&tipo=exito|error
// y este componente las muestra una vez y limpia la URL.
const DURACION_MS = 6500;

export function Toaster() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [aviso, setAviso] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  useEffect(() => {
    const texto = searchParams.get("aviso");
    if (!texto) return;

    const tipo = searchParams.get("tipo") === "error" ? "error" : "exito";
    // Sincroniza con la URL (sistema externo) y dispara efectos (limpiar la
    // URL, temporizador de auto-cierre) que no pueden hacerse en el render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAviso({ texto, tipo });

    const parametrosLimpios = new URLSearchParams(searchParams);
    parametrosLimpios.delete("aviso");
    parametrosLimpios.delete("tipo");
    const queryString = parametrosLimpios.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });

    const temporizador = setTimeout(() => setAviso(null), DURACION_MS);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!aviso) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 flex justify-center md:inset-x-auto md:right-6"
    >
      <div
        className={`flex max-w-md items-start gap-3 rounded-tarjeta px-5 py-4 font-bold text-crema shadow-lg ${
          aviso.tipo === "error" ? "bg-error" : "bg-verde-900"
        }`}
      >
        <span className="flex-1">{aviso.texto}</span>
        <button
          type="button"
          onClick={() => setAviso(null)}
          aria-label="Cerrar aviso"
          className="shrink-0"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
