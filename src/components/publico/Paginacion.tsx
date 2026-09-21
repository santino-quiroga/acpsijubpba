import Link from "next/link";

function construirHref(basePath: string, parametros: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor) query.set(clave, valor);
  }
  const queryString = query.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

// Paginación grande de la sección 7.6: "Anteriores" / "Más recientes" y el
// número de página. Sin JS: son enlaces normales.
export function Paginacion({
  basePath,
  paginaActual,
  totalPaginas,
  comisionId,
}: {
  basePath: string;
  paginaActual: number;
  totalPaginas: number;
  comisionId?: string;
}) {
  if (totalPaginas <= 1) return null;

  const hrefAnterior =
    paginaActual > 1
      ? construirHref(basePath, { pagina: String(paginaActual - 1), comision: comisionId })
      : undefined;
  const hrefSiguiente =
    paginaActual < totalPaginas
      ? construirHref(basePath, { pagina: String(paginaActual + 1), comision: comisionId })
      : undefined;

  return (
    <nav aria-label="Paginación" className="mt-8 flex items-center justify-between gap-4">
      {hrefAnterior ? (
        <Link
          href={hrefAnterior}
          className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
        >
          ← Anteriores
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      <p className="text-cuerpo text-texto-suave">
        Página {paginaActual} de {totalPaginas}
      </p>

      {hrefSiguiente ? (
        <Link
          href={hrefSiguiente}
          className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
        >
          Más recientes →
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
