import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { obtenerUsuarioActual } from "@/lib/auth";
import { FormularioLogin } from "@/components/admin/FormularioLogin";

export const metadata: Metadata = {
  title: "Ingresar",
  robots: { index: false, follow: false },
};

export default async function PaginaIngresar() {
  const usuario = await obtenerUsuarioActual();
  if (usuario) redirect("/admin");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-8 px-4 py-16">
      <Image src="/logo.png" alt="Logo de ACPSIJUPBA" width={80} height={80} className="h-20 w-20" />
      <div className="w-full rounded-tarjeta border border-tierra-100 bg-crema p-8">
        <h1 className="font-display text-h2 font-bold text-verde-900">
          Ingresar
        </h1>
        <p className="mt-2 text-cuerpo text-texto-suave">
          Acceso para administradores de ACPSIJUPBA.
        </p>
        <div className="mt-6">
          <FormularioLogin />
        </div>
      </div>
    </div>
  );
}
