import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Se lee una sola vez a nivel de módulo (recomendado por los docs de
// next/og para valores predecibles) y se reutiliza en icon.tsx,
// apple-icon.tsx y opengraph-image.tsx.
const logoBase64 = readFile(join(process.cwd(), "public/logo.png"), "base64");

export async function obtenerLogoDataUrl() {
  return `data:image/png;base64,${await logoBase64}`;
}
