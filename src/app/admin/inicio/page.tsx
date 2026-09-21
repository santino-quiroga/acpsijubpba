import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormularioContenidoInicio } from "@/components/admin/FormularioContenidoInicio";

export default async function PaginaTextosInicio() {
  await requireAdmin();
  const contenido = await db.contenidoInicio.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Textos de Inicio
      </h1>
      <div className="mt-6">
        <FormularioContenidoInicio contenido={contenido} />
      </div>
    </div>
  );
}
