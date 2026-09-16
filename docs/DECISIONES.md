# Decisiones de implementación

Registro de decisiones tomadas cuando `docs/SDD_ACPSIJUPBA.md` no especifica un
valor exacto, siguiendo la instrucción de la sección 0 ("elegir la opción más
simple y dejarla anotada acá").

## Fase 1 — Base

**1. Versión de Tailwind CSS: v3, no v4.**
`create-next-app` actual instala Tailwind v4 por defecto (config "CSS-first"
con `@theme` en `globals.css`, sin archivo `tailwind.config`). La sección 10.1
del SDD pide explícitamente "los tokens de color de la sección 10.1 en
`tailwind.config`", por lo que se instaló Tailwind v3 manualmente
(`tailwindcss@^3`, `postcss`, `autoprefixer`) para poder seguir esa
instrucción tal cual está escrita.

**2. Versión de Prisma: fijada en `6.19.3` (exacta), no la última (7.x/8.x).**
El schema de la sección 6 define `url` y `directUrl` directamente en el bloque
`datasource`. Desde Prisma 7, esa sintaxis ya no es válida: exige mover las
URLs a un archivo `prisma.config.ts` nuevo y construir `PrismaClient` con un
"driver adapter" (`@prisma/adapter-pg` o similar), conceptos que no figuran en
la sección 4 del SDD. Para respetar el schema exactamente como está escrito en
la sección 6, se fijó `prisma` y `@prisma/client` en `6.19.3` (la última
versión estable que soporta esta sintaxis). Si en una fase posterior se
decide migrar a Prisma 7+, hay que avisar antes porque implica reescribir
`datasource`, crear `prisma.config.ts` y cambiar `src/lib/db.ts`.

**3. Escala tipográfica (sección 10.2) llevada a `rem` sobre una base
`html` de 18px (móvil) / 20px (desktop, sección 3.2).**
Se agregaron los tokens `text-h1` (2.2rem), `text-h2` (1.7rem), `text-h3`
(1.3rem), `text-cuerpo` (1rem) y `text-chico` (0.9rem, en vez de los 0.85rem
que darían exactamente 17px en desktop) para que ningún texto baje de 16px en
móvil, cumpliendo la regla "nunca menos de 16px" de la sección 10.2. En
desktop, `chico` queda en 18px en vez de 17px (diferencia menor, no
perceptible en el diseño).

**4. `src/app/layout.tsx` (raíz) no aparece en el árbol de la sección 5.**
El árbol de carpetas solo muestra `(publico)/layout.tsx` (Header + Footer) y
`admin/layout.tsx`, pero Next.js App Router exige un único layout raíz con
`<html>`/`<body>`. Se mantuvo `src/app/layout.tsx` como raíz (fuentes vía
`next/font`, `lang="es-AR"`, metadata por defecto) y `(publico)/layout.tsx`
como un layout de paso (`return children`) hasta la Fase 2, donde se le agrega
el Header y el Footer reales.

**5. Recorte del texto de Bienvenida (`bienvenidaTexto`, sección 11).**
Se tomaron los primeros tres párrafos de `docs/PRESENTACION-DE-APCPSIJUPBA.md`
con las correcciones de la sección 11 aplicadas. Se omitieron la última
oración ("Tenemos Comisiones como...") y la firma de mail final, porque esa
información ya se muestra por separado en "Nuestras comisiones de trabajo"
(`ComisionTrabajo`) y en Contacto (`DatosContacto.email`), y el SDD pide "2–3
párrafos", no la transcripción completa.

**6. Ids fijos (no `cuid()` autogenerado) para las filas del seed.**
El SDD pide que `seed.ts` sea idempotente "usando upsert" (sección 11), pero
`PeriodoComision`, `MiembroComision` y `ComisionTrabajo` no tienen en la
sección 6 ninguna columna `@unique` además de `id` para hacer `upsert` sobre
un dato de negocio (nombre, apellido, etc.). En vez de agregar restricciones
`@unique` que no están en el schema del SDD, el seed asigna ids fijos y
legibles (`periodo-2025-2027`, `miembro-odera`, `comision-cultura`, etc.) y
hace `upsert` por `id`. Esto es estándar en seeds de Prisma y no cambia el
schema.

**7. Scripts agregados a `package.json` no listados en la sección 13.**
- `"postinstall": "prisma generate"`: garantiza que el cliente de Prisma se
  genere siempre después de `npm install`, sin paso manual adicional.
- `"typecheck": "tsc --noEmit"` y el bloque `"prisma": { "seed": "tsx
  prisma/seed.ts" }`: necesarios para que `prisma db seed` y `npm run
  typecheck` (pedido en la sección 0) funcionen.

**8. `admin:crear` / `admin:reset` y `scripts/crear-admin.ts` se implementan
recién en la Fase 3 (Autenticación).**
La sección 13 los lista como scripts del proyecto, pero dependen de lógica de
sesiones/contraseñas (sección 9) que todavía no existe en la Fase 1. Agregar
ahora los scripts de `package.json` apuntando a un archivo inexistente los
dejaría rotos, así que se posponen al paquete completo de autenticación.

**9. Nombre del paquete normalizado a minúsculas.**
npm no permite mayúsculas en `name` de `package.json`. La carpeta del proyecto
es `Acpsijupba`; el paquete quedó como `"acpsijupba"`.

## Pendiente de una base de datos real

No hay PostgreSQL disponible en este entorno de desarrollo (sin Docker ni
servidor local). Se validó que:
- `npx prisma validate` y `npx prisma generate` funcionan correctamente.
- `prisma/seed.ts` compila sin errores de tipos y se ejecuta hasta el intento
  de conexión (falla únicamente por "Can't reach database server", como se
  espera sin una base real).

Falta correr `db:migrate` y `db:seed` (dos veces, para confirmar que no
duplica) contra una base Postgres real (por ejemplo, una de Neon) antes de dar
por verificado el criterio de aceptación completo de la sección 14 para esta
fase.
