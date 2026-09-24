import { obtenerIniciales } from "@/lib/formato";

type Props = {
  nombre: string;
  apellido: string;
};

// La asociación pidió que no haya fotos de los miembros, solo un listado con
// los nombres (ver docs/DECISIONES.md): siempre se muestran las iniciales.
export function AvatarIniciales({ nombre, apellido }: Props) {
  return (
    <div
      className="flex h-24 w-24 items-center justify-center rounded-full bg-verde-100 text-h3 font-display font-bold text-verde-900"
      aria-hidden="true"
    >
      {obtenerIniciales(nombre, apellido)}
    </div>
  );
}
