import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormularioNoticia } from "@/components/admin/FormularioNoticia";

export default async function PaginaNuevaNoticia() {
  await requireAdmin();
  const comisiones = await db.comisionTrabajo.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Nueva actividad
      </h1>
      <div className="mt-6 max-w-prosa">
        <FormularioNoticia comisiones={comisiones} />
      </div>
    </div>
  );
}
