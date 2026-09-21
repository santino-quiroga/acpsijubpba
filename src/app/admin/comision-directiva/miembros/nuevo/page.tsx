import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormularioMiembro } from "@/components/admin/FormularioMiembro";

export default async function PaginaNuevoMiembro({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();
  const parametros = await searchParams;
  const periodoId = typeof parametros.periodo === "string" ? parametros.periodo : undefined;
  const grupo = typeof parametros.grupo === "string" ? parametros.grupo : undefined;

  if (!periodoId) notFound();
  const periodo = await db.periodoComision.findUnique({ where: { id: periodoId } });
  if (!periodo) notFound();

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Nuevo miembro — {periodo.nombre}
      </h1>
      <div className="mt-6">
        <FormularioMiembro periodoId={periodoId} grupoInicial={grupo} />
      </div>
    </div>
  );
}
