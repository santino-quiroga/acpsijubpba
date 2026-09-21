// Sin dependencias de Next.js: lo usan tanto Server Actions/páginas como el
// script de CLI `scripts/crear-admin.ts`, que corre fuera del runtime de Next.
const PALABRAS_PASSWORD = [
  "verde",
  "arbol",
  "rio",
  "sol",
  "luna",
  "flor",
  "mar",
  "cielo",
  "campo",
  "piedra",
  "nube",
  "viento",
] as const;

/** Contraseña temporal legible, ej. "verde-arbol-4821" (sección 8.8). */
export function generarPasswordTemporal(): string {
  const [a, b] = [
    PALABRAS_PASSWORD[Math.floor(Math.random() * PALABRAS_PASSWORD.length)],
    PALABRAS_PASSWORD[Math.floor(Math.random() * PALABRAS_PASSWORD.length)],
  ];
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `${a}-${b}-${numero}`;
}
