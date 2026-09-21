import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatearFecha } from "@/lib/formato";
import { BotonLink } from "@/components/ui/Boton";
import { FilaNoticiaAdmin } from "@/components/admin/FilaNoticiaAdmin";

export default async function PaginaNoticiasAdmin({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();
  const parametros = await searchParams;
  const busqueda = typeof parametros.busqueda === "string" ? parametros.busqueda : "";
  const filtroEstado = parametros.estado === "PUBLICADA" || parametros.estado === "BORRADOR"
    ? parametros.estado
    : undefined;

  const where: Prisma.NoticiaWhereInput = {
    ...(busqueda ? { titulo: { contains: busqueda, mode: "insensitive" } } : {}),
    ...(filtroEstado ? { estado: filtroEstado } : {}),
  };

  const noticias = await db.noticia.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-h1 font-bold text-verde-900">
          Noticias
        </h1>
        <BotonLink href="/admin/noticias/nueva">+ Nueva noticia</BotonLink>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          type="search"
          name="busqueda"
          placeholder="Buscar por título"
          defaultValue={busqueda}
          className="min-h-boton flex-1 rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
        <select
          name="estado"
          defaultValue={filtroEstado ?? ""}
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        >
          <option value="">Todos los estados</option>
          <option value="PUBLICADA">Publicada</option>
          <option value="BORRADOR">Borrador</option>
        </select>
        <button
          type="submit"
          className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
        >
          Buscar
        </button>
      </form>

      {noticias.length === 0 ? (
        <p className="mt-8 text-cuerpo text-texto-suave">
          No hay noticias que coincidan con la búsqueda.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {noticias.map((noticia) => (
            <FilaNoticiaAdmin
              key={noticia.id}
              id={noticia.id}
              titulo={noticia.titulo}
              estado={noticia.estado}
              fecha={
                noticia.fechaPublicacion ? formatearFecha(noticia.fechaPublicacion) : "—"
              }
              slug={noticia.slug}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
