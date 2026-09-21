// Alta/reset de administradores por CLI (sección 9.4 del SDD), para cuando
// nadie tiene acceso al panel. Uso:
//   npm run admin:crear -- --usuario X --nombre "Y"
//   npm run admin:reset -- --usuario X
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generarPasswordTemporal } from "../src/lib/password-temporal";

const db = new PrismaClient();

function leerArgumento(nombre: string): string | undefined {
  const indice = process.argv.indexOf(`--${nombre}`);
  if (indice === -1) return undefined;
  return process.argv[indice + 1];
}

async function crear() {
  const usuario = leerArgumento("usuario")?.trim().toLowerCase();
  const nombre = leerArgumento("nombre")?.trim();

  if (!usuario || !nombre) {
    console.error('Uso: npm run admin:crear -- --usuario X --nombre "Y"');
    process.exit(1);
  }

  const existente = await db.usuario.findUnique({ where: { usuario } });
  if (existente) {
    console.error(`Ya existe un administrador con el usuario "${usuario}".`);
    process.exit(1);
  }

  const passwordTemporal = generarPasswordTemporal();
  const passwordHash = await bcrypt.hash(passwordTemporal, 12);

  await db.usuario.create({
    data: { usuario, nombre, passwordHash, debeCambiarPassword: true },
  });

  console.log("Administrador creado.");
  console.log(`  Usuario: ${usuario}`);
  console.log(`  Contraseña temporal (anotala, no se vuelve a mostrar): ${passwordTemporal}`);
}

async function reset() {
  const usuario = leerArgumento("usuario")?.trim().toLowerCase();

  if (!usuario) {
    console.error("Uso: npm run admin:reset -- --usuario X");
    process.exit(1);
  }

  const existente = await db.usuario.findUnique({ where: { usuario } });
  if (!existente) {
    console.error(`No existe un administrador con el usuario "${usuario}".`);
    process.exit(1);
  }

  const passwordTemporal = generarPasswordTemporal();
  const passwordHash = await bcrypt.hash(passwordTemporal, 12);

  await db.$transaction([
    db.usuario.update({
      where: { id: existente.id },
      data: { passwordHash, debeCambiarPassword: true },
    }),
    db.sesion.deleteMany({ where: { usuarioId: existente.id } }),
  ]);

  console.log("Contraseña restablecida.");
  console.log(`  Usuario: ${usuario}`);
  console.log(`  Contraseña temporal (anotala, no se vuelve a mostrar): ${passwordTemporal}`);
}

async function main() {
  const modo = process.argv[2];
  if (modo === "crear") return crear();
  if (modo === "reset") return reset();
  console.error('Uso: npm run admin:crear -- --usuario X --nombre "Y"');
  console.error("     npm run admin:reset -- --usuario X");
  process.exit(1);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
