import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { eliminarPeriodo, marcarPeriodoVigente } from "@/actions/comision-directiva";
import { ETIQUETAS_GRUPO, GRUPOS_COMISION } from "@/lib/validations/comision-directiva";
import { FormularioNuevoPeriodo } from "@/components/admin/FormularioNuevoPeriodo";
import { FilaMiembro } from "@/components/admin/FilaMiembro";
import { ConfirmacionEliminar } from "@/components/ui/ConfirmacionEliminar";

export default async function PaginaComisionDirectivaAdmin({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();
  const parametros = await searchParams;

  const periodos = await db.periodoComision.findMany({ orderBy: { createdAt: "desc" } });

  if (periodos.length === 0) {
    return (
      <div>
        <h1 className="font-display text-h1 font-bold text-verde-900">
          Comisión Directiva
        </h1>
        <p className="mt-4 text-cuerpo text-texto-suave">
          Todavía no hay ningún período creado.
        </p>
        <div className="mt-6">
          <FormularioNuevoPeriodo />
        </div>
      </div>
    );
  }

  const periodoSeleccionadoId =
    typeof parametros.periodo === "string" &&
    periodos.some((p) => p.id === parametros.periodo)
      ? parametros.periodo
      : periodos.find((p) => p.vigente)?.id ?? periodos[0].id;

  const periodo = periodos.find((p) => p.id === periodoSeleccionadoId)!;
  const miembros = await db.miembroComision.findMany({
    where: { periodoId: periodo.id },
    orderBy: { orden: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Comisión Directiva
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Período">
        {periodos.map((p) => (
          <Link
            key={p.id}
            href={`/admin/comision-directiva?periodo=${p.id}`}
            className={`rounded-boton border-2 px-4 py-2 font-bold ${
              p.id === periodo.id
                ? "border-verde-900 bg-verde-900 text-crema"
                : "border-tierra-100 text-texto hover:border-verde-700"
            }`}
          >
            {p.nombre}
            {p.vigente && " (vigente)"}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!periodo.vigente && (
          <form action={marcarPeriodoVigente.bind(null, periodo.id)}>
            <button
              type="submit"
              className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
            >
              Marcar como vigente
            </button>
          </form>
        )}
        {!periodo.vigente && (
          <ConfirmacionEliminar
            etiquetaBoton="Eliminar período"
            mensaje={`Se va a eliminar el período "${periodo.nombre}" y a todos sus miembros. Esta acción no se puede deshacer.`}
            accionConfirmar={eliminarPeriodo.bind(null, periodo.id)}
          />
        )}
      </div>

      <div className="mt-6">
        <FormularioNuevoPeriodo periodoActualId={periodo.id} />
      </div>

      {GRUPOS_COMISION.map((grupo) => {
        const miembrosGrupo = miembros.filter((m) => m.grupo === grupo);
        return (
          <section key={grupo} className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-h2 font-bold text-verde-900">
                {ETIQUETAS_GRUPO[grupo]}
              </h2>
              <Link
                href={`/admin/comision-directiva/miembros/nuevo?periodo=${periodo.id}&grupo=${grupo}`}
                className="font-bold text-verde-900 underline"
              >
                + Agregar miembro a este grupo
              </Link>
            </div>

            {miembrosGrupo.length === 0 ? (
              <p className="mt-3 text-cuerpo text-texto-suave">Sin miembros todavía.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {miembrosGrupo.map((miembro, indice) => (
                  <FilaMiembro
                    key={miembro.id}
                    miembro={miembro}
                    esPrimero={indice === 0}
                    esUltimo={indice === miembrosGrupo.length - 1}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
