"use client";

import { useActionState, useState } from "react";
import type { DatosContacto } from "@prisma/client";
import { guardarDatosContactoAction } from "@/actions/datos-contacto";
import { normalizarWhatsapp, urlWhatsapp } from "@/lib/whatsapp";
import { Boton } from "@/components/ui/Boton";

const ESTILO_INPUT =
  "min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700";

export function FormularioDatosContacto({ datos }: { datos: DatosContacto }) {
  const [estado, accion, pendiente] = useActionState(guardarDatosContactoAction, undefined);
  const [whatsapp, setWhatsapp] = useState(datos.whatsappMostrar ?? datos.whatsapp ?? "");
  const linkWhatsapp = whatsapp ? normalizarWhatsapp(whatsapp) : null;

  return (
    <form action={accion} className="flex max-w-prosa flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-h2 font-bold text-verde-900">Sede</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-bold text-texto">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={datos.email}
            className={ESTILO_INPUT}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="whatsapp" className="font-bold text-texto">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="text"
            placeholder="Ej: 221 123-4567"
            value={whatsapp}
            onChange={(evento) => setWhatsapp(evento.target.value)}
            className={ESTILO_INPUT}
          />
          {linkWhatsapp && (
            <a
              href={urlWhatsapp(linkWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit font-bold text-verde-900 underline"
            >
              Probar enlace ({urlWhatsapp(linkWhatsapp)})
            </a>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="telefono" className="font-bold text-texto">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="text"
            defaultValue={datos.telefono ?? ""}
            className={ESTILO_INPUT}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="direccion" className="font-bold text-texto">
            Dirección
          </label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            defaultValue={datos.direccion ?? ""}
            className={ESTILO_INPUT}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="horarios" className="font-bold text-texto">
            Horarios
          </label>
          <input
            id="horarios"
            name="horarios"
            type="text"
            defaultValue={datos.horarios ?? ""}
            className={ESTILO_INPUT}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-tierra-100 pt-8">
        <h2 className="font-display text-h2 font-bold text-verde-900">
          Filial Mar del Plata
        </h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="filialNombre" className="font-bold text-texto">
            Nombre de la filial
          </label>
          <input
            id="filialNombre"
            name="filialNombre"
            type="text"
            defaultValue={datos.filialNombre ?? ""}
            className={ESTILO_INPUT}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filialDireccion" className="font-bold text-texto">
            Dirección
          </label>
          <input
            id="filialDireccion"
            name="filialDireccion"
            type="text"
            defaultValue={datos.filialDireccion ?? ""}
            className={ESTILO_INPUT}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filialEmail" className="font-bold text-texto">
            Email
          </label>
          <input
            id="filialEmail"
            name="filialEmail"
            type="email"
            defaultValue={datos.filialEmail ?? ""}
            className={ESTILO_INPUT}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filialTelefono" className="font-bold text-texto">
            Teléfono
          </label>
          <input
            id="filialTelefono"
            name="filialTelefono"
            type="text"
            defaultValue={datos.filialTelefono ?? ""}
            className={ESTILO_INPUT}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-tierra-100 pt-8">
        <h2 className="font-display text-h2 font-bold text-verde-900">
          Redes sociales
        </h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="facebookUrl" className="font-bold text-texto">
            Facebook (URL completa)
          </label>
          <input
            id="facebookUrl"
            name="facebookUrl"
            type="url"
            placeholder="https://facebook.com/..."
            defaultValue={datos.facebookUrl ?? ""}
            className={ESTILO_INPUT}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="instagramUrl" className="font-bold text-texto">
            Instagram (URL completa)
          </label>
          <input
            id="instagramUrl"
            name="instagramUrl"
            type="url"
            placeholder="https://instagram.com/..."
            defaultValue={datos.instagramUrl ?? ""}
            className={ESTILO_INPUT}
          />
        </div>
      </section>

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={pendiente} className="self-start">
        Guardar datos de contacto
      </Boton>
    </form>
  );
}
