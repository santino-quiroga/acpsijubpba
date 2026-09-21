import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Usuario } from "@prisma/client";

// Sección 9.2 del SDD.
const NOMBRE_COOKIE = "acp_sesion";
const DURACION_SESION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días
const UMBRAL_RENOVACION_MS = 3 * 24 * 60 * 60 * 1000; // renovar si quedan < 3 días
const COSTO_BCRYPT = 12;

function hashearToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashearPassword(password: string): Promise<string> {
  return bcrypt.hash(password, COSTO_BCRYPT);
}

export async function verificarPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function establecerCookieSesion(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

async function borrarCookieSesion() {
  const cookieStore = await cookies();
  cookieStore.delete(NOMBRE_COOKIE);
}

/** Crea una sesión nueva para el usuario y deja la cookie lista. */
export async function crearSesion(usuarioId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + DURACION_SESION_MS);

  await db.sesion.create({
    data: {
      id: hashearToken(token),
      usuarioId,
      expiresAt,
    },
  });

  await establecerCookieSesion(token, expiresAt);
}

type UsuarioSesion = Pick<
  Usuario,
  "id" | "nombre" | "usuario" | "activo" | "debeCambiarPassword"
>;

/**
 * Lee la cookie de sesión, valida contra la base y renueva el vencimiento si
 * quedan menos de 3 días (sección 9.2). Devuelve `null` sin sesión válida.
 */
export async function obtenerUsuarioActual(): Promise<UsuarioSesion | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOMBRE_COOKIE)?.value;
  if (!token) return null;

  const sesion = await db.sesion.findUnique({
    where: { id: hashearToken(token) },
    include: { usuario: true },
  });

  if (!sesion || sesion.expiresAt < new Date() || !sesion.usuario.activo) {
    if (sesion) await db.sesion.delete({ where: { id: sesion.id } });
    await borrarCookieSesion();
    return null;
  }

  const tiempoRestante = sesion.expiresAt.getTime() - Date.now();
  if (tiempoRestante < UMBRAL_RENOVACION_MS) {
    const nuevoVencimiento = new Date(Date.now() + DURACION_SESION_MS);
    await db.sesion.update({
      where: { id: sesion.id },
      data: { expiresAt: nuevoVencimiento },
    });
    await establecerCookieSesion(token, nuevoVencimiento);
  }

  return sesion.usuario;
}

/**
 * Exige una sesión válida. Se llama al inicio de cada Server Action del
 * panel y en `admin/layout.tsx` — nunca alcanza con el proxy (sección 5).
 */
export async function requireAdmin(): Promise<UsuarioSesion> {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) redirect("/ingresar");
  return usuario;
}

/** Cierra la sesión actual: borra el registro en la base y la cookie. */
export async function cerrarSesion(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOMBRE_COOKIE)?.value;
  if (token) {
    await db.sesion.deleteMany({ where: { id: hashearToken(token) } });
  }
  await borrarCookieSesion();
}

/**
 * Cierra todas las sesiones de un usuario (cambio/restablecimiento de
 * contraseña, sección 9.2), salvo la sesión actual si se indica.
 */
export async function cerrarSesionesDeUsuario(
  usuarioId: string,
  options?: { exceptoTokenActual?: boolean },
): Promise<void> {
  if (options?.exceptoTokenActual) {
    const cookieStore = await cookies();
    const token = cookieStore.get(NOMBRE_COOKIE)?.value;
    const idSesionActual = token ? hashearToken(token) : undefined;
    await db.sesion.deleteMany({
      where: { usuarioId, id: idSesionActual ? { not: idSesionActual } : undefined },
    });
    return;
  }
  await db.sesion.deleteMany({ where: { usuarioId } });
}

export { generarPasswordTemporal } from "@/lib/password-temporal";
