import { z } from "zod";

// Reglas de la sección 8.3 del SDD.
export const esquemaNoticia = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(5, "El título debe tener al menos 5 caracteres.")
      .max(150, "El título no puede superar los 150 caracteres."),
    resumen: z
      .string()
      .trim()
      .min(20, "El resumen debe tener al menos 20 caracteres.")
      .max(250, "El resumen no puede superar los 250 caracteres."),
    contenidoHtml: z
      .string()
      .trim()
      .min(1, "El contenido es obligatorio."),
    comisionId: z.string().trim().min(1).nullable().optional(),
    fechaPublicacion: z
      .string()
      .trim()
      .min(1, "La fecha de publicación es obligatoria."),
    imagenUrl: z.string().trim().url().nullable().optional(),
    imagenAlt: z
      .string()
      .trim()
      .max(200, "La descripción de la imagen no puede superar los 200 caracteres.")
      .nullable()
      .optional(),
  })
  .refine((datos) => !datos.imagenUrl || (datos.imagenAlt && datos.imagenAlt.length > 0), {
    message: "Describí brevemente qué se ve en la foto.",
    path: ["imagenAlt"],
  });

export type DatosNoticia = z.infer<typeof esquemaNoticia>;
