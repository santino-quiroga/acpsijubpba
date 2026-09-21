import { headers } from "next/headers";

/** IP del cliente para el identificador de rate-limit (sección 9.3). */
export async function obtenerIp(): Promise<string> {
  const headerStore = await headers();
  const reenviada = headerStore.get("x-forwarded-for");
  if (reenviada) return reenviada.split(",")[0].trim();
  return headerStore.get("x-real-ip") ?? "desconocida";
}
