import { PrismaClient, GrupoComision, TituloProfesional } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed idempotente (sección 11 del SDD): usa upsert con ids fijos para el
 * contenido inicial, de forma que correr `npm run db:seed` varias veces no
 * duplique datos. Los campos existentes no se sobrescriben en corridas
 * posteriores porque, a partir de ahí, ese contenido se edita desde el panel.
 */

const prisma = new PrismaClient();

async function seedAdmin() {
  const usuario = process.env.SEED_ADMIN_USUARIO;
  const nombre = process.env.SEED_ADMIN_NOMBRE;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!usuario || !nombre || !password) {
    console.warn(
      "SEED_ADMIN_USUARIO / SEED_ADMIN_NOMBRE / SEED_ADMIN_PASSWORD no están definidas: se omite la creación del administrador inicial.",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.usuario.upsert({
    where: { usuario: usuario.toLowerCase() },
    update: {},
    create: {
      usuario: usuario.toLowerCase(),
      nombre,
      passwordHash,
      debeCambiarPassword: true,
    },
  });

  console.log(`Administrador inicial listo: ${usuario.toLowerCase()}`);
}

async function seedComisionDirectiva() {
  const periodoId = "periodo-2025-2027";

  await prisma.periodoComision.upsert({
    where: { id: periodoId },
    update: {},
    create: {
      id: periodoId,
      nombre: "2025–2027",
      vigente: true,
    },
  });

  const miembros: {
    id: string;
    grupo: GrupoComision;
    cargo: string | null;
    titulo: TituloProfesional;
    nombre: string;
    apellido: string;
    orden: number;
  }[] = [
    // Mesa Directiva
    { id: "miembro-odera", grupo: "MESA_DIRECTIVA", cargo: "Presidenta", titulo: "PSIC", nombre: "María Angela", apellido: "Odera", orden: 1 },
    { id: "miembro-di-stefano", grupo: "MESA_DIRECTIVA", cargo: "Secretaria", titulo: "LIC", nombre: "Silvia", apellido: "Di Stefano", orden: 2 },
    { id: "miembro-donofrio", grupo: "MESA_DIRECTIVA", cargo: "Prosecretaria", titulo: "PSIC", nombre: "Susana", apellido: "D'Onofrio", orden: 3 },
    { id: "miembro-sager", grupo: "MESA_DIRECTIVA", cargo: "Tesorera", titulo: "PSIC", nombre: "Alicia", apellido: "Sager", orden: 4 },
    { id: "miembro-le-favi", grupo: "MESA_DIRECTIVA", cargo: "Protesorera", titulo: "PSIC", nombre: "Carmen", apellido: "Le Favi", orden: 5 },
    // Vocales titulares
    { id: "miembro-romulo", grupo: "VOCAL_TITULAR", cargo: null, titulo: "PSIC", nombre: "Jorge", apellido: "Rómulo", orden: 1 },
    { id: "miembro-mariani", grupo: "VOCAL_TITULAR", cargo: null, titulo: "PSIC", nombre: "Laura", apellido: "Mariani", orden: 2 },
    { id: "miembro-espinosa", grupo: "VOCAL_TITULAR", cargo: null, titulo: "PSIC", nombre: "Olga", apellido: "Espinosa", orden: 3 },
    // Vocales suplentes
    { id: "miembro-perez", grupo: "VOCAL_SUPLENTE", cargo: null, titulo: "PSIC", nombre: "Alicia", apellido: "Perez", orden: 1 },
    { id: "miembro-gadea", grupo: "VOCAL_SUPLENTE", cargo: null, titulo: "PSIC", nombre: "Stella Maris", apellido: "Gadea", orden: 2 },
    { id: "miembro-anasagasti", grupo: "VOCAL_SUPLENTE", cargo: null, titulo: "PSIC", nombre: "Susana", apellido: "Anasagasti", orden: 3 },
    // Comisión revisora de cuentas — titulares
    { id: "miembro-cerbino", grupo: "REVISORA_TITULAR", cargo: null, titulo: "PSIC", nombre: "Hugo", apellido: "Cerbino", orden: 1 },
    { id: "miembro-spacapan", grupo: "REVISORA_TITULAR", cargo: null, titulo: "PSIC", nombre: "Alda", apellido: "Spacapan", orden: 2 },
    // Comisión revisora de cuentas — suplentes
    { id: "miembro-negri", grupo: "REVISORA_SUPLENTE", cargo: null, titulo: "PSIC", nombre: "Ana", apellido: "Negri", orden: 1 },
    { id: "miembro-gagliano", grupo: "REVISORA_SUPLENTE", cargo: null, titulo: "PSIC", nombre: "Graciela", apellido: "Gagliano", orden: 2 },
  ];

  for (const miembro of miembros) {
    await prisma.miembroComision.upsert({
      where: { id: miembro.id },
      update: {},
      create: { ...miembro, periodoId },
    });
  }

  console.log(`Período ${periodoId} y ${miembros.length} miembros listos.`);
}

async function seedComisionesTrabajo() {
  const comisiones = [
    {
      id: "comision-cultura",
      nombre: "Cultura",
      icono: "palette",
      orden: 1,
      descripcion:
        "Exposiciones, talleres y conferencias para compartir intereses y saberes.",
    },
    {
      id: "comision-turismo",
      nombre: "Turismo",
      icono: "plane",
      orden: 2,
      descripcion:
        "Salidas y viajes para disfrutar y fortalecer vínculos entre colegas.",
    },
    {
      id: "comision-temas-legales",
      nombre: "Temas Legales",
      icono: "scale",
      orden: 3,
      descripcion:
        "Seguimiento de la legislación previsional y defensa de los derechos de los jubilados.",
    },
    {
      id: "comision-reconstruccion-historia",
      nombre: "Reconstrucción de la Historia",
      icono: "book-open",
      orden: 4,
      descripcion:
        "Recuperación y registro de la historia de la asociación y sus protagonistas.",
    },
    {
      id: "comision-salud-bienestar",
      nombre: "Salud y Bienestar",
      icono: "heart-pulse",
      orden: 5,
      descripcion: "Propuestas para el cuidado integral y la calidad de vida.",
    },
  ];

  for (const comision of comisiones) {
    await prisma.comisionTrabajo.upsert({
      where: { id: comision.id },
      update: {},
      create: comision,
    });
  }

  console.log(`${comisiones.length} comisiones de trabajo listas.`);
}

async function seedContenidoInicio() {
  await prisma.contenidoInicio.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTitulo:
        "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires",
      heroSubtitulo:
        "Un espacio de participación, contención, orientación y pertenencia para colegas jubilados y pensionados.",
      bienvenidaTitulo: "Quiénes somos",
      bienvenidaTexto:
        "<p>Constituimos una Asociación Civil con personería jurídica para los psicólogos jubilados de la Provincia de Buenos Aires. Es nuestro objetivo ser un colectivo capaz de representar a nuestros asociados. Tenemos participación activa en las asambleas de La Caja de Psicólogos.</p>" +
        "<p>Durante la pandemia hacíamos nuestras reuniones por Zoom. Organizamos de la misma manera conversatorios cada quince días donde se contuvo y se compartió todo lo que en ese momento nos atravesaba. Esto facilitó el intercambio salvando las distancias, dado que tenemos socios de diferentes partidos e incluso fuera de la provincia, como también de CABA. Tenemos una filial en Mar del Plata.</p>" +
        "<p>Utilizamos diversos medios para comunicarnos: Meet para reuniones a distancia, grupos de WhatsApp, etc. Realizamos encuentros para celebrar nuestro día, para finalizar el año y en las salidas de turismo, entre otros.</p>",
      asociarseTitulo: "¿Querés asociarte?",
      asociarseTexto:
        "<p>Te invitamos a sumarte a la asociación, participar de las reuniones y formar parte de nuestras comisiones. Escribinos y te contamos cómo.</p>",
    },
  });

  console.log("Contenido de Inicio listo.");
}

async function seedDatosContacto() {
  await prisma.datosContacto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: "acpsijupba@gmail.com",
      filialNombre: "Filial Mar del Plata",
    },
  });

  console.log("Datos de contacto listos.");
}

async function seedNoticiasDemo() {
  const admin = await prisma.usuario.findFirst({ orderBy: { createdAt: "asc" } });
  const cultura = await prisma.comisionTrabajo.findUnique({
    where: { id: "comision-cultura" },
  });
  const turismo = await prisma.comisionTrabajo.findUnique({
    where: { id: "comision-turismo" },
  });

  const noticias = [
    {
      id: "demo-noticia-encuentro-bienvenida",
      titulo: "Encuentro de bienvenida para nuevos socios",
      slug: "encuentro-de-bienvenida-para-nuevos-socios",
      resumen:
        "Invitamos a los colegas recién asociados a un encuentro para conocerse y conocer las comisiones de trabajo.",
      contenidoHtml:
        "<p>Este es un contenido de ejemplo para desarrollo, generado por el seed con SEED_DEMO=true.</p>",
      comisionId: cultura?.id ?? null,
      fechaPublicacion: new Date("2026-03-10"),
    },
    {
      id: "demo-noticia-viaje-tandil",
      titulo: "Nuevo viaje organizado a Tandil",
      slug: "nuevo-viaje-organizado-a-tandil",
      resumen:
        "La comisión de turismo organiza una nueva salida de dos días para socias y socios de la asociación.",
      contenidoHtml:
        "<p>Este es un contenido de ejemplo para desarrollo, generado por el seed con SEED_DEMO=true.</p>",
      comisionId: turismo?.id ?? null,
      fechaPublicacion: new Date("2026-04-02"),
    },
    {
      id: "demo-noticia-asamblea-anual",
      titulo: "Convocatoria a la asamblea anual ordinaria",
      slug: "convocatoria-a-la-asamblea-anual-ordinaria",
      resumen:
        "Se convoca a todos los asociados a participar de la asamblea anual, con lectura de la memoria y el balance.",
      contenidoHtml:
        "<p>Este es un contenido de ejemplo para desarrollo, generado por el seed con SEED_DEMO=true.</p>",
      comisionId: null,
      fechaPublicacion: new Date("2026-05-15"),
    },
    {
      id: "demo-noticia-taller-cultura",
      titulo: "Taller de escritura: últimas vacantes",
      slug: "taller-de-escritura-ultimas-vacantes",
      resumen:
        "Quedan pocos lugares para el taller de escritura que organiza la comisión de Cultura este cuatrimestre.",
      contenidoHtml:
        "<p>Este es un contenido de ejemplo para desarrollo, generado por el seed con SEED_DEMO=true.</p>",
      comisionId: cultura?.id ?? null,
      fechaPublicacion: new Date("2026-06-01"),
    },
  ];

  for (const noticia of noticias) {
    await prisma.noticia.upsert({
      where: { id: noticia.id },
      update: {},
      create: {
        ...noticia,
        estado: "PUBLICADA",
        autorId: admin?.id ?? null,
      },
    });
  }

  console.log(`${noticias.length} noticias de ejemplo listas (SEED_DEMO=true).`);
}

async function main() {
  await seedAdmin();
  await seedComisionDirectiva();
  await seedComisionesTrabajo();
  await seedContenidoInicio();
  await seedDatosContacto();

  if (process.env.SEED_DEMO === "true") {
    await seedNoticiasDemo();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
