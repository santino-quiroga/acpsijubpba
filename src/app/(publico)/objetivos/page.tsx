import type { Metadata } from "next";
import { objetivoGeneral, objetivosEspecificos } from "@/content/objetivos";

export const metadata: Metadata = {
  title: "Objetivos",
  description:
    "Objetivo general y objetivos específicos de ACPSIJUPBA, la Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires.",
};

export default function PaginaObjetivos() {
  return (
    <div className="mx-auto max-w-prosa px-4 py-12 md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Objetivos
      </h1>

      <section className="mt-6 rounded-tarjeta bg-verde-100 p-6">
        <h2 className="font-display text-h3 font-bold text-verde-900">
          Objetivo general
        </h2>
        <p className="mt-2 text-cuerpo">{objetivoGeneral}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-h2 font-bold text-verde-900">
          Objetivos específicos
        </h2>
        <ol className="mt-4 flex flex-col gap-4 text-cuerpo">
          {objetivosEspecificos.map((objetivo) => (
            <li key={objetivo.letra} className="flex gap-3 rounded-tarjeta border border-tierra-100 p-4">
              <span className="font-display font-bold text-verde-900">
                {objetivo.letra})
              </span>
              <span>{objetivo.texto}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
