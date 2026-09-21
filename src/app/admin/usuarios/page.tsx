import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatearFecha } from "@/lib/formato";
import { FormularioNuevoUsuario } from "@/components/admin/FormularioNuevoUsuario";
import { FilaUsuario } from "@/components/admin/FilaUsuario";

export default async function PaginaUsuarios() {
  const sesionActual = await requireAdmin();
  const usuarios = await db.usuario.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">Usuarios</h1>

      <section className="mt-6 rounded-tarjeta border border-tierra-100 p-5">
        <h2 className="font-display text-h3 font-bold text-texto">
          + Nuevo administrador
        </h2>
        <div className="mt-4">
          <FormularioNuevoUsuario />
        </div>
      </section>

      <ul className="mt-8 flex flex-col gap-4">
        {usuarios.map((usuario) => (
          <FilaUsuario
            key={usuario.id}
            usuario={usuario}
            esUsuarioActual={usuario.id === sesionActual.id}
            ultimoAccesoTexto={
              usuario.ultimoAcceso ? formatearFecha(usuario.ultimoAcceso) : "Nunca"
            }
          />
        ))}
      </ul>
    </div>
  );
}
