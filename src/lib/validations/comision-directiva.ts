import { z } from "zod";

export const GRUPOS_COMISION = [
  "MESA_DIRECTIVA",
  "VOCAL_TITULAR",
  "VOCAL_SUPLENTE",
  "REVISORA_TITULAR",
  "REVISORA_SUPLENTE",
] as const;

export const ETIQUETAS_GRUPO: Record<(typeof GRUPOS_COMISION)[number], string> = {
  MESA_DIRECTIVA: "Mesa Directiva",
  VOCAL_TITULAR: "Vocales Titulares",
  VOCAL_SUPLENTE: "Vocales Suplentes",
  REVISORA_TITULAR: "Comisión Revisora de Cuentas — Titulares",
  REVISORA_SUPLENTE: "Comisión Revisora de Cuentas — Suplentes",
};

// Sugerencias de cargo para la Mesa Directiva (sección 8.4). El campo sigue
// siendo texto libre.
export const SUGERENCIAS_CARGO = [
  "Presidenta/e",
  "Vicepresidenta/e",
  "Secretaria/o",
  "Prosecretaria/o",
  "Tesorera/o",
  "Protesorera/o",
];

export const TITULOS_PROFESIONALES = ["PSIC", "LIC", "DR", "NINGUNO"] as const;

export const esquemaMiembro = z.object({
  grupo: z.enum(GRUPOS_COMISION),
  cargo: z
    .string()
    .trim()
    .optional()
    .transform((valor) => (valor ? valor : null)),
  titulo: z.enum(TITULOS_PROFESIONALES),
  nombre: z.string().trim().min(1, "Ingresá el nombre."),
  apellido: z.string().trim().min(1, "Ingresá el apellido."),
});

export const esquemaNuevoPeriodo = z.object({
  nombre: z.string().trim().min(1, "Ingresá el nombre del período (ej. \"2027–2029\")."),
});
