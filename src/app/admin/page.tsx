import { requireAdmin } from "@/lib/auth";

// Escritorio completo (accesos grandes y resumen de noticias) en la Fase 5
// (sección 8.2). Por ahora, el saludo confirma que la sesión funciona.
export default async function EscritorioAdmin() {
  const usuario = await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-h1 font-bold text-verde-900">
        Hola, {usuario.nombre}
      </h1>
      <p className="mt-2 text-cuerpo text-texto-suave">
        Este es tu panel de administración. Pronto vas a poder publicar
        noticias y editar los datos del sitio desde aquí.
      </p>
    </div>
  );
}
