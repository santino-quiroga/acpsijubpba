import { db } from "@/lib/db";
import { obtenerInicioDeHoyArgentina } from "@/lib/formato";
import type { Prisma } from "@prisma/client";

const POR_PAGINA = 9;

const INCLUYE_COMISION = { comision: true } satisfies Prisma.NoticiaInclude;

/** Últimas 3 noticias publicadas, para la sección de Inicio (7.2). */
export async function obtenerUltimasNoticias(limite = 3) {
  return db.noticia.findMany({
    where: { estado: "PUBLICADA" },
    orderBy: { fechaPublicacion: "desc" },
    take: limite,
    include: INCLUYE_COMISION,
  });
}

/**
 * Vista previa de "Próximas actividades" en /noticias: las próximas por
 * fecha, sin paginar (ver "Ver todas" para la lista completa paginada).
 */
export async function obtenerProximasActividades(limite = 4) {
  const inicioHoy = obtenerInicioDeHoyArgentina();
  return db.noticia.findMany({
    where: { estado: "PUBLICADA", fechaPublicacion: { gte: inicioHoy } },
    orderBy: { fechaPublicacion: "asc" },
    take: limite,
    include: INCLUYE_COMISION,
  });
}

/** Vista previa de "Actividades realizadas" en /noticias. */
export async function obtenerActividadesRealizadas(limite = 4) {
  const inicioHoy = obtenerInicioDeHoyArgentina();
  return db.noticia.findMany({
    where: { estado: "PUBLICADA", fechaPublicacion: { lt: inicioHoy } },
    orderBy: { fechaPublicacion: "desc" },
    take: limite,
    include: INCLUYE_COMISION,
  });
}

export type TipoListadoNoticias = "proximas" | "realizadas";

/**
 * Lista paginada y filtrable por comisión, para /noticias/proximas y
 * /noticias/realizadas. `comisionId`: la sección 7.6 del SDD describe el
 * filtro como `?comision=slug`, pero `ComisionTrabajo` (sección 6) no tiene
 * un campo `slug` — se usa directamente su `id` como valor del parámetro
 * (ver docs/DECISIONES.md).
 */
export async function obtenerNoticiasPaginadas(opciones: {
  tipo: TipoListadoNoticias;
  pagina: number;
  comisionId?: string;
}) {
  const inicioHoy = obtenerInicioDeHoyArgentina();
  const filtroFecha =
    opciones.tipo === "proximas" ? { gte: inicioHoy } : { lt: inicioHoy };

  const where: Prisma.NoticiaWhereInput = {
    estado: "PUBLICADA",
    fechaPublicacion: filtroFecha,
    ...(opciones.comisionId ? { comisionId: opciones.comisionId } : {}),
  };

  const [noticias, total] = await Promise.all([
    db.noticia.findMany({
      where,
      orderBy: { fechaPublicacion: opciones.tipo === "proximas" ? "asc" : "desc" },
      skip: (opciones.pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: INCLUYE_COMISION,
    }),
    db.noticia.count({ where }),
  ]);

  return { noticias, total, totalPaginas: Math.max(1, Math.ceil(total / POR_PAGINA)) };
}

export async function obtenerNoticiaPorSlug(slug: string) {
  return db.noticia.findUnique({ where: { slug }, include: INCLUYE_COMISION });
}

/** Para sitemap.ts (sección 7.9): slug y fecha de modificación de cada noticia publicada. */
export async function obtenerSlugsNoticiasPublicadas() {
  return db.noticia.findMany({
    where: { estado: "PUBLICADA" },
    select: { slug: true, updatedAt: true },
  });
}
