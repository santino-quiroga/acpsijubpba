"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ContenidoInicio } from "@prisma/client";
import { guardarContenidoInicioAction } from "@/actions/contenido-inicio";
import { EditorContenido } from "@/components/admin/EditorContenido";
import { Boton } from "@/components/ui/Boton";

function VerEnElSitio() {
  return (
    <Link
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-verde-900 underline"
    >
      Ver en el sitio
    </Link>
  );
}

export function FormularioContenidoInicio({ contenido }: { contenido: ContenidoInicio }) {
  const [estado, accion, pendiente] = useActionState(guardarContenidoInicioAction, undefined);

  return (
    <form action={accion} className="flex max-w-prosa flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-h2 font-bold text-verde-900">Encabezado</h2>
          <VerEnElSitio />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="heroTitulo" className="font-bold text-texto">
            Título principal
          </label>
          <input
            id="heroTitulo"
            name="heroTitulo"
            type="text"
            maxLength={120}
            required
            defaultValue={contenido.heroTitulo}
            className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="heroSubtitulo" className="font-bold text-texto">
            Subtítulo
          </label>
          <textarea
            id="heroSubtitulo"
            name="heroSubtitulo"
            maxLength={250}
            required
            rows={2}
            defaultValue={contenido.heroSubtitulo}
            className="rounded-boton border-2 border-tierra-100 px-4 py-2 text-cuerpo focus:border-verde-700"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-tierra-100 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-h2 font-bold text-verde-900">Bienvenida</h2>
          <VerEnElSitio />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bienvenidaTitulo" className="font-bold text-texto">
            Título
          </label>
          <input
            id="bienvenidaTitulo"
            name="bienvenidaTitulo"
            type="text"
            maxLength={120}
            required
            defaultValue={contenido.bienvenidaTitulo}
            className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-texto">Texto</span>
          <EditorContenido
            name="bienvenidaTexto"
            contenidoInicial={contenido.bienvenidaTexto}
            sinSubtitulo
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-tierra-100 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-h2 font-bold text-verde-900">Asociarse</h2>
          <VerEnElSitio />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="asociarseTitulo" className="font-bold text-texto">
            Título
          </label>
          <input
            id="asociarseTitulo"
            name="asociarseTitulo"
            type="text"
            maxLength={120}
            required
            defaultValue={contenido.asociarseTitulo}
            className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-texto">Texto</span>
          <EditorContenido
            name="asociarseTexto"
            contenidoInicial={contenido.asociarseTexto}
            sinSubtitulo
          />
        </div>
      </section>

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={pendiente} className="self-start">
        Guardar textos de Inicio
      </Boton>
    </form>
  );
}
