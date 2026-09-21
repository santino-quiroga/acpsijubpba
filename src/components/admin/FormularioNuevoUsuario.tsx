"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { crearUsuarioAction } from "@/actions/usuarios";
import { Boton } from "@/components/ui/Boton";
import { PasswordTemporalRevelada } from "@/components/admin/PasswordTemporalRevelada";

export function FormularioNuevoUsuario() {
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(crearUsuarioAction, undefined);
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
      <PasswordTemporalRevelada
        usuario={revelado.usuario}
        passwordTemporal={revelado.passwordTemporal}
        onCerrar={() => setRevelado(null)}
      />
    );
  }

  return (
    <form action={accion} className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="nombre" className="font-bold text-texto">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="usuario" className="font-bold text-texto">
          Usuario
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          required
          autoCapitalize="off"
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>
      {estado && "error" in estado && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}
      <Boton type="submit" disabled={pendiente}>
        + Nuevo administrador
      </Boton>
    </form>
  );
}
