"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { NAV_PUBLICO } from "@/lib/navegacion";
import { ControlTipografia } from "./ControlTipografia";

function EnlaceNav({
  href,
  label,
  activo,
  onClick,
  className,
}: {
  href: string;
  label: string;
  activo: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={activo ? "page" : undefined}
      className={`border-b-4 px-1 py-2 font-bold ${
        activo
          ? "border-verde-900 text-verde-900"
          : "border-transparent text-texto hover:border-verde-100 hover:text-verde-900"
      } ${className ?? ""}`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pathnameAnterior, setPathnameAnterior] = useState(pathname);

  // Cierra el menú móvil al cambiar de página (ajuste de estado durante el
  // render, según la guía de React para resetear estado cuando cambia una prop).
  if (pathname !== pathnameAnterior) {
    setPathnameAnterior(pathname);
    setMenuAbierto(false);
  }

  // Cierra el menú móvil con la tecla Escape.
  useEffect(() => {
    if (!menuAbierto) return;
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") setMenuAbierto(false);
    }
    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [menuAbierto]);

  return (
    <header className="sticky top-0 z-40 border-b border-tierra-100 bg-crema">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12"
            priority
          />
          <span className="flex flex-col">
            <span className="font-display text-xl font-bold text-verde-900">
              ACPSIJUPBA
            </span>
            <span className="hidden text-chico text-texto-suave md:block">
              Asociación Civil Psicólogos Jubilados y Pensionados de la
              Provincia de Buenos Aires
            </span>
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-4 lg:flex"
        >
          {NAV_PUBLICO.map((item) => (
            <EnlaceNav
              key={item.href}
              href={item.href}
              label={item.label}
              activo={pathname === item.href}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ControlTipografia />
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            className="flex min-h-boton items-center rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900 lg:hidden"
          >
            Menú
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-50 flex flex-col bg-crema lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-tierra-100 px-4 py-3">
            <span className="font-display text-xl font-bold text-verde-900">
              Menú
            </span>
            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              autoFocus
              aria-label="Cerrar menú"
              className="flex h-11 w-11 items-center justify-center rounded-boton border-2 border-verde-900 text-verde-900"
            >
              <X aria-hidden="true" size={24} />
            </button>
          </div>
          <nav
            aria-label="Principal"
            className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-6"
          >
            {NAV_PUBLICO.map((item) => (
              <EnlaceNav
                key={item.href}
                href={item.href}
                label={item.label}
                activo={pathname === item.href}
                onClick={() => setMenuAbierto(false)}
                className="rounded-tarjeta border-b-0 px-4 py-4 text-xl hover:bg-verde-100"
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
