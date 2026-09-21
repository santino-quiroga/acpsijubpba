"use client";

import { useActionState, useState } from "react";
import type { MiembroComision } from "@prisma/client";
import { guardarMiembroAction } from "@/actions/comision-directiva";
import {
  ETIQUETAS_GRUPO,
  GRUPOS_COMISION,
  SUGERENCIAS_CARGO,
  TITULOS_PROFESIONALES,
} from "@/lib/validations/comision-directiva";
import { CampoFoto } from "@/components/admin/CampoFoto";
import { Boton } from "@/components/ui/Boton";

const ESTILO_INPUT =
  "min-h-boton rounded-boton border-2 border-tierra-100 px-4 text-cuerpo focus:border-verde-700";

const ETIQUETAS_TITULO: Record<string, string> = {
  PSIC: "Psic.",
  LIC: "Lic.",
  DR: "Dr.",
  NINGUNO: "Sin título",
};

export function FormularioMiembro({
  periodoId,
  grupoInicial,
  miembro,
}: {
  periodoId: string;
  grupoInicial?: string;
  miembro?: MiembroComision | null;
}) {
  const [estado, accion, pendiente] = useActionState(guardarMiembroAction, undefined);
  const [grupo, setGrupo] = useState(miembro?.grupo ?? grupoInicial ?? GRUPOS_COMISION[0]);

  return (
    <form action={accion} className="flex max-w-md flex-col gap-5">
      <input type="hidden" name="periodoId" value={periodoId} />
      {miembro && <input type="hidden" name="id" value={miembro.id} />}

      <div className="flex flex-col gap-2">
        <label htmlFor="grupo" className="font-bold text-texto">
          Grupo
        </label>
        <select
          id="grupo"
          name="grupo"
          value={grupo}
          onChange={(evento) => setGrupo(evento.target.value)}
          className={ESTILO_INPUT}
        >
          {GRUPOS_COMISION.map((clave) => (
            <option key={clave} value={clave}>
              {ETIQUETAS_GRUPO[clave]}
            </option>
          ))}
        </select>
      </div>

      {grupo === "MESA_DIRECTIVA" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="cargo" className="font-bold text-texto">
            Cargo
          </label>
          <input
            id="cargo"
            name="cargo"
            type="text"
            list="sugerencias-cargo"
            defaultValue={miembro?.cargo ?? ""}
            className={ESTILO_INPUT}
          />
          <datalist id="sugerencias-cargo">
            {SUGERENCIAS_CARGO.map((sugerencia) => (
              <option key={sugerencia} value={sugerencia} />
            ))}
          </datalist>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="titulo" className="font-bold text-texto">
          Título
        </label>
        <select
          id="titulo"
          name="titulo"
          defaultValue={miembro?.titulo ?? "PSIC"}
          className={ESTILO_INPUT}
        >
          {TITULOS_PROFESIONALES.map((clave) => (
            <option key={clave} value={clave}>
              {ETIQUETAS_TITULO[clave]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="font-bold text-texto">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          defaultValue={miembro?.nombre}
          className={ESTILO_INPUT}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="apellido" className="font-bold text-texto">
          Apellido
        </label>
        <input
          id="apellido"
          name="apellido"
          type="text"
          required
          defaultValue={miembro?.apellido}
          className={ESTILO_INPUT}
        />
      </div>

      <CampoFoto nombre="fotoUrl" urlInicial={miembro?.fotoUrl} />

      {estado?.error && (
        <p role="alert" className="font-bold text-error">
          {estado.error}
        </p>
      )}

      <Boton type="submit" disabled={pendiente} className="self-start">
        {miembro ? "Guardar cambios" : "Agregar miembro"}
      </Boton>
    </form>
  );
}
