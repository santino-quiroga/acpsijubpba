import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { BotonLink } from "@/components/ui/Boton";
import { FilaComision } from "@/components/admin/FilaComision";

export default async function PaginaComisionesAdmin() {
  await requireAdmin();
  const comisiones = await db.comisionTrabajo.findMany({
    orderBy: { orden: "asc" },
    include: { _count: { select: { noticias: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-h1 font-bold text-verde-900">
          Comisiones de trabajo
        </h1>
        <BotonLink href="/admin/comisiones/nueva">+ Nueva comisión</BotonLink>
      </div>

      {comisiones.length === 0 ? (
        <p className="mt-8 text-cuerpo text-texto-suave">
          Todavía no hay comisiones de trabajo.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {comisiones.map((comision, indice) => (
            <FilaComision
              key={comision.id}
              comision={comision}
              cantidadNoticias={comision._count.noticias}
              esPrimera={indice === 0}
              esUltima={indice === comisiones.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
