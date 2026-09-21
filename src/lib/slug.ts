import { db } from "@/lib/db";

function normalizarBase(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Genera un slug único a partir del título (sección 6, reglas de negocio).
 * Si ya existe, agrega el sufijo -2, -3, etc. `idAIgnorar` se usa al editar
 * una noticia existente para no chocar contra su propio slug.
 */
export async function generarSlugUnico(
  titulo: string,
  idAIgnorar?: string,
): Promise<string> {
  const base = normalizarBase(titulo) || "noticia";
  let slug = base;
  let sufijo = 2;

  while (
    await db.noticia.findFirst({
      where: { slug, ...(idAIgnorar ? { id: { not: idAIgnorar } } : {}) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${sufijo}`;
    sufijo += 1;
  }

  return slug;
}
