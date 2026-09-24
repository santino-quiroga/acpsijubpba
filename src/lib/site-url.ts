const URL_POR_DEFECTO = "http://localhost:3000";

/**
 * URL pública del sitio (`NEXT_PUBLIC_SITE_URL`), validada. Si la variable
 * falta o no es una URL absoluta válida (por ejemplo, vacía o cargada sin
 * el "https://" mientras el dominio real sigue [PENDIENTE], sección 13 del
 * SDD), usa el valor por defecto en vez de romper el build: `new URL()`
 * tira una excepción con cualquier string inválido, y `metadataBase` en
 * `layout.tsx` la evalúa a nivel de módulo, así que un valor mal cargado
 * tumbaba el build entero en Vercel.
 */
export function obtenerUrlSitio(): string {
  const valor = process.env.NEXT_PUBLIC_SITE_URL;
  if (!valor) return URL_POR_DEFECTO;

  try {
    return new URL(valor).toString().replace(/\/$/, "");
  } catch {
    console.warn(
      `NEXT_PUBLIC_SITE_URL="${valor}" no es una URL válida; se usa "${URL_POR_DEFECTO}".`,
    );
    return URL_POR_DEFECTO;
  }
}
