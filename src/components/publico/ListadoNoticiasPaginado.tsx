import { db } from "@/lib/db";
import { obtenerNoticiasPaginadas, type TipoListadoNoticias } from "@/lib/noticias";
import { TarjetaNoticia } from "@/components/publico/TarjetaNoticia";
import { FiltroComisiones } from "@/components/publico/FiltroComisiones";
import { Paginacion } from "@/components/publico/Paginacion";

const TITULOS: Record<TipoListadoNoticias, string> = {
  proximas: "Próximas actividades",
  realizadas: "Actividades realizadas",
};

export async function ListadoNoticiasPaginado({
  tipo,
  pagina,
  comisionId,
}: {
  tipo: TipoListadoNoticias;
  pagina: number;
  comisionId?: string;
}) {
  const [{ noticias, totalPaginas }, comisiones] = await Promise.all([
    obtenerNoticiasPaginadas({ tipo, pagina, comisionId }),
    db.comisionTrabajo.findMany({ where: { activa: true }, orderBy: { orden: "asc" } }),
  ]);

  const basePath = `/actividades/${tipo}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        {TITULOS[tipo]}
      </h1>

      <div className="mt-6">
        <FiltroComisiones
          basePath={basePath}
          comisiones={comisiones}
          comisionSeleccionada={comisionId}
        />
      </div>

      {noticias.length === 0 ? (
        <p className="mt-10 text-cuerpo text-texto-suave">
          No hay actividades para mostrar acá todavía.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <TarjetaNoticia key={noticia.id} noticia={noticia} />
          ))}
        </ul>
      )}

      <Paginacion
        basePath={basePath}
        paginaActual={pagina}
        totalPaginas={totalPaginas}
        comisionId={comisionId}
      />
    </div>
  );
}
