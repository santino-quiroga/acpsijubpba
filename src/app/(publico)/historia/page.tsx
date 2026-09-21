import type { Metadata } from "next";
import {
  historiaCierre,
  historiaIntro,
  historiaLineaDeTiempo,
  historiaLogros,
} from "@/content/historia";

export const metadata: Metadata = {
  title: "Historia",
  description:
    "Cómo se formó ACPSIJUPBA: del grupo de colegas jubilados en 2013 a la Asociación Civil con Personería Jurídica.",
};

export default function PaginaHistoria() {
  return (
    <div className="mx-auto max-w-prosa px-4 py-12 md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Historia
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-cuerpo">
        {historiaIntro.map((parrafo) => (
          <p key={parrafo}>{parrafo}</p>
        ))}
      </div>

      <ol className="mt-10 flex flex-col gap-8 border-l-4 border-verde-100 pl-6">
        {historiaLineaDeTiempo.map((hito) => (
          <li key={hito.titulo} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-crema bg-verde-900"
            />
            <p className="font-display text-chico font-bold uppercase tracking-wide text-verde-700">
              {hito.fecha}
            </p>
            <h2 className="font-display text-h3 font-bold text-texto">
              {hito.titulo}
            </h2>
            <p className="mt-1 text-cuerpo text-texto-suave">
              {hito.descripcion}
            </p>
          </li>
        ))}
      </ol>

      <section className="mt-10">
        <h2 className="font-display text-h2 font-bold text-verde-900">
          Algunos de nuestros logros
        </h2>
        <ul className="mt-4 flex flex-col gap-3 text-cuerpo">
          {historiaLogros.map((logro) => (
            <li key={logro} className="flex gap-3">
              <span aria-hidden="true" className="text-verde-900">
                •
              </span>
              <span>{logro}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-cuerpo font-bold text-verde-900">
        {historiaCierre}
      </p>
    </div>
  );
}
