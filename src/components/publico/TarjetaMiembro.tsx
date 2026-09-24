import { AvatarIniciales } from "@/components/publico/AvatarIniciales";
import { formatearNombreConTitulo } from "@/lib/formato";
import type { MiembroComision } from "@prisma/client";

export function TarjetaMiembro({ miembro }: { miembro: MiembroComision }) {
  return (
    <li className="flex flex-col items-center gap-3 rounded-tarjeta border border-tierra-100 bg-crema p-5 text-center">
      <AvatarIniciales nombre={miembro.nombre} apellido={miembro.apellido} />
      {miembro.cargo && (
        <p className="font-display font-bold text-verde-900">
          {miembro.cargo}
        </p>
      )}
      <p className="text-cuerpo">
        {formatearNombreConTitulo(miembro.titulo, miembro.nombre, miembro.apellido)}
      </p>
    </li>
  );
}
