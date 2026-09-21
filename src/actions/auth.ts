"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  crearSesion,
  cerrarSesion,
  cerrarSesionesDeUsuario,
  hashearPassword,
  obtenerUsuarioActual,
  requireAdmin,
  verificarPassword,
} from "@/lib/auth";
import { obtenerIp } from "@/lib/ip";
import { conAviso } from "@/lib/aviso";
import {
  construirIdentificador,
  estaBloqueado,
  limpiarIntentosViejos,
  registrarIntento,
} from "@/lib/rate-limit";
import { esquemaCambiarNombre, esquemaCambiarPassword, esquemaLogin } from "@/lib/validations/auth";

export type ResultadoAccion = { error: string } | undefined;

const ERROR_CREDENCIALES = "Usuario o contraseña incorrectos.";
const ERROR_BLOQUEO = "Demasiados intentos. Probá de nuevo en 15 minutos.";

export async function iniciarSesion(
  _estadoPrevio: ResultadoAccion,
  formData: FormData,
): Promise<ResultadoAccion> {
  const yaHaySesion = await obtenerUsuarioActual();
  if (yaHaySesion) redirect("/admin");

  const datos = esquemaLogin.safeParse({
    usuario: formData.get("usuario"),
    password: formData.get("password"),
  });
  if (!datos.success) return { error: ERROR_CREDENCIALES };

  const ip = await obtenerIp();
  const identificador = construirIdentificador(datos.data.usuario, ip);

  await limpiarIntentosViejos();

  if (await estaBloqueado(identificador)) {
    return { error: ERROR_BLOQUEO };
  }

  const usuario = await db.usuario.findUnique({
    where: { usuario: datos.data.usuario.toLowerCase() },
  });

  const passwordValida =
    usuario && usuario.activo
      ? await verificarPassword(datos.data.password, usuario.passwordHash)
      : false;

  if (!usuario || !usuario.activo || !passwordValida) {
    await registrarIntento(identificador, false);
    return { error: ERROR_CREDENCIALES };
  }

  await registrarIntento(identificador, true);
  await db.usuario.update({
    where: { id: usuario.id },
    data: { ultimoAcceso: new Date() },
  });
  await crearSesion(usuario.id);

  if (usuario.debeCambiarPassword) {
    redirect("/admin/mi-cuenta?primer-ingreso=1");
  }
  redirect("/admin");
}

export async function cerrarSesionAction(): Promise<void> {
  await cerrarSesion();
  redirect("/ingresar");
}

export async function cambiarPasswordPropia(
  _estadoPrevio: ResultadoAccion,
  formData: FormData,
): Promise<ResultadoAccion> {
  const usuarioSesion = await requireAdmin();

  const datos = esquemaCambiarPassword.safeParse({
    passwordActual: formData.get("passwordActual"),
    passwordNueva: formData.get("passwordNueva"),
    confirmarPassword: formData.get("confirmarPassword"),
  });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá los datos ingresados." };
  }

  const usuario = await db.usuario.findUniqueOrThrow({
    where: { id: usuarioSesion.id },
  });

  const passwordActualValida = await verificarPassword(
    datos.data.passwordActual,
    usuario.passwordHash,
  );
  if (!passwordActualValida) {
    return { error: "La contraseña actual no es correcta." };
  }

  const passwordHash = await hashearPassword(datos.data.passwordNueva);
  await db.usuario.update({
    where: { id: usuario.id },
    data: { passwordHash, debeCambiarPassword: false },
  });
  await cerrarSesionesDeUsuario(usuario.id, { exceptoTokenActual: true });

  redirect("/admin");
}

export async function cambiarNombrePropio(
  _estadoPrevio: ResultadoAccion,
  formData: FormData,
): Promise<ResultadoAccion> {
  const usuarioSesion = await requireAdmin();

  const datos = esquemaCambiarNombre.safeParse({ nombre: formData.get("nombre") });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá el nombre ingresado." };
  }

  await db.usuario.update({
    where: { id: usuarioSesion.id },
    data: { nombre: datos.data.nombre },
  });

  redirect(conAviso("/admin/mi-cuenta", "Nombre actualizado."));
}
