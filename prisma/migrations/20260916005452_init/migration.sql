-- CreateEnum
CREATE TYPE "EstadoNoticia" AS ENUM ('BORRADOR', 'PUBLICADA');

-- CreateEnum
CREATE TYPE "GrupoComision" AS ENUM ('MESA_DIRECTIVA', 'VOCAL_TITULAR', 'VOCAL_SUPLENTE', 'REVISORA_TITULAR', 'REVISORA_SUPLENTE');

-- CreateEnum
CREATE TYPE "TituloProfesional" AS ENUM ('PSIC', 'LIC', 'DR', 'NINGUNO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "debeCambiarPassword" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sesion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntentoLogin" (
    "id" TEXT NOT NULL,
    "identificador" TEXT NOT NULL,
    "exitoso" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntentoLogin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Noticia" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "slug" TEXT NOT NULL,
    "resumen" VARCHAR(250) NOT NULL,
    "contenidoHtml" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "imagenAlt" VARCHAR(200),
    "estado" "EstadoNoticia" NOT NULL DEFAULT 'BORRADOR',
    "fechaPublicacion" TIMESTAMP(3),
    "comisionId" TEXT,
    "autorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodoComision" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "vigente" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PeriodoComision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiembroComision" (
    "id" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,
    "grupo" "GrupoComision" NOT NULL,
    "cargo" TEXT,
    "titulo" "TituloProfesional" NOT NULL DEFAULT 'PSIC',
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MiembroComision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComisionTrabajo" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" VARCHAR(400) NOT NULL,
    "icono" TEXT NOT NULL DEFAULT 'users',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ComisionTrabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContenidoInicio" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroTitulo" VARCHAR(120) NOT NULL,
    "heroSubtitulo" VARCHAR(250) NOT NULL,
    "bienvenidaTitulo" VARCHAR(120) NOT NULL,
    "bienvenidaTexto" TEXT NOT NULL,
    "asociarseTitulo" VARCHAR(120) NOT NULL,
    "asociarseTexto" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContenidoInicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatosContacto" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "whatsappMostrar" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "horarios" TEXT,
    "filialNombre" TEXT DEFAULT 'Filial Mar del Plata',
    "filialDireccion" TEXT,
    "filialEmail" TEXT,
    "filialTelefono" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatosContacto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");

-- CreateIndex
CREATE INDEX "Sesion_usuarioId_idx" ON "Sesion"("usuarioId");

-- CreateIndex
CREATE INDEX "IntentoLogin_identificador_createdAt_idx" ON "IntentoLogin"("identificador", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Noticia_slug_key" ON "Noticia"("slug");

-- CreateIndex
CREATE INDEX "Noticia_estado_fechaPublicacion_idx" ON "Noticia"("estado", "fechaPublicacion");

-- CreateIndex
CREATE INDEX "MiembroComision_periodoId_grupo_orden_idx" ON "MiembroComision"("periodoId", "grupo", "orden");

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_comisionId_fkey" FOREIGN KEY ("comisionId") REFERENCES "ComisionTrabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiembroComision" ADD CONSTRAINT "MiembroComision_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "PeriodoComision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
