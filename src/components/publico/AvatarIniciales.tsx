import Image from "next/image";
import { obtenerIniciales } from "@/lib/formato";

type Props = {
  nombre: string;
  apellido: string;
  fotoUrl?: string | null;
};

// Avatar con iniciales cuando no hay foto cargada (sección 15, pendiente #4).
export function AvatarIniciales({ nombre, apellido, fotoUrl }: Props) {
  if (fotoUrl) {
    return (
      <Image
        src={fotoUrl}
        alt=""
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="flex h-24 w-24 items-center justify-center rounded-full bg-verde-100 text-h3 font-display font-bold text-verde-900"
      aria-hidden="true"
    >
      {obtenerIniciales(nombre, apellido)}
    </div>
  );
}
