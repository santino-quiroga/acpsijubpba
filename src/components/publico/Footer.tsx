import Image from "next/image";
import Link from "next/link";
import { obtenerDatosContacto } from "@/lib/contenido";
import { NAV_PUBLICO } from "@/lib/navegacion";

export async function Footer() {
  const datosContacto = await obtenerDatosContacto();
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-tierra-900 text-crema">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div className="flex max-w-sm flex-col gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="font-display text-lg font-bold">
              ACPSIJUPBA
            </span>
          </div>
          <p className="text-chico text-tierra-100">
            Asociación Civil Psicólogos Jubilados y Pensionados de la
            Provincia de Buenos Aires
          </p>
          {datosContacto?.email && (
            <a
              href={`mailto:${datosContacto.email}`}
              className="text-chico font-bold underline"
            >
              {datosContacto.email}
            </a>
          )}
        </div>

        <nav aria-label="Enlaces rápidos" className="flex flex-col gap-2">
          <span className="font-display font-bold">Enlaces rápidos</span>
          {NAV_PUBLICO.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-chico underline-offset-2 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <span className="font-display font-bold">Administración</span>
          <Link
            href="/ingresar"
            className="text-chico underline-offset-2 hover:underline"
          >
            Acceso administración
          </Link>
        </div>
      </div>

      <div className="border-t border-tierra-100/30 px-4 py-4 text-center text-chico md:px-6">
        © {anioActual} ACPSIJUPBA
      </div>
    </footer>
  );
}
