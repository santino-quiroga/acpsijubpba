import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormularioMiembro } from "@/components/admin/FormularioMiembro";

export default async function PaginaEditarMiembro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const miembro = await db.miembroComision.findUnique({ where: { id } });
  if (!miembro) notFound();

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Editar miembro
      </h1>
      <div className="mt-6">
        <FormularioMiembro periodoId={miembro.periodoId} miembro={miembro} />
      </div>
    </div>
  );
}
