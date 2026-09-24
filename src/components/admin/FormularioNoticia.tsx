"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { ComisionTrabajo, Noticia } from "@prisma/client";
import { guardarNoticiaAction, despublicarNoticia, eliminarNoticia } from "@/actions/noticias";
import { EditorContenido } from "@/components/admin/EditorContenido";
import { CampoImagen } from "@/components/admin/CampoImagen";
import { Boton } from "@/components/ui/Boton";
import { ConfirmacionEliminar } from "@/components/ui/ConfirmacionEliminar";

function fechaParaInput(fecha: Date | null | undefined): string {
  const base = fecha ?? new Date();
  return base.toISOString().slice(0, 10);
}

export function FormularioNoticia({
  noticia,
  comisiones,
}: {
  noticia?: Noticia | null;
  comisiones: ComisionTrabajo[];
}) {
  const [estado, accion, pendiente] = useActionState(guardarNoticiaAction, undefined);
  const [resumen, setResumen] = useState(noticia?.resumen ?? "");
  const [sucio, setSucio] = useState(false);

  useEffect(() => {
    function alIntentarSalir(evento: BeforeUnloadEvent) {
      if (!sucio) return;
      evento.preventDefault();
    }
    window.addEventListener("beforeunload", alIntentarSalir);
    return () => window.removeEventListener("beforeunload", alIntentarSalir);
  }, [sucio]);

  const yaPublicada = noticia?.estado === "PUBLICADA";

  return (
    <div className="flex flex-col gap-6">
      <form action={accion} onChange={() => setSucio(true)} className="flex flex-col gap-6">
        {noticia && <input type="hidden" name="id" value={noticia.id} />}

        <div className="flex flex-col gap-2">
          <label htmlFor="titulo" className="font-bold text-texto">
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            minLength={5}
            maxLength={150}
            defaultValue={noticia?.titulo}
            required
            className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="resumen" className="font-bold text-texto">
            Resumen
          </label>
          <textarea
            id="resumen"
            name="resumen"
            minLength={20}
            maxLength={250}
            required
            rows={3}
            value={resumen}
            onChange={(evento) => setResumen(evento.target.value)}
            className="rounded-boton border-2 border-tierra-100 px-4 py-2 text-cuerpo focus:border-verde-700"
          />
          <p className="text-chico text-texto-suave">{resumen.length}/250 caracteres</p>
        </div>

        <CampoImagen
          imagenUrlInicial={noticia?.imagenUrl}
          imagenAltInicial={noticia?.imagenAlt}
        />

        <div className="flex flex-col gap-2">
          <span className="font-bold text-texto">Contenido</span>
          <EditorContenido name="contenidoHtml" contenidoInicial={noticia?.contenidoHtml} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="comisionId" className="font-bold text-texto">
            Comisión (opcional)
          </label>
          <select
            id="comisionId"
            name="comisionId"
            defaultValue={noticia?.comisionId ?? ""}
            className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
          >
            <option value="">Sin categoría</option>
            {comisiones.map((comision) => (
              <option key={comision.id} value={comision.id}>
                {comision.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="fechaPublicacion" className="font-bold text-texto">
            Fecha de publicación
          </label>
          <input
            id="fechaPublicacion"
            name="fechaPublicacion"
            type="date"
            required
            defaultValue={fechaParaInput(noticia?.fechaPublicacion)}
            className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
          />
          <p className="text-chico text-texto-suave">
            Si la fecha todavía no llegó, la actividad va a aparecer en
            &ldquo;Próximas actividades&rdquo;; si ya pasó, en
            &ldquo;Actividades realizadas&rdquo;.
          </p>
        </div>

        {estado?.error && (
          <p role="alert" className="font-bold text-error">
            {estado.error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Boton
            type="submit"
            name="intencion"
            value="borrador"
            variante="secundario"
            disabled={pendiente}
          >
            Guardar borrador
          </Boton>
          <Boton type="submit" name="intencion" value="publicar" disabled={pendiente}>
            {yaPublicada ? "Guardar cambios" : "Publicar"}
          </Boton>
        </div>
      </form>

      {/* Fuera del <form> de arriba: un <form> no puede anidar otro <form>. */}
      {noticia && (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/actividades/${noticia.id}/vista-previa`}
            className="min-h-boton inline-flex items-center rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
          >
            Vista previa
          </Link>

          {yaPublicada && (
            <form action={despublicarNoticia.bind(null, noticia.id)}>
              <button
                type="submit"
                className="min-h-boton rounded-boton border-2 border-tierra-900 px-4 font-bold text-tierra-900"
              >
                Despublicar
              </button>
            </form>
          )}

          <ConfirmacionEliminar
            mensaje={`Se va a eliminar "${noticia.titulo}" para siempre. Esta acción no se puede deshacer.`}
            accionConfirmar={eliminarNoticia.bind(null, noticia.id)}
          />
        </div>
      )}
    </div>
  );
}
