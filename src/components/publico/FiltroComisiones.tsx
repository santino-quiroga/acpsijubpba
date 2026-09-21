import Link from "next/link";
import type { ComisionTrabajo } from "@prisma/client";

// Chips de filtro por comisión (sección 7.6): ?comision=<id>. Al cambiar el
// filtro se vuelve a la página 1.
export function FiltroComisiones({
  basePath,
  comisiones,
  comisionSeleccionada,
}: {
  basePath: string;
  comisiones: ComisionTrabajo[];
  comisionSeleccionada?: string;
}) {
  if (comisiones.length === 0) return null;

  function claseChip(activo: boolean) {
    return `rounded-boton border-2 px-4 py-2 font-bold ${
      activo
        ? "border-verde-900 bg-verde-900 text-crema"
        : "border-tierra-100 text-texto hover:border-verde-700"
    }`;
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por comisión">
      <Link href={basePath} className={claseChip(!comisionSeleccionada)}>
        Todas
      </Link>
      {comisiones.map((comision) => (
        <Link
          key={comision.id}
          href={`${basePath}?comision=${comision.id}`}
          className={claseChip(comisionSeleccionada === comision.id)}
        >
          {comision.nombre}
        </Link>
      ))}
    </div>
  );
}
