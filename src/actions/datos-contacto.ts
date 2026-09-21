"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { conAviso } from "@/lib/aviso";
import { normalizarWhatsapp } from "@/lib/whatsapp";
import { esquemaDatosContacto } from "@/lib/validations/datos-contacto";

export type ResultadoDatosContacto = { error: string } | undefined;

export async function guardarDatosContactoAction(
  _previo: ResultadoDatosContacto,
  formData: FormData,
): Promise<ResultadoDatosContacto> {
  await requireAdmin();

  const datos = esquemaDatosContacto.safeParse({
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    telefono: formData.get("telefono"),
    direccion: formData.get("direccion"),
    horarios: formData.get("horarios"),
    filialNombre: formData.get("filialNombre"),
    filialDireccion: formData.get("filialDireccion"),
    filialEmail: formData.get("filialEmail"),
    filialTelefono: formData.get("filialTelefono"),
    facebookUrl: formData.get("facebookUrl"),
    instagramUrl: formData.get("instagramUrl"),
  });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }

  const whatsappNormalizado = datos.data.whatsapp
    ? normalizarWhatsapp(datos.data.whatsapp)
    : null;

  await db.datosContacto.update({
    where: { id: 1 },
    data: {
      ...datos.data,
      whatsapp: whatsappNormalizado,
      whatsappMostrar: datos.data.whatsapp,
    },
  });

  revalidatePath("/contacto");
  revalidatePath("/");
  redirect(conAviso("/admin/contacto", "Datos de contacto actualizados."));
}
