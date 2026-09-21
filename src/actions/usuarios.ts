"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin, hashearPassword, cerrarSesionesDeUsuario } from "@/lib/auth";
import { generarPasswordTemporal } from "@/lib/password-temporal";
import { esquemaNuevoUsuario } from "@/lib/validations/usuario";
import { conAviso } from "@/lib/aviso";

export type ResultadoUsuario =
  | { error: string }
  | { ok: true; usuario: string; passwordTemporal: string }
  | undefined;

/** Alta de administrador (sección 8.8): password temporal, se muestra una sola vez. */
export async function crearUsuarioAction(
  _previo: ResultadoUsuario,
  formData: FormData,
): Promise<ResultadoUsuario> {
  await requireAdmin();

  const datos = esquemaNuevoUsuario.safeParse({
    nombre: formData.get("nombre"),
    usuario: formData.get("usuario"),
  });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá los datos ingresados." };
  }

  const existente = await db.usuario.findUnique({ where: { usuario: datos.data.usuario } });
  if (existente) {
    return { error: `Ya existe un administrador con el usuario "${datos.data.usuario}".` };
  }

  const passwordTemporal = generarPasswordTemporal();
  const passwordHash = await hashearPassword(passwordTemporal);

  await db.usuario.create({
    data: {
      nombre: datos.data.nombre,
      usuario: datos.data.usuario,
      passwordHash,
      debeCambiarPassword: true,
    },
  });

  return { ok: true, usuario: datos.data.usuario, passwordTemporal };
}

/** Restablecer contraseña (sección 8.8): nueva password temporal + cierra sus sesiones. */
export async function restablecerPasswordAction(
  _previo: ResultadoUsuario,
  formData: FormData,
): Promise<ResultadoUsuario> {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  if (!id) return { error: "No se encontró el usuario." };

  const usuario = await db.usuario.findUnique({ where: { id } });
  if (!usuario) return { error: "No se encontró el usuario." };

  const passwordTemporal = generarPasswordTemporal();
  const passwordHash = await hashearPassword(passwordTemporal);

  await db.usuario.update({
    where: { id },
    data: { passwordHash, debeCambiarPassword: true },
  });
  await cerrarSesionesDeUsuario(id);

  return { ok: true, usuario: usuario.usuario, passwordTemporal };
}

/** No se puede desactivar al último administrador activo (sección 6). */
export async function cambiarActivoUsuario(id: string, activar: boolean): Promise<void> {
  await requireAdmin();

  const usuario = await db.usuario.findUnique({ where: { id } });
  if (!usuario) redirect("/admin/usuarios");

  if (!activar && usuario.activo) {
    const activos = await db.usuario.count({ where: { activo: true } });
    if (activos <= 1) {
      redirect(
        conAviso(
          "/admin/usuarios",
          "No se puede desactivar al último administrador activo.",
          "error",
        ),
      );
    }
  }

  await db.usuario.update({ where: { id }, data: { activo: activar } });
  if (!activar) await cerrarSesionesDeUsuario(id);

  redirect(
    conAviso(
      "/admin/usuarios",
      activar ? "Administrador activado." : "Administrador desactivado.",
    ),
  );
}

/**
 * No se puede eliminar al último administrador activo, ni un usuario puede
 * eliminarse a sí mismo (sección 6).
 */
export async function eliminarUsuario(id: string): Promise<void> {
  const sesionActual = await requireAdmin();

  if (id === sesionActual.id) {
    redirect(conAviso("/admin/usuarios", "No podés eliminarte a vos mismo.", "error"));
  }

  const usuario = await db.usuario.findUnique({ where: { id } });
  if (!usuario) redirect("/admin/usuarios");

  if (usuario.activo) {
    const activos = await db.usuario.count({ where: { activo: true } });
    if (activos <= 1) {
      redirect(
        conAviso(
          "/admin/usuarios",
          "No se puede eliminar al último administrador activo.",
          "error",
        ),
      );
    }
  }

  await db.usuario.delete({ where: { id } });
  redirect(conAviso("/admin/usuarios", "Administrador eliminado."));
}
