import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatearFecha } from "@/lib/formato";
import { BotonLink } from "@/components/ui/Boton";

// Escritorio (sección 8.2): saludo, tres accesos grandes y un resumen.
export default async function EscritorioAdmin() {
  const usuario = await requireAdmin();

  const [publicadas, borradores, ultimaPublicada] = await Promise.all([
    db.noticia.count({ where: { estado: "PUBLICADA" } }),
    db.noticia.count({ where: { estado: "BORRADOR" } }),
    db.noticia.findFirst({
      where: { estado: "PUBLICADA" },
      orderBy: { fechaPublicacion: "desc" },
      select: { fechaPublicacion: true },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Hola, {usuario.nombre}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BotonLink href="/admin/noticias/nueva" className="justify-center py-6 text-center">
          Publicar una noticia
        </BotonLink>
        <BotonLink
          href="/admin/comision-directiva"
          variante="secundario"
          className="justify-center py-6 text-center"
        >
          Editar comisión directiva
        </BotonLink>
        <BotonLink
          href="/admin/contacto"
          variante="secundario"
          className="justify-center py-6 text-center"
        >
          Editar datos de contacto
        </BotonLink>
      </div>

      <section className="mt-10 rounded-tarjeta border border-tierra-100 p-6">
        <h2 className="font-display text-h3 font-bold text-texto">Resumen</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-chico text-texto-suave">Noticias publicadas</dt>
            <dd className="font-display text-h2 font-bold text-verde-900">{publicadas}</dd>
          </div>
          <div>
            <dt className="text-chico text-texto-suave">Borradores</dt>
            <dd className="font-display text-h2 font-bold text-verde-900">{borradores}</dd>
          </div>
          <div>
            <dt className="text-chico text-texto-suave">Última publicación</dt>
            <dd className="font-display text-h3 font-bold text-texto">
              {ultimaPublicada?.fechaPublicacion
                ? formatearFecha(ultimaPublicada.fechaPublicacion)
                : "Ninguna todavía"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
