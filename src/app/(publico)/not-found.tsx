import { BotonLink } from "@/components/ui/Boton";

export default function NoEncontradoPublico() {
  return (
    <div className="mx-auto max-w-prosa px-4 py-16 text-center md:px-6">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        No encontramos esta página
      </h1>
      <p className="mt-4 text-cuerpo text-texto-suave">
        Puede que el enlace esté vencido o mal escrito. Probá con alguna de estas opciones:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <BotonLink href="/">Ir a Inicio</BotonLink>
        <BotonLink href="/actividades" variante="secundario">
          Ver Actividades
        </BotonLink>
      </div>
    </div>
  );
}
