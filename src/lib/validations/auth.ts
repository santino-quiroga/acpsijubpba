import { z } from "zod";

// Política de contraseñas (sección 9.3): mínimo 10 caracteres, sin exigir
// símbolos, para facilitar el uso por el público objetivo.
export const PASSWORD_MIN = 10;

export const esquemaCambiarNombre = z.object({
  nombre: z.string().trim().min(1, "Ingresá tu nombre."),
});

export const esquemaLogin = z.object({
  usuario: z.string().trim().min(1, "Ingresá tu usuario."),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

export const esquemaCambiarPassword = z
  .object({
    passwordActual: z.string().min(1, "Ingresá tu contraseña actual."),
    passwordNueva: z
      .string()
      .min(PASSWORD_MIN, `La contraseña nueva debe tener al menos ${PASSWORD_MIN} caracteres.`),
    confirmarPassword: z.string().min(1, "Repetí la contraseña nueva."),
  })
  .refine((datos) => datos.passwordNueva === datos.confirmarPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarPassword"],
  });
