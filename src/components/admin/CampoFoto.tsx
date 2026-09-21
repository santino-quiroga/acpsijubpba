"use client";

import { useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { subirImagen, borrarImagen } from "@/actions/blob";

// Foto opcional de un miembro de la Comisión Directiva (sección 8.4). A
// diferencia de la imagen de noticias, no exige texto alternativo.
export function CampoFoto({
  nombre,
  urlInicial,
}: {
  nombre: string;
  urlInicial?: string | null;
}) {
  const [url, setUrl] = useState(urlInicial ?? "");
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
        maxWidthOrHeight: 800,
        maxSizeMB: 0.3,
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

  async function alQuitarFoto() {
    if (url) await borrarImagen(url);
    setUrl("");
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold text-texto">Foto (opcional)</span>
      <div className="flex items-center gap-4">
        {url && (
          <Image
            src={url}
            alt=""
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={alElegirArchivo}
            disabled={subiendo}
            className="text-cuerpo"
          />
          {url && (
            <button
              type="button"
              onClick={alQuitarFoto}
              className="w-fit text-chico font-bold text-error underline"
            >
              Quitar foto
            </button>
          )}
        </div>
      </div>
      {subiendo && <p className="text-cuerpo text-texto-suave">Subiendo foto…</p>}
      {error && (
        <p role="alert" className="font-bold text-error">
          {error}
        </p>
      )}
      <input type="hidden" name={nombre} value={url} />
    </div>
  );
}
