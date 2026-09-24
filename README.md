# ACPSIJUPBA — Sitio institucional

Sitio institucional de la Asociación Civil Psicólogos Jubilados y
Pensionados de la Provincia de Buenos Aires: sitio público (Inicio,
Historia, Objetivos, Comisión Directiva, Actividades, Contacto) más un panel
de administración para editar todo el contenido sin tocar código.

El documento de referencia del proyecto es [`docs/SDD_ACPSIJUPBA.md`](docs/SDD_ACPSIJUPBA.md).
Las decisiones tomadas donde ese documento no era específico están
registradas en [`docs/DECISIONES.md`](docs/DECISIONES.md).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Prisma + PostgreSQL
(Neon) · Vercel Blob (imágenes) · Tiptap (editor de texto enriquecido).

## Instalación local

**Requisitos**: Node.js 20 o superior y una base de datos PostgreSQL (se
recomienda [Neon](https://neon.tech), que es la que se usa en producción).

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` a `.env` y completar las variables (ver abajo).

3. Aplicar las migraciones y cargar los datos iniciales:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

   El seed es idempotente: se puede correr más de una vez sin duplicar
   datos. Crea el administrador inicial con los datos de
   `SEED_ADMIN_USUARIO` / `SEED_ADMIN_NOMBRE` / `SEED_ADMIN_PASSWORD`.

4. Levantar el entorno de desarrollo:

   ```bash
   npm run dev
   ```

   El sitio queda en [http://localhost:3000](http://localhost:3000) y el
   panel en [http://localhost:3000/ingresar](http://localhost:3000/ingresar).

**Otros scripts útiles**: `npm run build` (build de producción), `npm run
lint`, `npm run typecheck`, `npm run db:deploy` (aplica migraciones en
producción, sin generar una nueva).

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL (pooled), la que usa la app. |
| `DATABASE_URL_UNPOOLED` | Conexión directa, la que usa `prisma migrate`. |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob, para subir imágenes de actividades y fotos de la Comisión Directiva. |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (ej. `https://acpsijupba.org.ar`). Se usa para el sitemap, el `robots.txt` y los enlaces para compartir. |
| `SEED_ADMIN_USUARIO` / `SEED_ADMIN_NOMBRE` / `SEED_ADMIN_PASSWORD` | Datos del administrador que crea el seed la primera vez. |
| `SEED_DEMO` | En `true`, el seed agrega además actividades de ejemplo (solo para desarrollo). |

## Administradores: crear o restablecer acceso

Si nadie tiene acceso al panel (o hay que dar de alta un administrador sin
pasar por la interfaz), se usa la línea de comandos (`scripts/crear-admin.ts`):

```bash
# Crear un administrador nuevo
npm run admin:crear -- --usuario jperez --nombre "Juan Pérez"

# Restablecer la contraseña de uno existente (además cierra sus sesiones activas)
npm run admin:reset -- --usuario jperez
```

Ambos comandos imprimen una contraseña temporal en la consola. Anotarla:
no se vuelve a mostrar. La próxima vez que esa persona ingrese, el sistema
le va a pedir que la cambie por una propia.

Si ya hay al menos un administrador con acceso, es más simple hacerlo desde
el panel: **Usuarios** → **"Restablecer contraseña"** en la fila
correspondiente.

## Cómo publicar una actividad (instructivo para la asociación)

1. Ingresar al panel en `/ingresar` con el usuario y la contraseña.
2. En el menú, hacer clic en **"Actividades"**.
3. Hacer clic en el botón verde **"+ Nueva actividad"**.
4. Completar el formulario:
   - **Título**: un título corto y claro (entre 5 y 150 letras).
   - **Resumen**: dos o tres líneas que resuman la actividad (entre 20 y 250
     letras). Es lo que se ve en la lista de actividades.
   - **Imagen de portada** (opcional): una foto de la actividad. Al
     elegirla, hay que completar también el campo de **"Descripción de la
     imagen"**, escribiendo brevemente qué se ve en la foto (por ejemplo:
     "Grupo de socios en la visita al teatro").
   - **Contenido**: el texto completo de la actividad. Se puede poner en
     negrita, en cursiva, agregar subtítulos, listas y enlaces con la
     barra de herramientas de arriba.
   - **Comisión** (opcional): si la actividad está relacionada con alguna
     comisión de trabajo, se puede elegir de la lista.
   - **Fecha de publicación**: por defecto es el día de hoy, pero se puede
     cambiar. Para anunciar una actividad futura (por ejemplo, "el próximo
     2 de octubre visitaremos el teatro"), hay que poner la fecha en la que
     va a ocurrir la actividad: mientras esa fecha no haya llegado, la
     actividad aparece en "Próximas actividades"; una vez pasada, pasa sola a
     "Actividades realizadas".
5. Antes de publicar, se puede tocar **"Vista previa"** para ver cómo va a
   quedar en el sitio.
6. Cuando está lista, hacer clic en **"Publicar"**. La actividad va a
   aparecer inmediatamente en Inicio y en la sección Actividades del sitio —
   no hace falta ningún paso extra.

**Otras acciones disponibles** en cada actividad:
- **"Guardar borrador"**: guarda los cambios sin publicarla todavía (no se
  ve en el sitio público). Útil para dejarla a medio escribir.
- **"Despublicar"**: la saca del sitio público sin borrarla, por si hay
  que corregir algo con tranquilidad.
- **"Eliminar"**: la borra para siempre (pide confirmación antes).

## Deploy

1. Crear el proyecto en Vercel con la cuenta de la asociación y conectar
   este repositorio.
2. Agregar Neon Postgres y Vercel Blob desde el Marketplace/Storage de
   Vercel (las variables de entorno se completan automáticamente).
3. Completar a mano `NEXT_PUBLIC_SITE_URL`, `SEED_ADMIN_USUARIO`,
   `SEED_ADMIN_NOMBRE` y `SEED_ADMIN_PASSWORD`.
4. Build command: `prisma migrate deploy && next build`.
5. Correr el seed una única vez contra producción (`npm run db:seed`, con
   las variables de entorno de producción).
