import { cache } from "react";
import { db } from "@/lib/db";

// Lecturas de contenido para el sitio público. `cache()` evita repetir la
// misma consulta cuando, por ejemplo, el layout (Footer) y la página piden
// el mismo dato durante un mismo render en el servidor.

export const obtenerContenidoInicio = cache(async () => {
  return db.contenidoInicio.findUnique({ where: { id: 1 } });
});

export const obtenerDatosContacto = cache(async () => {
  return db.datosContacto.findUnique({ where: { id: 1 } });
});

export const obtenerComisionesActivas = cache(async () => {
  return db.comisionTrabajo.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
  });
});

// Orden de exhibición de los grupos de la Comisión Directiva (sección 7.5).
// No se puede usar `orderBy: { grupo: "asc" }` en Prisma porque ordenaría
// alfabéticamente el nombre del enum, no en el orden que pide el sitio.
export const ORDEN_GRUPOS_COMISION = [
  "MESA_DIRECTIVA",
  "VOCAL_TITULAR",
  "VOCAL_SUPLENTE",
  "REVISORA_TITULAR",
  "REVISORA_SUPLENTE",
] as const;

export const obtenerPeriodoVigente = cache(async () => {
  const periodo = await db.periodoComision.findFirst({
    where: { vigente: true },
    include: { miembros: { orderBy: { orden: "asc" } } },
  });

  if (!periodo) return null;

  const miembrosPorGrupo = Object.fromEntries(
    ORDEN_GRUPOS_COMISION.map((grupo) => [
      grupo,
      periodo.miembros.filter((miembro) => miembro.grupo === grupo),
    ]),
  ) as Record<(typeof ORDEN_GRUPOS_COMISION)[number], typeof periodo.miembros>;

  return { ...periodo, miembrosPorGrupo };
});
