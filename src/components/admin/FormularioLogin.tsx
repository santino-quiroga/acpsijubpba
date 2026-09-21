"use client";

import { useActionState, useState } from "react";
import { iniciarSesion } from "@/actions/auth";
import { Boton } from "@/components/ui/Boton";

export function FormularioLogin() {
  const [estado, accion, pendiente] = useActionState(iniciarSesion, undefined);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <form action={accion} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="usuario" className="font-bold text-texto">
          Usuario
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          required
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-bold text-texto">
          Contraseña
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id="password"
            name="password"
            type={mostrarPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="min-h-boton flex-1 rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword((valor) => !valor)}
            aria-pressed={mostrarPassword}
            className="min-h-boton rounded-boton border-2 border-verde-900 px-4 font-bold text-verde-900"
          >
            {mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          </button>
        </div>
      </div>

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={pendiente} className="justify-center">
        {pendiente ? "Ingresando…" : "Ingresar"}
      </Boton>
    </form>
  );
}
