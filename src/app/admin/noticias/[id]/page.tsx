import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormularioNoticia } from "@/components/admin/FormularioNoticia";

export default async function PaginaEditarNoticia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [noticia, comisiones] = await Promise.all([
    db.noticia.findUnique({ where: { id } }),
    db.comisionTrabajo.findMany({ where: { activa: true }, orderBy: { orden: "asc" } }),
  ]);

  if (!noticia) notFound();

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Editar noticia
      </h1>
      <div className="mt-6 max-w-prosa">
        <FormularioNoticia noticia={noticia} comisiones={comisiones} />
      </div>
    </div>
  );
}
