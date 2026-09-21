import { requireAdmin } from "@/lib/auth";
import { FormularioComision } from "@/components/admin/FormularioComision";

export default async function PaginaNuevaComision() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Nueva comisión de trabajo
      </h1>
      <div className="mt-6">
        <FormularioComision />
      </div>
    </div>
  );
}
