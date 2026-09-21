"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { conAviso } from "@/lib/aviso";
import { sanitizarContenidoNoticia } from "@/lib/sanitize";
import { esquemaContenidoInicio } from "@/lib/validations/contenido-inicio";

export type ResultadoContenidoInicio = { error: string } | undefined;

export async function guardarContenidoInicioAction(
  _previo: ResultadoContenidoInicio,
  formData: FormData,
): Promise<ResultadoContenidoInicio> {
  await requireAdmin();

  const datos = esquemaContenidoInicio.safeParse({
    heroTitulo: formData.get("heroTitulo"),
    heroSubtitulo: formData.get("heroSubtitulo"),
    bienvenidaTitulo: formData.get("bienvenidaTitulo"),
    bienvenidaTexto: formData.get("bienvenidaTexto"),
    asociarseTitulo: formData.get("asociarseTitulo"),
    asociarseTexto: formData.get("asociarseTexto"),
  });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }

  await db.contenidoInicio.update({
    where: { id: 1 },
    data: {
      ...datos.data,
      bienvenidaTexto: sanitizarContenidoNoticia(datos.data.bienvenidaTexto),
      asociarseTexto: sanitizarContenidoNoticia(datos.data.asociarseTexto),
    },
  });

  revalidatePath("/");
  redirect(conAviso("/admin/inicio", "Textos de Inicio actualizados."));
}
