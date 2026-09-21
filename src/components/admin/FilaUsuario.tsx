"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cambiarActivoUsuario, eliminarUsuario, restablecerPasswordAction } from "@/actions/usuarios";
import { PasswordTemporalRevelada } from "@/components/admin/PasswordTemporalRevelada";
import { ConfirmacionEliminar } from "@/components/ui/ConfirmacionEliminar";

export function FilaUsuario({
  usuario,
  esUsuarioActual,
  ultimoAccesoTexto,
}: {
  usuario: { id: string; nombre: string; usuario: string; activo: boolean };
  esUsuarioActual: boolean;
  ultimoAccesoTexto: string;
}) {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(restablecerPasswordAction, undefined);
  const [revelado, setRevelado] = useState<{ usuario: string; passwordTemporal: string } | null>(
    null,
  );

  useEffect(() => {
    if (estado && "ok" in estado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevelado({ usuario: estado.usuario, passwordTemporal: estado.passwordTemporal });
      router.refresh();
    }
  }, [estado, router]);

  if (revelado) {
    return (
      <li className="rounded-tarjeta border border-tierra-100 p-4">
        <PasswordTemporalRevelada
          usuario={revelado.usuario}
          passwordTemporal={revelado.passwordTemporal}
          onCerrar={() => setRevelado(null)}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-3 rounded-tarjeta border border-tierra-100 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <span
          className={`inline-flex w-fit rounded-boton px-3 py-1 text-chico font-bold ${
            usuario.activo ? "bg-verde-100 text-verde-900" : "bg-tierra-100 text-tierra-900"
          }`}
        >
          {usuario.activo ? "Activo" : "Inactivo"}
        </span>
        <p className="font-display text-h3 font-bold text-texto">
          {usuario.nombre}{" "}
          <span className="font-sans text-chico font-normal text-texto-suave">
            @{usuario.usuario}
          </span>
        </p>
        <p className="text-chico text-texto-suave">Último acceso: {ultimoAccesoTexto}</p>
        {estado && "error" in estado && (
          <p role="alert" className="font-bold text-error">
            {estado.error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <form action={accion}>
          <input type="hidden" name="id" value={usuario.id} />
          <button
            type="submit"
            disabled={pendiente}
            className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
          >
            Restablecer contraseña
          </button>
        </form>

        <form action={cambiarActivoUsuario.bind(null, usuario.id, !usuario.activo)}>
          <button
            type="submit"
            className="min-h-boton rounded-boton border-2 border-tierra-900 px-4 font-bold text-tierra-900"
          >
            {usuario.activo ? "Desactivar" : "Activar"}
          </button>
        </form>

        {!esUsuarioActual && (
          <ConfirmacionEliminar
            mensaje={`Se va a eliminar a "${usuario.nombre}" (@${usuario.usuario}) para siempre. Esta acción no se puede deshacer.`}
            accionConfirmar={eliminarUsuario.bind(null, usuario.id)}
          />
        )}
      </div>
    </li>
  );
}
