"use client";

import { useActionState } from "react";
import { cambiarPasswordPropia } from "@/actions/auth";
import { Boton } from "@/components/ui/Boton";
import { PASSWORD_MIN } from "@/lib/validations/auth";

export function FormularioCambiarPassword() {
  const [estado, accion, pendiente] = useActionState(cambiarPasswordPropia, undefined);

  return (
    <form action={accion} className="flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="passwordActual" className="font-bold text-texto">
          Contraseña actual
        </label>
        <input
          id="passwordActual"
          name="passwordActual"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="passwordNueva" className="font-bold text-texto">
          Contraseña nueva
        </label>
        <input
          id="passwordNueva"
          name="passwordNueva"
          type="password"
          autoComplete="new-password"
          minLength={PASSWORD_MIN}
          required
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
        <p className="text-chico text-texto-suave">
          Mínimo {PASSWORD_MIN} caracteres. No hace falta usar símbolos: podés
          usar una frase fácil de recordar.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmarPassword" className="font-bold text-texto">
          Repetí la contraseña nueva
        </label>
        <input
          id="confirmarPassword"
          name="confirmarPassword"
          type="password"
          autoComplete="new-password"
          required
          className="min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700"
        />
      </div>

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={pendiente} className="justify-center">
        {pendiente ? "Guardando…" : "Cambiar contraseña"}
      </Boton>
    </form>
  );
}
