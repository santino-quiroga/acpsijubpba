import type { Metadata } from "next";

// Listado real con paginación y filtro por comisión: Fase 4 (sección 7.6).
export const metadata: Metadata = {
  title: "Noticias",
  description: "Novedades de ACPSIJUPBA.",
};

export default function PaginaNoticias() {
  return (
    <div className="mx-auto max-w-prosa px-4 py-16 text-center md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Noticias
      </h1>
      <p className="mt-4 text-cuerpo text-texto-suave">
        Esta sección está en construcción. Muy pronto vas a encontrar acá las
        novedades de la asociación.
      </p>
    </div>
  );
}
