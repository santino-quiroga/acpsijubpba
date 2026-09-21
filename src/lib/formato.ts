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
