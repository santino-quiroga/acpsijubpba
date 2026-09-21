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

**Actualización:** en la Fase 2 se conectó una base Neon real (`DATABASE_URL`
pooled + `DATABASE_URL_UNPOOLED` directa en `.env`, no versionado). Se corrió
`prisma migrate dev` y `prisma db seed` dos veces seguidas contra esa base: los
conteos finales fueron los esperados (1 usuario, 1 período, 15 miembros, 5
comisiones, 1 `ContenidoInicio`, 1 `DatosContacto`, 4 noticias demo), sin
duplicados. El criterio de aceptación de la Fase 1 queda verificado por
completo.

## Fase 2 — Sitio público estático

**1. `suppressHydrationWarning` en `<html>` (layout raíz).**
El control A−/A+ aplica la escala guardada en `localStorage` con un script
inline en `<head>` que corre antes de la hidratación (para evitar el salto
visual). Ese script escribe `style="--escala-texto: ..."` directamente sobre
el `<html>`, el mismo nodo que React hidrata, lo que generaba un warning de
hydration mismatch (atributo `style` distinto entre servidor y cliente). Es el
mismo patrón que usan las librerías de dark-mode (ej. `next-themes`) y se
resuelve de la misma manera: `suppressHydrationWarning` en ese único nodo, sin
afectar el resto del árbol.

**2. La sección "Últimas noticias" de Inicio (7.2, punto 4) se implementa en
la Fase 4, no en esta.**
El modelo `Noticia` ya existe y hay noticias demo en el seed, pero esa sección
depende del mismo trabajo de Noticias (listado, `/noticias/[slug]`, etc.) que
la sección 14 asigna explícitamente a la Fase 4. Se prefirió no adelantar esa
pieza para no duplicar trabajo ni dejar links a `/noticias/[slug]` rotos antes
de tiempo. El resto de Inicio (hero, bienvenida, comisiones de trabajo,
asociarte) sí está implementado y lee de la base.

**3. Placeholder en `/noticias`.**
El header linkea a "Noticias" en las 6 secciones del menú (sección 7.1), así
que se dejó una página mínima ("en construcción") para que el link no
devuelva 404 mientras no exista el listado real (Fase 4).

**4. Correcciones menores a Historia y Objetivos que exceden la lista
explícita del SDD.**
Además de las correcciones literales de las secciones 7.3/7.4, se corrigieron
errores mecánicos evidentes del documento original: espacios dobles, un
guion suelto al final de una oración, paréntesis mal espaciados
`( 2020/ 2021 )` → `(2020/2021)`, y el typo "con lo mismos" → "con los
mismos". También se agregó un punto a la abreviatura "Psic" en "la Psic
Laura Mariani" (Historia) para uniformar con el resto del texto, y una coma
faltante en Objetivos f) ("culturales, recreativas, sociales y de turismo").
Ninguno cambia el sentido del texto original.

**5. Reestructuración de los párrafos de Historia en Intro / línea de
tiempo / logros / cierre.**
La sección 7.3 pide esa estructura explícitamente. El documento original es
una serie de párrafos continuos sin esa división, así que el contenido de
cada párrafo se redistribuyó entre esas secciones (sin agregar información
nueva): los párrafos sobre la misión y el esfuerzo fundacional van como
intro; los hitos con fecha (2013, 2014, 25/04/2015, mayo de 2017, 2020–2021)
arman la línea de tiempo; los ocho logros van en la lista; y la invitación
final queda como cierre.

**6. Base tipográfica escalable con `--escala-texto`.**
El control A−/A+ (3 niveles: 100%, 115%, 130%) multiplica, vía variable CSS,
el `font-size` del `<html>` definido en `tailwind.config.ts`/`globals.css`
(18px móvil / 20px desktop, sección 3.2). Como toda la escala tipográfica
(`text-h1`, `text-cuerpo`, etc.) está en `rem`, un solo control escala todo el
sitio. La preferencia se guarda en `localStorage` y se reaplica antes del
primer render (ver decisión 1).

**7. Verificación manual en navegador.**
Se probaron en Chrome (vía la extensión de automatización): Inicio, Historia,
Objetivos, Comisión Directiva y Contacto con los datos reales del seed; el
control A−/A+ (incluida la persistencia tras recargar y el estado
deshabilitado en los extremos); el menú móvil (apertura, cierre con Escape,
foco en el botón de cerrar); y la ausencia de errores de hidratación en
consola. No se pudo redimensionar la ventana del navegador a un ancho de
teléfono real en este entorno (el comando de resize no tuvo efecto), así que
el menú móvil se verificó forzando su apertura por DOM en lugar de un ancho
de viewport angosto real; falta una verificación visual en un dispositivo o
navegador real a 375px.

## Actualización de contenido — Requisitos para asociarse

Se agregó `docs/Requisitos_para_asociarse.md` (material del cliente) y se
incorporó como lista al final de `asociarseTexto` en `ContenidoInicio`
(sección 11 del SDD, actualizada; pendiente #5 de la sección 15 pasa a
resuelto). Se aplicaron las mismas correcciones de redacción que en el resto
del contenido transcripto: "Pcia. de Bs. As." → "Provincia de Buenos Aires",
minúsculas en sustantivos genéricos ("jubilados", "haber jubilatorio",
"cuota societaria"), manteniendo mayúscula en "La Caja" y en "Ficha de
Inscripción" (nombre de un trámite/formulario específico) y en "Socios
adherentes" (categoría de socio, se destaca en negrita con `<strong>`, ya
permitido por la whitelist de sanitización de la sección 8.3).

Como el seed usa `update: {}` para no pisar contenido ya editado desde el
panel, este cambio no llega solo con `db:seed` a una base que ya tenía el
`ContenidoInicio` cargado — se actualizó una vez a mano contra la base de
Neon ya seedeada. Bases nuevas lo obtienen directo del seed actualizado.

Se agregó la clase `.contenido-html` en `globals.css` (con estilos para
`ul`/`ol`/`li`/`a`) porque hasta ahora el HTML sanitizado de la base solo
tenía párrafos; con una lista, faltaba el estilo de viñetas y el espaciado
entre ítems. Esta misma clase se reutiliza para `Noticia.contenidoHtml` en la
Fase 4, ya que comparte la misma whitelist de tags (sección 8.3).

**Nombre de la comisión "Salud y Buenestar":** en la revisión inicial se
asumió que "Buenestar" (la forma que aparece en
`docs/PRESENTACION-DE-APCPSIJUPBA.md`) era un typo de "Bienestar" y así quedó
en la sección 11 del SDD y en el seed. La asociación confirmó que
**"Buenestar" es la forma correcta**, no un error. Se corrigió en
`prisma/seed.ts`, en la sección 11/15 del SDD y se actualizó a mano el
registro ya existente en la base de Neon (`ComisionTrabajo` con
`id: "comision-salud-bienestar"`; el `id` no se tocó porque no es visible y
cambiarlo no aporta nada, solo el campo `nombre`).

## Nota sobre Next.js 16 y Proxy (relevante para la Fase 3)

Next.js 16 (la versión instalada, 16.3.5) renombró `middleware.ts` a
`proxy.ts`: la convención `middleware` está deprecada desde la v16.0.0. La
sección 5 del SDD ya anticipaba esta ambigüedad ("`middleware.ts` (o
`proxy.ts`, según la versión de Next.js)"). Para la Fase 3 se usará
`src/proxy.ts` exportando una función `proxy()` (no `middleware.ts`), según
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.

## Fase 3 — Autenticación

**1. `src/proxy.ts` valida la sesión contra la base, no solo la presencia de
la cookie.**
Antes de Next.js 16, `middleware.ts` corría en el runtime de Edge, donde usar
Prisma no era viable, así que muchos proyectos solo revisaban si la cookie
existía. Desde la v16, `proxy.ts` corre por defecto en el runtime de Node.js
(confirmado en la documentación empaquetada), así que sí puede hacer la
consulta real a `Sesion`/`Usuario` y redirigir de una sola vez a `/ingresar`
si el token es inválido o venció. Esto es una capa adicional, no un
reemplazo: cada Server Action sigue llamando a `requireAdmin()` igual
(sección 5, "nunca se confía solo en el middleware").

**2. El redirect por `debeCambiarPassword` (primer ingreso) vive en
`proxy.ts`, no en `admin/layout.tsx`.**
Ese redirect necesita saber la ruta pedida (para no redirigir en bucle
cuando ya se está en `/admin/mi-cuenta`), y un layout de Server Component no
tiene una forma simple de leer el pathname actual sin pasar por trucos. En
`proxy.ts` el pathname está disponible directamente (`request.nextUrl.pathname`)
y ya se está consultando el usuario para validar la sesión, así que no hay
consulta extra. `admin/layout.tsx` sigue llamando a `requireAdmin()` de forma
independiente (defensa en profundidad).

**3. Contenido mínimo de `/admin` y `/admin/mi-cuenta` en esta fase.**
La sección 14 asigna el resto del panel (Escritorio con resumen, Comisión
Directiva, Comisiones de trabajo, Textos de Inicio, Datos de contacto,
Usuarios) a la Fase 5, y Noticias a la Fase 4. Pero el flujo de autenticación
de la sección 9.1 exige que exista *algo* en `/admin` (destino del login) y
que `/admin/mi-cuenta` soporte cambiar la contraseña (paso obligatorio del
primer ingreso). Se implementaron versiones mínimas de ambas páginas —
saludo simple en Escritorio, y solo el formulario de "Cambiar contraseña" en
Mi cuenta (sin "Cambiar nombre", que se agrega en la Fase 5 junto con el
resto del panel)— y un menú lateral con únicamente esos dos ítems; los demás
se van agregando a `ITEMS_MENU` en `admin/layout.tsx` a medida que sus
páginas existan.

**4. Contraseña temporal legible en su propio archivo
(`src/lib/password-temporal.ts`).**
`scripts/crear-admin.ts` corre con `tsx` fuera del runtime de Next.js (es un
script de Node normal), así que no puede importar `src/lib/auth.ts`: ese
archivo importa `next/headers` y `next/navigation`, que solo funcionan
dentro de una request de Next. El generador de contraseña temporal
(`generarPasswordTemporal`, sección 8.8) no depende de nada de Next, así que
se separó a su propio archivo, usado tanto por el script CLI como por
`src/lib/auth.ts` (re-exportado desde ahí para no romper otros imports).

**5. `secure` de la cookie de sesión depende de `NODE_ENV`.**
La sección 9.2 pide `secure` en la cookie `acp_sesion`. En desarrollo local
(HTTP, sin TLS) una cookie `secure` no se guarda en el navegador, lo que
rompería el login en `localhost`. Se usa
`secure: process.env.NODE_ENV === "production"`, el patrón estándar de
Next.js/Vercel: en producción (HTTPS) queda igual que pide el SDD.

**6. Verificación real contra la base de Neon.**
Se probó el flujo completo en el navegador: `/admin` sin sesión redirige a
`/ingresar`; login con credenciales incorrectas muestra el error genérico;
se confirmó con una prueba directa sobre `estaBloqueado()`/`registrarIntento()`
que el 6.º intento fallido en 15 minutos queda bloqueado (la reproducción
manual en el navegador para llegar exactamente a 5 fallos previos resultó
poco confiable por limitaciones del entorno de automatización con la tecla
Tab, así que se confirmó también con una prueba directa contra la base,
además de los intentos manuales reales registrados); login correcto con
`debeCambiarPassword = true` redirige a `/admin/mi-cuenta?primer-ingreso=1` y
bloquea el resto del panel hasta cambiar la contraseña; el cambio de
contraseña funciona y libera el panel; "Cerrar sesión" borra el registro de
`Sesion` en la base (confirmado con una consulta directa: 0 sesiones después
del logout) y no solo la cookie. También se probaron `npm run admin:crear` y
`npm run admin:reset` contra la base real.

Como parte de esta prueba se cambió la contraseña real del usuario `admin`
sembrado por el seed. Se restableció con `npm run admin:reset -- --usuario
admin` para dejarlo en un estado limpio (contraseña temporal nueva,
`debeCambiarPassword = true`) — la contraseña temporal quedó únicamente en la
terminal de esa corrida, no se guardó en ningún archivo.
