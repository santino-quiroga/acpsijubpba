import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { DetalleNoticia } from "@/components/publico/DetalleNoticia";

export default async function PaginaVistaPreviaNoticia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const noticia = await db.noticia.findUnique({
    where: { id },
    include: { comision: true },
  });

  if (!noticia) notFound();

  return (
    <div>
      <div className="mx-auto flex max-w-prosa flex-wrap items-center justify-between gap-3 px-4 pt-4 md:px-6">
        <p className="rounded-boton bg-verde-100 px-4 py-2 font-bold text-verde-900">
          Vista previa — no publicada
        </p>
        <Link
          href={`/admin/actividades/${noticia.id}`}
          className="font-bold text-verde-900 underline"
        >
          Volver a editar
        </Link>
      </div>
      <DetalleNoticia noticia={noticia} />
    </div>
  );
}
