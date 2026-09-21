import { db } from "@/lib/db";

// Sección 9.3 del SDD: 5 intentos fallidos por `usuario|ip` en 15 minutos.
const VENTANA_INTENTOS_MS = 15 * 60 * 1000;
const MAX_INTENTOS_FALLIDOS = 5;
const RETENCION_INTENTOS_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

export function construirIdentificador(usuario: string, ip: string): string {
  return `${usuario.toLowerCase()}|${ip}`;
}

export async function estaBloqueado(identificador: string): Promise<boolean> {
  const desde = new Date(Date.now() - VENTANA_INTENTOS_MS);
  const intentosFallidos = await db.intentoLogin.count({
    where: { identificador, exitoso: false, createdAt: { gte: desde } },
  });
  return intentosFallidos >= MAX_INTENTOS_FALLIDOS;
}

export async function registrarIntento(
  identificador: string,
  exitoso: boolean,
): Promise<void> {
  await db.intentoLogin.create({ data: { identificador, exitoso } });
}

/** Se llama en cada login (sección 9.3): borra intentos de más de 30 días. */
export async function limpiarIntentosViejos(): Promise<void> {
  const limite = new Date(Date.now() - RETENCION_INTENTOS_MS);
  await db.intentoLogin.deleteMany({ where: { createdAt: { lt: limite } } });
}
