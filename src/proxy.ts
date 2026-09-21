import { createHash } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

// Protege /admin (sección 5 del SDD). Desde Next.js 16, `middleware.ts` está
// deprecado a favor de `proxy.ts` (ver docs/DECISIONES.md).
// Regla de seguridad de la sección 5: esto NO alcanza por sí solo — cada
// Server Action del panel llama a requireAdmin() (src/lib/auth.ts) además.
const NOMBRE_COOKIE = "acp_sesion";

async function buscarSesionValida(token: string) {
  const id = createHash("sha256").update(token).digest("hex");
  const sesion = await db.sesion.findUnique({
    where: { id },
    include: { usuario: true },
  });
  if (!sesion || sesion.expiresAt <= new Date() || !sesion.usuario.activo) {
    return null;
  }
  return sesion;
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(NOMBRE_COOKIE)?.value;
  const sesion = token ? await buscarSesionValida(token) : null;

  if (!sesion) {
    return NextResponse.redirect(new URL("/ingresar", request.url));
  }

  // Primer ingreso u obligado por un reseteo (sección 9.1): bloquea el resto
  // del panel hasta que cambie la contraseña en /admin/mi-cuenta.
  const esRutaMiCuenta = request.nextUrl.pathname.startsWith("/admin/mi-cuenta");
  if (sesion.usuario.debeCambiarPassword && !esRutaMiCuenta) {
    return NextResponse.redirect(
      new URL("/admin/mi-cuenta?primer-ingreso=1", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
