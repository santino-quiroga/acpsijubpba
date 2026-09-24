"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { crearFechaDesdeInputArgentina } from "@/lib/formato";
import { generarSlugUnico } from "@/lib/slug";
import { sanitizarContenidoNoticia } from "@/lib/sanitize";
import { esquemaNoticia } from "@/lib/validations/noticia";

export type ResultadoNoticia = { error: string } | undefined;

async function revalidarPublico(slug?: string) {
  revalidatePath("/");
  revalidatePath("/actividades");
  revalidatePath("/actividades/proximas");
  revalidatePath("/actividades/realizadas");
  if (slug) revalidatePath(`/actividades/${slug}`);
}

type AccionGuardado = "borrador" | "publicar";

async function guardar(
  formData: FormData,
  accion: AccionGuardado,
): Promise<ResultadoNoticia> {
  const usuario = await requireAdmin();

  const id = formData.get("id")?.toString() || undefined;

  const datos = esquemaNoticia.safeParse({
    titulo: formData.get("titulo"),
    resumen: formData.get("resumen"),
    contenidoHtml: formData.get("contenidoHtml"),
    comisionId: formData.get("comisionId") || null,
    fechaPublicacion: formData.get("fechaPublicacion"),
    imagenUrl: formData.get("imagenUrl") || null,
    imagenAlt: formData.get("imagenAlt") || null,
  });

  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }

  const fechaPublicacion = crearFechaDesdeInputArgentina(datos.data.fechaPublicacion);
  if (Number.isNaN(fechaPublicacion.getTime())) {
    return { error: "La fecha de publicación no es válida." };
  }

  let existente = null;
  if (id) {
    existente = await db.noticia.findUnique({ where: { id } });
    if (!existente) return { error: "No se encontró la actividad." };
  }

  // El slug no cambia al editar una actividad ya publicada (sección 6).
  const slug = existente ? existente.slug : await generarSlugUnico(datos.data.titulo);

  const datosGuardar = {
    titulo: datos.data.titulo,
    resumen: datos.data.resumen,
    contenidoHtml: sanitizarContenidoNoticia(datos.data.contenidoHtml),
    comisionId: datos.data.comisionId || null,
    fechaPublicacion,
    imagenUrl: datos.data.imagenUrl || null,
    imagenAlt: datos.data.imagenAlt || null,
    estado: accion === "publicar" ? ("PUBLICADA" as const) : ("BORRADOR" as const),
  };

  if (existente?.imagenUrl && existente.imagenUrl !== datosGuardar.imagenUrl) {
    await del(existente.imagenUrl).catch(() => {});
  }

  if (existente) {
    await db.noticia.update({ where: { id: existente.id }, data: datosGuardar });
  } else {
    await db.noticia.create({
      data: { ...datosGuardar, slug, autorId: usuario.id },
    });
  }

  await revalidarPublico(slug);
  redirect("/admin/actividades");
}

/**
 * Un solo formulario (sección 8.3) con dos botones de envío: "Guardar
 * borrador" y "Publicar" / "Guardar cambios". Cada botón manda su propio
 * `intencion` en el FormData; esta acción despacha según cuál se usó.
 */
export async function guardarNoticiaAction(
  _previo: ResultadoNoticia,
  formData: FormData,
): Promise<ResultadoNoticia> {
  const intencion = formData.get("intencion")?.toString();
  return guardar(formData, intencion === "publicar" ? "publicar" : "borrador");
}

export async function despublicarNoticia(id: string): Promise<void> {
  await requireAdmin();
  const noticia = await db.noticia.update({
    where: { id },
    data: { estado: "BORRADOR" },
  });
  await revalidarPublico(noticia.slug);
}

export async function eliminarNoticia(id: string): Promise<void> {
  await requireAdmin();
  const noticia = await db.noticia.findUnique({ where: { id } });
  if (!noticia) return;

  if (noticia.imagenUrl) await del(noticia.imagenUrl).catch(() => {});
  await db.noticia.delete({ where: { id } });
  await revalidarPublico(noticia.slug);
  redirect("/admin/actividades");
}
