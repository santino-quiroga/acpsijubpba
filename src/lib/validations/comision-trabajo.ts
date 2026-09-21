import { z } from "zod";
import { ICONOS_COMISION } from "@/lib/iconos-comisiones";

// Lista cerrada de íconos (sección 8.5).
export const NOMBRES_ICONOS_COMISION = Object.keys(ICONOS_COMISION) as [string, ...string[]];

export const esquemaComisionTrabajo = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la comisión.")
    .max(80, "El nombre no puede superar los 80 caracteres."),
  descripcion: z
    .string()
    .trim()
    .min(1, "Ingresá una descripción.")
    .max(400, "La descripción no puede superar los 400 caracteres."),
  icono: z.enum(NOMBRES_ICONOS_COMISION, { message: "Elegí un ícono de la lista." }),
  activa: z.boolean(),
});
