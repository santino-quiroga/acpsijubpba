import { requireAdmin } from "@/lib/auth";
import { FormularioCambiarPassword } from "@/components/admin/FormularioCambiarPassword";
import { FormularioCambiarNombre } from "@/components/admin/FormularioCambiarNombre";

export default async function PaginaMiCuenta({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  const usuario = await requireAdmin();
  const parametros = await searchParams;
  const esPrimerIngreso = parametros["primer-ingreso"] === "1";

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Mi cuenta
      </h1>

      {esPrimerIngreso && (
        <p className="mt-4 rounded-tarjeta bg-verde-100 p-4 font-bold text-verde-900">
          Por seguridad, tenés que elegir una contraseña nueva antes de
          seguir usando el panel.
        </p>
      )}

      <div className="mt-6">
        <h2 className="font-display text-h3 font-bold text-texto">
          Cambiar nombre
        </h2>
        <div className="mt-4">
          <FormularioCambiarNombre nombreActual={usuario.nombre} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-h3 font-bold text-texto">
          Cambiar contraseña
        </h2>
        <div className="mt-4">
          <FormularioCambiarPassword />
        </div>
      </div>
    </div>
  );
}
