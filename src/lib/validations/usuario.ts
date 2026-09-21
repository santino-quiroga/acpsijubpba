import { z } from "zod";

export const esquemaNuevoUsuario = z.object({
  nombre: z.string().trim().min(1, "Ingresá el nombre."),
  usuario: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(30, "El usuario no puede superar los 30 caracteres.")
    .regex(/^[a-z0-9._-]+$/, "Usá solo minúsculas, números, puntos, guiones y guiones bajos."),
});
