import type { TituloProfesional } from "@prisma/client";

const PREFIJOS_TITULO: Record<TituloProfesional, string> = {
  PSIC: "Psic.",
  LIC: "Lic.",
  DR: "Dr.",
  NINGUNO: "",
};

export function formatearNombreConTitulo(
  titulo: TituloProfesional,
  nombre: string,
  apellido: string,
): string {
  const prefijo = PREFIJOS_TITULO[titulo];
  return [prefijo, nombre, apellido].filter(Boolean).join(" ");
}

export function obtenerIniciales(nombre: string, apellido: string): string {
  const inicial = (texto: string) => texto.trim().charAt(0).toUpperCase();
  return `${inicial(nombre)}${inicial(apellido)}`;
}

// Sección 12 del SDD.
export function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(fecha);
}

const OFFSET_ARGENTINA_MS = 3 * 60 * 60 * 1000;

/**
 * Medianoche de "hoy" en hora Argentina (UTC-3 fijo, sin horario de verano),
 * como instante UTC. Se usa para separar Próximas actividades / Actividades
 * realizadas en /noticias (una Noticia con `fechaPublicacion` a partir de
 * este instante todavía no pasó).
 */
/**
 * Convierte el valor de un `<input type="date">` (ej. "2026-10-02") en un
 * instante de mediodía de ese mismo día en hora Argentina. `new Date("2026-
 * 10-02")` se interpreta como medianoche UTC, que al mostrarse en hora
 * Argentina (UTC-3) cae en el día anterior — por eso no se usa así.
 */
export function crearFechaDesdeInputArgentina(fechaISO: string): Date {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia, 12 + 3, 0, 0));
}

export function obtenerInicioDeHoyArgentina(): Date {
  const argentina = new Date(Date.now() - OFFSET_ARGENTINA_MS);
  return new Date(
    Date.UTC(
      argentina.getUTCFullYear(),
      argentina.getUTCMonth(),
      argentina.getUTCDate(),
      3,
      0,
      0,
      0,
    ),
  );
}
