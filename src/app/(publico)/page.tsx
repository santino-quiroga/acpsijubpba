import Image from "next/image";
import {
  obtenerComisionesActivas,
  obtenerContenidoInicio,
  obtenerDatosContacto,
} from "@/lib/contenido";
import { obtenerUltimasNoticias } from "@/lib/noticias";
import { obtenerIconoComision } from "@/lib/iconos-comisiones";
import { BotonLink } from "@/components/ui/Boton";
import { TarjetaNoticia } from "@/components/publico/TarjetaNoticia";

// Página de Inicio (sección 7.2 del SDD).
export default async function PaginaInicio() {
  const [contenido, comisiones, datosContacto, ultimasNoticias] = await Promise.all([
    obtenerContenidoInicio(),
    obtenerComisionesActivas(),
    obtenerDatosContacto(),
    obtenerUltimasNoticias(),
  ]);

  return (
    <div className="flex flex-col">
      <section className="border-b border-tierra-100 bg-verde-100">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center md:px-6">
          <Image
            src="/logo.png"
            alt="Logo de ACPSIJUPBA"
            width={120}
            height={120}
            className="h-28 w-28"
            priority
          />
          <h1 className="max-w-prosa font-display text-h1 font-bold text-verde-900">
            {contenido?.heroTitulo}
          </h1>
          <p className="max-w-prosa text-cuerpo text-texto-suave">
            {contenido?.heroSubtitulo}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BotonLink href="/historia">Conocé nuestra historia</BotonLink>
            <BotonLink href="/contacto" variante="secundario">
              Contactanos
            </BotonLink>
          </div>
        </div>
      </section>

      {contenido && (
        <section className="mx-auto w-full max-w-prosa px-4 py-14 md:px-6">
          <h2 className="font-display text-h2 font-bold text-verde-900">
            {contenido.bienvenidaTitulo}
          </h2>
          <div
            className="contenido-html mt-4 text-cuerpo"
            dangerouslySetInnerHTML={{ __html: contenido.bienvenidaTexto }}
          />
        </section>
      )}

      {comisiones.length > 0 && (
        <section className="border-y border-tierra-100 bg-tierra-100/40">
          <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
            <h2 className="text-center font-display text-h2 font-bold text-verde-900">
              Nuestras comisiones de trabajo
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {comisiones.map((comision) => {
                const Icono = obtenerIconoComision(comision.icono);
                return (
                  <li
                    key={comision.id}
                    className="flex flex-col gap-3 rounded-tarjeta bg-crema p-6"
                  >
                    <Icono
                      aria-hidden="true"
                      size={32}
                      className="text-verde-900"
                    />
                    <h3 className="font-display text-h3 font-bold text-texto">
                      {comision.nombre}
                    </h3>
                    <p className="text-cuerpo text-texto-suave">
                      {comision.descripcion}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {ultimasNoticias.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-4 py-14 md:px-6">
          <h2 className="text-center font-display text-h2 font-bold text-verde-900">
            Últimas noticias
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ultimasNoticias.map((noticia) => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </ul>
          <div className="mt-8 flex justify-center">
            <BotonLink href="/noticias" variante="secundario">
              Ver todas las noticias
            </BotonLink>
          </div>
        </section>
      )}

      {contenido && (
        <section className="mx-auto w-full max-w-prosa px-4 py-14 text-center md:px-6">
          <h2 className="font-display text-h2 font-bold text-verde-900">
            {contenido.asociarseTitulo}
          </h2>
          <div
            className="contenido-html mx-auto mt-4 max-w-prosa text-left text-cuerpo"
            dangerouslySetInnerHTML={{ __html: contenido.asociarseTexto }}
          />
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {datosContacto?.email && (
              <BotonLink href={`mailto:${datosContacto.email}`}>
                Escribinos por email
              </BotonLink>
            )}
            {datosContacto?.whatsapp && (
              <BotonLink
                href={`https://wa.me/${datosContacto.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                variante="secundario"
              >
                Escribinos por WhatsApp
              </BotonLink>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
