import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const BASE =
  "inline-flex min-h-boton items-center justify-center gap-2 rounded-boton px-6 text-cuerpo font-bold transition-colors";

const VARIANTES = {
  primario: `${BASE} bg-verde-900 text-crema hover:bg-verde-700`,
  secundario: `${BASE} border-2 border-verde-900 text-verde-900 hover:bg-verde-100`,
} as const;

type Variante = keyof typeof VARIANTES;

type PropsLink = { href: string; variante?: Variante; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "className"
>;

export function BotonLink({
  href,
  variante = "primario",
  className,
  children,
  ...resto
}: PropsLink & { className?: string }) {
  return (
    <Link href={href} className={`${VARIANTES[variante]} ${className ?? ""}`} {...resto}>
      {children}
    </Link>
  );
}

type PropsBoton = { variante?: Variante } & ComponentPropsWithoutRef<"button">;

export function Boton({ variante = "primario", className, children, ...resto }: PropsBoton) {
  return (
    <button className={`${VARIANTES[variante]} ${className ?? ""}`} {...resto}>
      {children}
    </button>
  );
}
