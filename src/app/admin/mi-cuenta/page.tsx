import { FormularioCambiarPassword } from "@/components/admin/FormularioCambiarPassword";

// Cambiar nombre (sección 8.9) se agrega en la Fase 5. Por ahora solo el
// cambio de contraseña, necesario para el flujo de primer ingreso (9.1).
export default async function PaginaMiCuenta({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
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
          Cambiar contraseña
        </h2>
        <div className="mt-4">
          <FormularioCambiarPassword />
        </div>
      </div>
    </div>
  );
}
