import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { cerrarSesionAction } from "@/actions/auth";
import { Toaster } from "@/components/admin/Toaster";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

// Menú lateral (sección 8.1), en el mismo orden que la sección 8.
const ITEMS_MENU = [
  { href: "/admin", label: "Escritorio" },
  { href: "/admin/noticias", label: "Noticias" },
  { href: "/admin/comision-directiva", label: "Comisión Directiva" },
  { href: "/admin/comisiones", label: "Comisiones de trabajo" },
  { href: "/admin/inicio", label: "Textos de Inicio" },
  { href: "/admin/contacto", label: "Datos de contacto" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/mi-cuenta", label: "Mi cuenta" },
];

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-tierra-100 bg-crema px-4 py-3 md:px-6">
        <span className="font-display text-lg font-bold text-verde-900">
          Panel de administración
        </span>
        <div className="flex items-center gap-4 text-cuerpo">
          <span className="text-texto-suave">Hola, {usuario.nombre}</span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-verde-900 underline"
          >
            Ver sitio
          </a>
          <form action={cerrarSesionAction}>
            <button
              type="submit"
              className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav
          aria-label="Panel"
          className="flex gap-2 overflow-x-auto border-b border-tierra-100 bg-tierra-100/30 px-4 py-3 md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:px-4 md:py-6"
        >
          {ITEMS_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-boton px-3 py-2 font-bold text-texto hover:bg-verde-100 hover:text-verde-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>

      <Suspense fallback={null}>
        <Toaster />
      </Suspense>
    </div>
  );
}
