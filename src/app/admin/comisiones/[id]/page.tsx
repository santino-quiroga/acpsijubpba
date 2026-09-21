import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormularioComision } from "@/components/admin/FormularioComision";

export default async function PaginaEditarComision({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const comision = await db.comisionTrabajo.findUnique({ where: { id } });
  if (!comision) notFound();

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Editar comisión de trabajo
      </h1>
      <div className="mt-6">
        <FormularioComision comision={comision} />
      </div>
    </div>
  );
}
