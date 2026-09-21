import { z } from "zod";

export const esquemaContenidoInicio = z.object({
  heroTitulo: z.string().trim().min(1, "Ingresá el título principal.").max(120, "Máximo 120 caracteres."),
  heroSubtitulo: z.string().trim().min(1, "Ingresá el subtítulo.").max(250, "Máximo 250 caracteres."),
  bienvenidaTitulo: z.string().trim().min(1, "Ingresá el título de bienvenida.").max(120, "Máximo 120 caracteres."),
  bienvenidaTexto: z.string().trim().min(1, "Ingresá el texto de bienvenida."),
  asociarseTitulo: z.string().trim().min(1, "Ingresá el título de \"Asociarse\".").max(120, "Máximo 120 caracteres."),
  asociarseTexto: z.string().trim().min(1, "Ingresá el texto de \"Asociarse\"."),
});
