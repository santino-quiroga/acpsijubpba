import type { Metadata } from "next";
import { Mail, MapPin, Clock, Phone, ExternalLink, Share2 } from "lucide-react";
import { obtenerDatosContacto } from "@/lib/contenido";
import { BotonLink } from "@/components/ui/Boton";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cómo comunicarte con ACPSIJUPBA.",
};

function TarjetaContacto({
  icono,
  titulo,
  children,
}: {
  icono: React.ReactNode;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-tarjeta border border-tierra-100 bg-crema p-6">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="text-verde-900">
          {icono}
        </span>
        <h2 className="font-display text-h3 font-bold text-texto">
          {titulo}
        </h2>
      </div>
      {children}
    </div>
  );
}

export default async function PaginaContacto() {
  const datos = await obtenerDatosContacto();

  const tieneFilial = Boolean(
    datos?.filialDireccion || datos?.filialEmail || datos?.filialTelefono,
  );
  const tieneRedes = Boolean(datos?.facebookUrl || datos?.instagramUrl);

  return (
    <div className="mx-auto max-w-prosa px-4 py-12 md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Contacto
      </h1>
      <p className="mt-2 text-cuerpo text-texto-suave">
        Escribinos por el medio que te resulte más cómodo.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {datos?.email && (
          <TarjetaContacto icono={<Mail size={28} />} titulo="Email">
            <p className="text-cuerpo">{datos.email}</p>
            <BotonLink href={`mailto:${datos.email}`} className="self-start">
              Enviar un email
            </BotonLink>
          </TarjetaContacto>
        )}

        {datos?.whatsapp && (
          <TarjetaContacto
            icono={<Phone size={28} />}
            titulo="WhatsApp"
          >
            {datos.whatsappMostrar && (
              <p className="text-cuerpo">{datos.whatsappMostrar}</p>
            )}
            <BotonLink
              href={`https://wa.me/${datos.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start"
            >
              Escribir por WhatsApp
            </BotonLink>
          </TarjetaContacto>
        )}

        {datos?.telefono && (
          <TarjetaContacto icono={<Phone size={28} />} titulo="Teléfono">
            <a
              href={`tel:${datos.telefono}`}
              className="text-cuerpo font-bold text-verde-900 underline"
            >
              {datos.telefono}
            </a>
          </TarjetaContacto>
        )}

        {(datos?.direccion || datos?.horarios) && (
          <TarjetaContacto icono={<MapPin size={28} />} titulo="Sede">
            {datos?.direccion && <p className="text-cuerpo">{datos.direccion}</p>}
            {datos?.horarios && (
              <p className="flex items-start gap-2 text-cuerpo text-texto-suave">
                <Clock size={20} aria-hidden="true" className="mt-1 shrink-0" />
                {datos.horarios}
              </p>
            )}
          </TarjetaContacto>
        )}

        {tieneFilial && (
          <TarjetaContacto
            icono={<MapPin size={28} />}
            titulo={datos?.filialNombre ?? "Filial"}
          >
            {datos?.filialDireccion && (
              <p className="text-cuerpo">{datos.filialDireccion}</p>
            )}
            {datos?.filialTelefono && (
              <a
                href={`tel:${datos.filialTelefono}`}
                className="text-cuerpo font-bold text-verde-900 underline"
              >
                {datos.filialTelefono}
              </a>
            )}
            {datos?.filialEmail && (
              <a
                href={`mailto:${datos.filialEmail}`}
                className="text-cuerpo font-bold text-verde-900 underline"
              >
                {datos.filialEmail}
              </a>
            )}
          </TarjetaContacto>
        )}

        {tieneRedes && (
          <TarjetaContacto icono={<Share2 size={28} />} titulo="Redes sociales">
            <div className="flex flex-col gap-2">
              {datos?.facebookUrl && (
                <a
                  href={datos.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cuerpo font-bold text-verde-900 underline"
                >
                  Facebook <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
              {datos?.instagramUrl && (
                <a
                  href={datos.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cuerpo font-bold text-verde-900 underline"
                >
                  Instagram <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </TarjetaContacto>
        )}
      </div>
    </div>
  );
}
