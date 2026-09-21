"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { conAviso } from "@/lib/aviso";
import { esquemaMiembro, esquemaNuevoPeriodo } from "@/lib/validations/comision-directiva";

export type ResultadoComisionDirectiva = { error: string } | undefined;

function revalidarPublico() {
  revalidatePath("/comision-directiva");
}

export async function crearPeriodoAction(
  _previo: ResultadoComisionDirectiva,
  formData: FormData,
): Promise<ResultadoComisionDirectiva> {
  await requireAdmin();

  const datos = esquemaNuevoPeriodo.safeParse({ nombre: formData.get("nombre") });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Ingresá el nombre del período." };
  }

  const copiarMiembros = formData.get("copiarMiembros") === "on";
  const periodoOrigenId = formData.get("periodoOrigenId")?.toString();

  const nuevoPeriodo = await db.periodoComision.create({
    data: { nombre: datos.data.nombre, vigente: false },
  });

  if (copiarMiembros && periodoOrigenId) {
    const miembrosOrigen = await db.miembroComision.findMany({
      where: { periodoId: periodoOrigenId },
    });
    if (miembrosOrigen.length > 0) {
      await db.miembroComision.createMany({
        data: miembrosOrigen.map((miembro) => ({
          periodoId: nuevoPeriodo.id,
          grupo: miembro.grupo,
          cargo: miembro.cargo,
          titulo: miembro.titulo,
          nombre: miembro.nombre,
          apellido: miembro.apellido,
          // La foto no se copia: dos miembros no deberían compartir la misma
          // imagen en Blob, porque al eliminar uno se borraría el archivo
          // del otro (ver docs/DECISIONES.md).
          fotoUrl: null,
          orden: miembro.orden,
        })),
      });
    }
  }

  redirect(
    conAviso(
      `/admin/comision-directiva?periodo=${nuevoPeriodo.id}`,
      "Período creado.",
    ),
  );
}

export async function marcarPeriodoVigente(id: string): Promise<void> {
  await requireAdmin();

  await db.$transaction([
    db.periodoComision.updateMany({ where: { id: { not: id } }, data: { vigente: false } }),
    db.periodoComision.update({ where: { id }, data: { vigente: true } }),
  ]);

  revalidarPublico();
  redirect(conAviso(`/admin/comision-directiva?periodo=${id}`, "Período marcado como vigente."));
}

/** No se puede eliminar el período vigente (sección 6). */
export async function eliminarPeriodo(id: string): Promise<void> {
  await requireAdmin();

  const periodo = await db.periodoComision.findUnique({ where: { id } });
  if (!periodo) redirect("/admin/comision-directiva");

  if (periodo.vigente) {
    redirect(
      conAviso("/admin/comision-directiva", "No se puede eliminar el período vigente.", "error"),
    );
  }

  const miembros = await db.miembroComision.findMany({ where: { periodoId: id } });
  for (const miembro of miembros) {
    if (miembro.fotoUrl) await del(miembro.fotoUrl).catch(() => {});
  }

  await db.periodoComision.delete({ where: { id } });
  revalidarPublico();
  redirect(conAviso("/admin/comision-directiva", "Período eliminado."));
}

export async function guardarMiembroAction(
  _previo: ResultadoComisionDirectiva,
  formData: FormData,
): Promise<ResultadoComisionDirectiva> {
  await requireAdmin();

  const id = formData.get("id")?.toString() || undefined;
  const periodoId = formData.get("periodoId")?.toString();
  if (!periodoId) return { error: "Falta el período." };

  const datos = esquemaMiembro.safeParse({
    grupo: formData.get("grupo"),
    cargo: formData.get("cargo"),
    titulo: formData.get("titulo"),
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    fotoUrl: formData.get("fotoUrl"),
  });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }

  if (id) {
    const existente = await db.miembroComision.findUnique({ where: { id } });
    if (existente?.fotoUrl && existente.fotoUrl !== datos.data.fotoUrl) {
      await del(existente.fotoUrl).catch(() => {});
    }
    await db.miembroComision.update({ where: { id }, data: datos.data });
  } else {
    const ultimo = await db.miembroComision.findFirst({
      where: { periodoId, grupo: datos.data.grupo },
      orderBy: { orden: "desc" },
    });
    await db.miembroComision.create({
      data: { ...datos.data, periodoId, orden: (ultimo?.orden ?? 0) + 1 },
    });
  }

  revalidarPublico();
  redirect(
    conAviso(
      `/admin/comision-directiva?periodo=${periodoId}`,
      id ? "Miembro actualizado." : "Miembro agregado.",
    ),
  );
}

export async function eliminarMiembro(id: string, periodoId: string): Promise<void> {
  await requireAdmin();

  const miembro = await db.miembroComision.findUnique({ where: { id } });
  if (miembro?.fotoUrl) await del(miembro.fotoUrl).catch(() => {});

  await db.miembroComision.delete({ where: { id } });
  revalidarPublico();
  redirect(conAviso(`/admin/comision-directiva?periodo=${periodoId}`, "Miembro eliminado."));
}

export async function moverMiembroOrden(
  id: string,
  periodoId: string,
  direccion: "subir" | "bajar",
): Promise<void> {
  await requireAdmin();

  const miembro = await db.miembroComision.findUnique({ where: { id } });
  if (!miembro) redirect(`/admin/comision-directiva?periodo=${periodoId}`);

  const grupoMiembros = await db.miembroComision.findMany({
    where: { periodoId, grupo: miembro.grupo },
    orderBy: { orden: "asc" },
  });
  const indice = grupoMiembros.findIndex((m) => m.id === id);
  const vecino = direccion === "subir" ? grupoMiembros[indice - 1] : grupoMiembros[indice + 1];

  if (vecino) {
    await db.$transaction([
      db.miembroComision.update({ where: { id: miembro.id }, data: { orden: vecino.orden } }),
      db.miembroComision.update({ where: { id: vecino.id }, data: { orden: miembro.orden } }),
    ]);
    revalidarPublico();
  }

  redirect(`/admin/comision-directiva?periodo=${periodoId}`);
}
