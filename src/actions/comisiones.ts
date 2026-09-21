"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { conAviso } from "@/lib/aviso";
import { esquemaComisionTrabajo } from "@/lib/validations/comision-trabajo";

export type ResultadoComision = { error: string } | undefined;

function revalidarPublico() {
  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/noticias/proximas");
  revalidatePath("/noticias/realizadas");
}

function leerDatosFormulario(formData: FormData) {
  return esquemaComisionTrabajo.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    icono: formData.get("icono"),
    activa: formData.get("activa") === "on",
  });
}

export async function guardarComisionAction(
  _previo: ResultadoComision,
  formData: FormData,
): Promise<ResultadoComision> {
  await requireAdmin();

  const id = formData.get("id")?.toString() || undefined;
  const datos = leerDatosFormulario(formData);
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }

  if (id) {
    await db.comisionTrabajo.update({ where: { id }, data: datos.data });
  } else {
    const ultima = await db.comisionTrabajo.findFirst({ orderBy: { orden: "desc" } });
    await db.comisionTrabajo.create({
      data: { ...datos.data, orden: (ultima?.orden ?? 0) + 1 },
    });
  }

  revalidarPublico();
  redirect(conAviso("/admin/comisiones", id ? "Comisión actualizada." : "Comisión creada."));
}

export async function eliminarComision(id: string): Promise<void> {
  await requireAdmin();
  await db.comisionTrabajo.delete({ where: { id } });
  revalidarPublico();
  redirect(conAviso("/admin/comisiones", "Comisión eliminada."));
}

export async function moverComisionOrden(
  id: string,
  direccion: "subir" | "bajar",
): Promise<void> {
  await requireAdmin();

  const comisiones = await db.comisionTrabajo.findMany({ orderBy: { orden: "asc" } });
  const indice = comisiones.findIndex((c) => c.id === id);
  const vecino = direccion === "subir" ? comisiones[indice - 1] : comisiones[indice + 1];

  if (indice !== -1 && vecino) {
    const actual = comisiones[indice];
    await db.$transaction([
      db.comisionTrabajo.update({ where: { id: actual.id }, data: { orden: vecino.orden } }),
      db.comisionTrabajo.update({ where: { id: vecino.id }, data: { orden: actual.orden } }),
    ]);
    revalidarPublico();
  }

  redirect("/admin/comisiones");
}
