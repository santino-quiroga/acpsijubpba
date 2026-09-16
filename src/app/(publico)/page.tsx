// Página de Inicio provisoria: el contenido real (hero, bienvenida, comisiones
// de trabajo, últimas noticias, "querés asociarte") se implementa en la Fase 2
// (sección 7.2 del SDD), leyendo ContenidoInicio y ComisionTrabajo desde la base.
export default function PaginaInicio() {
  return (
    <main className="mx-auto flex min-h-screen max-w-prosa flex-col items-start justify-center gap-4 px-6 py-16">
      <h1 className="font-display text-h1 font-bold text-verde-900">
        ACPSIJUPBA
      </h1>
      <p className="text-cuerpo text-texto-suave">
        Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de
        Buenos Aires. Sitio en construcción.
      </p>
    </main>
  );
}
