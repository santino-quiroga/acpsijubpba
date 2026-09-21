import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormularioDatosContacto } from "@/components/admin/FormularioDatosContacto";

export default async function PaginaDatosContactoAdmin() {
  await requireAdmin();
  const datos = await db.datosContacto.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Datos de contacto
      </h1>
      <div className="mt-6">
        <FormularioDatosContacto datos={datos} />
      </div>
    </div>
  );
}
