import { Header } from "@/components/publico/Header";
import { Footer } from "@/components/publico/Footer";
import { BotonLink } from "@/components/ui/Boton";

// Se usa para rutas que no coinciden con ningún segmento (ej. /foo). Los
// notFound() dentro de una página pública usan (publico)/not-found.tsx, que
// ya está envuelto por Header/Footer vía el layout del grupo de rutas; este
// no lo está, por eso los agrega directamente.
export default function NoEncontrado() {
  return (
    <>
      <Header />
      <main id="contenido" className="mx-auto max-w-prosa px-4 py-16 text-center md:px-6">
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
      </main>
      <Footer />
    </>
  );
}
