/** Arma la URL de redirect con el aviso que levanta <Toaster /> (sección 8.1). */
export function conAviso(
  path: string,
  texto: string,
  tipo: "exito" | "error" = "exito",
): string {
  const separador = path.includes("?") ? "&" : "?";
  return `${path}${separador}aviso=${encodeURIComponent(texto)}&tipo=${tipo}`;
}
