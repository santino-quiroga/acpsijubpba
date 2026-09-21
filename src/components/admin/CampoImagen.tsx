"use client";

import { useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { subirImagen, borrarImagen } from "@/actions/blob";

// Sección 8.3: compresión en el cliente (máx. 1600px de ancho, ~500KB,
// WebP) antes de subir; la descripción (alt) es obligatoria si hay imagen.
export function CampoImagen({
  imagenUrlInicial,
  imagenAltInicial,
}: {
  imagenUrlInicial?: string | null;
  imagenAltInicial?: string | null;
}) {
  const [url, setUrl] = useState(imagenUrlInicial ?? "");
  const [alt, setAlt] = useState(imagenAltInicial ?? "");
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  async function alElegirArchivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!archivo) return;

    setError(null);
    setSubiendo(true);
    try {
      const comprimido = await imageCompression(archivo, {
        maxWidthOrHeight: 1600,
        maxSizeMB: 0.5,
        fileType: "image/webp",
        useWebWorker: true,
      });

      const datosFormulario = new FormData();
      datosFormulario.set("archivo", comprimido, archivo.name);
      const resultado = await subirImagen(datosFormulario);

      if ("error" in resultado) {
        setError(resultado.error);
        return;
      }
      if (url) await borrarImagen(url);
      setUrl(resultado.url);
    } catch {
      setError("No se pudo procesar la imagen. Probá con otro archivo.");
    } finally {
      setSubiendo(false);
    }
  }

  async function alQuitarImagen() {
    if (url) await borrarImagen(url);
    setUrl("");
    setAlt("");
  }

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="archivo-imagen" className="font-bold text-texto">
        Imagen de portada (opcional)
      </label>
      <input
        id="archivo-imagen"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={alElegirArchivo}
        disabled={subiendo}
        className="text-cuerpo"
      />

      {subiendo && <p className="text-cuerpo text-texto-suave">Subiendo imagen…</p>}
      {error && (
        <p role="alert" className="font-bold text-error">
          {error}
        </p>
      )}

      {url && (
        <div className="flex flex-col items-start gap-3 rounded-tarjeta border border-tierra-100 p-4">
          <Image
            src={url}
            alt=""
            width={320}
            height={200}
            className="h-40 w-auto rounded-tarjeta object-cover"
          />
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="imagenAlt" className="font-bold text-texto">
              Descripción de la imagen
            </label>
            <p className="text-chico text-texto-suave">
              Describí brevemente qué se ve en la foto.
            </p>
            <input
              id="imagenAlt"
              name="imagenAlt"
              type="text"
              value={alt}
              onChange={(evento) => setAlt(evento.target.value)}
              required
              maxLength={200}
              className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
            />
          </div>
          <button
            type="button"
            onClick={alQuitarImagen}
            className="min-h-boton rounded-boton border-2 border-error px-4 font-bold text-error"
          >
            Quitar imagen
          </button>
        </div>
      )}

      <input type="hidden" name="imagenUrl" value={url} />
      {!url && <input type="hidden" name="imagenAlt" value="" />}
    </div>
  );
}
