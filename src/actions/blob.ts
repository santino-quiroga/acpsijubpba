"use server";

import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";

// Sección 9.5 del SDD: MIME validado en el servidor, máximo 4MB, nombre de
// archivo aleatorio.
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
const TAMANO_MAXIMO_BYTES = 4 * 1024 * 1024;

export async function subirImagen(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireAdmin();

  const archivo = formData.get("archivo");
  if (!(archivo instanceof File)) {
    return { error: "No se recibió ninguna imagen." };
  }
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return { error: "La imagen tiene que ser JPG, PNG o WEBP." };
  }
  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    return { error: "La imagen no puede pesar más de 4MB." };
  }

  const extension = archivo.type.split("/")[1];
  const nombreAleatorio = `noticias/${randomUUID()}.${extension}`;

  const resultado = await put(nombreAleatorio, archivo, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: resultado.url };
}

export async function borrarImagen(url: string): Promise<void> {
  await requireAdmin();
  await del(url).catch(() => {});
}
