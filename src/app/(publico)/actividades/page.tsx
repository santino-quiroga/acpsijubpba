import type { Metadata } from "next";
import { obtenerProximasActividades, obtenerActividadesRealizadas } from "@/lib/noticias";
import { TarjetaNoticia } from "@/components/publico/TarjetaNoticia";
import { BotonLink } from "@/components/ui/Boton";

export const metadata: Metadata = {
  title: "Actividades",
  description: "Próximas actividades y actividades realizadas de ACPSIJUPBA.",
};

export default async function PaginaNoticias() {
  const [proximas, realizadas] = await Promise.all([
    obtenerProximasActividades(),
    obtenerActividadesRealizadas(),
  ]);

  const sinNoticias = proximas.length === 0 && realizadas.length === 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Actividades
      </h1>

      {sinNoticias && (
        <p className="mt-6 text-cuerpo text-texto-suave">
          Todavía no hay actividades publicadas. Volvé a visitarnos pronto.
        </p>
      )}

      {proximas.length > 0 && (
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-h2 font-bold text-verde-900">
              Próximas actividades
            </h2>
            <BotonLink href="/actividades/proximas" variante="secundario">
              Ver todas las próximas actividades
            </BotonLink>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proximas.map((noticia) => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </ul>
        </section>
      )}

      {realizadas.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-h2 font-bold text-verde-900">
              Actividades realizadas
            </h2>
            <BotonLink href="/actividades/realizadas" variante="secundario">
              Ver todas las actividades realizadas
            </BotonLink>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {realizadas.map((noticia) => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
