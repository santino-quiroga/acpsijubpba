import { z } from "zod";

const urlOpcional = z
  .string()
  .trim()
  .max(0)
  .or(z.string().trim().url("Ingresá una URL válida (https://...)."))
  .optional()
  .transform((valor) => (valor ? valor : null));

const textoOpcional = z
  .string()
  .trim()
  .optional()
  .transform((valor) => (valor ? valor : null));

export const esquemaDatosContacto = z.object({
  email: z.string().trim().email("Ingresá un email válido."),
  whatsapp: textoOpcional,
  telefono: textoOpcional,
  direccion: textoOpcional,
  horarios: textoOpcional,
  filialNombre: textoOpcional,
  filialDireccion: textoOpcional,
  filialEmail: z
    .string()
    .trim()
    .max(0)
    .or(z.string().trim().email("El email de la filial no es válido."))
    .optional()
    .transform((valor) => (valor ? valor : null)),
  filialTelefono: textoOpcional,
  facebookUrl: urlOpcional,
  instagramUrl: urlOpcional,
});
