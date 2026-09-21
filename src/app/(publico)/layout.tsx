import { Header } from "@/components/publico/Header";
import { Footer } from "@/components/publico/Footer";

export default function LayoutPublico({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-boton focus:bg-verde-900 focus:px-4 focus:py-2 focus:text-crema"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
