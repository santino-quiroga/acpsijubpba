import type { Metadata } from "next";
import type { MiembroComision } from "@prisma/client";
import { obtenerPeriodoVigente } from "@/lib/contenido";
import { TarjetaMiembro } from "@/components/publico/TarjetaMiembro";

export const metadata: Metadata = {
  title: "Comisión Directiva",
  description: "Autoridades de ACPSIJUPBA para el período vigente.",
};

function GrupoMiembros({
  titulo,
  miembros,
  nivelTitulo = 2,
}: {
  titulo: string;
  miembros: MiembroComision[];
  nivelTitulo?: 2 | 3;
}) {
  if (miembros.length === 0) return null;

  const Titulo = nivelTitulo === 2 ? "h2" : "h3";

  return (
    <section className="mt-10">
      <Titulo
        className={
          nivelTitulo === 2
            ? "font-display text-h2 font-bold text-verde-900"
            : "font-display text-h3 font-bold text-texto"
        }
      >
        {titulo}
      </Titulo>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {miembros.map((miembro) => (
          <TarjetaMiembro key={miembro.id} miembro={miembro} />
        ))}
      </ul>
    </section>
  );
}

export default async function PaginaComisionDirectiva() {
  const periodo = await obtenerPeriodoVigente();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Comisión Directiva
      </h1>
      {periodo && (
        <p className="mt-2 text-cuerpo text-texto-suave">
          Período {periodo.nombre}
        </p>
      )}

      {!periodo && (
        <p className="mt-8 text-cuerpo text-texto-suave">
          Información próximamente disponible.
        </p>
      )}

      {periodo && (
        <>
          <GrupoMiembros
            titulo="Mesa Directiva"
            miembros={periodo.miembrosPorGrupo.MESA_DIRECTIVA}
          />
          <GrupoMiembros
            titulo="Vocales Titulares"
            miembros={periodo.miembrosPorGrupo.VOCAL_TITULAR}
          />
          <GrupoMiembros
            titulo="Vocales Suplentes"
            miembros={periodo.miembrosPorGrupo.VOCAL_SUPLENTE}
          />

          <section className="mt-10">
            <h2 className="font-display text-h2 font-bold text-verde-900">
              Comisión Revisora de Cuentas
            </h2>
            <GrupoMiembros
              titulo="Titulares"
              miembros={periodo.miembrosPorGrupo.REVISORA_TITULAR}
              nivelTitulo={3}
            />
            <GrupoMiembros
              titulo="Suplentes"
              miembros={periodo.miembrosPorGrupo.REVISORA_SUPLENTE}
              nivelTitulo={3}
            />
          </section>
        </>
      )}
    </div>
  );
}
