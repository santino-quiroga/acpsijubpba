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

## Fase 4 — Noticias

**1. "Próximas actividades" / "Actividades realizadas" en vez del listado
único de la sección 7.6 original.**
Pedido explícito de la asociación durante esta fase: van a usar Noticias para
avisar actividades futuras ("el próximo 2 de octubre visitaremos...") y para
dejar registro de las ya hechas. Se resolvió sin tocar el modelo `Noticia` ni
reabrir la "agenda de eventos" que la sección 2.2 deja fuera de alcance:
`fechaPublicacion` >= hoy (hora Argentina) es "próxima"; antes de hoy es
"realizada". Ver sección 7.6 y 2.2 del SDD, ya actualizadas.

**2. Sin carruseles, aunque el pedido original los sugería.**
La sección 3.2 prohíbe carruseles automáticos por accesibilidad (el público
son personas +65; los carruseles son un problema conocido para navegación
por teclado, lectores de pantalla y timing de lectura). Se lo planteé
directamente a la asociación antes de implementar y acordamos grillas fijas
con paginación (mismo patrón que ya existía para el listado general de
Noticias) en vez de carrusel. Con eso alcanza para no acumular una lista
larga incómoda: cada sección muestra solo unas pocas tarjetas con un botón
"Ver todas".

**3. `/noticias/proximas` y `/noticias/realizadas` en vez de mantener
`/noticias` como el único listado paginado.**
Como `/noticias` ahora es una página de resumen (con las dos secciones), la
grilla completa paginada + filtro por comisión de la sección 7.6 original se
movió a estas dos rutas nuevas. Es la forma más simple de no perder esa
funcionalidad ya definida sin forzarla dentro de la página de resumen.

**4. Filtro por comisión usa `id`, no un `slug`.**
La sección 7.6 describe el filtro como `?comision=slug`, pero `ComisionTrabajo`
(sección 6) no tiene un campo `slug`. Se usa directamente su `id` (un cuid,
no legible) como valor del parámetro. Agregar un campo `slug` no pedido
habría sido una modificación de schema no solicitada; usar el `id` es la
opción más simple y ya deja el filtro funcionando.

**5. Bug real encontrado y corregido: la fecha se guardaba con un día de
menos.**
Al guardar `fechaPublicacion` con `new Date("2026-10-02")`, JavaScript lo
interpreta como medianoche UTC. Al mostrarlo con
`timeZone: "America/Argentina/Buenos_Aires"` (UTC-3), esa medianoche UTC cae
en el día anterior en hora argentina — la noticia del "2 de octubre" se
mostraba como "1 de octubre". Se agregó `crearFechaDesdeInputArgentina()` en
`src/lib/formato.ts`, que arma el instante UTC correspondiente al mediodía
argentino de la fecha elegida (nunca cruza el límite del día en ninguna
zona horaria razonable). Se corrigió `src/actions/noticias.ts`, `prisma/seed.ts`
y se actualizaron a mano las fechas ya guardadas en la base de Neon.

**6. Bug real encontrado y corregido: `<form>` anidado dentro de otro
`<form>`.**
`FormularioNoticia` tenía los botones "Despublicar" y "Eliminar" (cada uno su
propio `<form>`, porque llaman a una Server Action distinta a la del
formulario principal) dentro del `<form>` principal. Es HTML inválido — el
navegador corrige la anidación al parsear, lo que rompía el envío de esos
botones (no llegaba ningún POST al servidor) y además generaba un error de
hidratación en consola. Se solucionó sacando esos dos botones fuera del
`<form>` principal, como hermanos en el mismo contenedor visual. Confirmado
con una prueba real: antes del fix, "Despublicar" no cambiaba el estado en la
base; después del fix, sí (verificado con una consulta directa).

**7. Bug real encontrado y corregido: el botón "Eliminar" del modal de
confirmación salía verde en vez de rojo.**
`ConfirmacionEliminar` reusaba el componente `<Boton>` e intentaba pisar sus
clases de color (`bg-verde-900`) agregando `bg-error` en el `className`. En
Tailwind, dos clases de utilidad para la misma propiedad no se "pisan" según
el orden en que aparecen en el string de `className`, sino según el orden en
que Tailwind las generó en la hoja de estilos — por eso `bg-verde-900` seguía
ganando. Se cambió por un `<button>` propio con las clases rojas directas, sin
depender de `<Boton>` para este caso.

**8. Verificación de la sanitización de HTML.**
El editor Tiptap no puede producir un `<script>` a través de su interfaz (su
esquema de documento no tiene ese nodo), así que probar "meter un script
desde la UI" no prueba nada nuevo. Se probó directamente la función
`sanitizarContenidoNoticia()` con un payload que incluye `<script>`, atributos
`onclick`/`onerror`, un link `javascript:` y tags fuera de la whitelist
(`<h1>`, `<blockquote>`): todo se elimina o se limpia correctamente (los tags
no permitidos se sacan pero conservan su texto; los `<a>` conservan `href`
solo si es http/https/mailto, con `target="_blank" rel="noopener noreferrer"`
agregado automáticamente).

**9. Falta probar la subida de imágenes con Vercel Blob real.**
No se recibió un `BLOB_READ_WRITE_TOKEN` real en esta sesión. El código de
subida (`src/actions/blob.ts`, `CampoImagen.tsx`) está escrito según la
sección 8.3/9.5 (compresión cliente a ~500KB/1600px WebP, validación de MIME
y tamaño en el servidor, nombre de archivo aleatorio, borrado del Blob al
reemplazar o eliminar una noticia), y compila y tipa correctamente, pero no
se pudo ejercitar el flujo end-to-end de subida real. Falta esa prueba en
cuanto se tenga el token.

**10. Advertencia de consola pendiente para la Fase 6 (no bloquea esta
fase): "script tag" al navegar a un 404.**
El script anti-parpadeo del control de tipografía (`src/app/layout.tsx`, ver
Fase 2) es un `<script>` literal en el JSX del layout raíz. Al navegar a una
ruta que no existe, Next remonta esa parte del árbol en el cliente, y React
avisa que un `<script>` dentro de un componente no se ejecuta en un
re-render de cliente. No rompe nada (el script ya corrió una vez en la carga
inicial) y es un warning de desarrollo, no un error de build. Se revisa junto
con el `not-found.tsx` propio de la sección 7.9 en la Fase 6.

## Fase 5 — Resto del panel

**1. Toasts vía parámetro de URL (`?aviso=...&tipo=exito|error`).**
La sección 8.1 pide notificaciones tipo toast que duren al menos 6 segundos
y se puedan cerrar. Como casi todas las acciones de esta fase terminan en un
`redirect()` desde el servidor (una navegación real, no una actualización en
el mismo render), no hay forma directa de "pasarle" un mensaje al componente
cliente que va a mostrar el toast. La solución más simple: las Server Actions
redirigen a `conAviso(ruta, "mensaje", "exito" | "error")`
(`src/lib/aviso.ts`), que agrega esos dos parámetros a la URL; un componente
`<Toaster />` en `admin/layout.tsx` los lee al montar, muestra el toast,
limpia la URL con `router.replace` (para que no reaparezca al recargar o
volver atrás) y se cierra solo a los 6,5 segundos o con el botón de cerrar.

**2. Normalización de WhatsApp: cubre los casos más comunes, no todos.**
`src/lib/whatsapp.ts` (`normalizarWhatsapp`) saca el "0" de larga distancia,
el "54" y el "9" si ya están, y un "15" si aparece justo al principio. No
detecta un "15" que aparezca después del código de área sin un "0" inicial
(ej. "0221 15-123-4567"): separar eso a mano requeriría una tabla de códigos
de área argentinos, que no está pedida y sería una complejidad nueva no
solicitada. Se probó a mano con ese caso exactamente y confirmó el límite: el
enlace generado queda mal armado. Por eso el campo siempre muestra el link
"Probar enlace" ya armado (sección 8.7): la asociación puede notar si el
enlace no abre el chat correcto y volver a escribir el número de otra forma
(por ejemplo, sin el "15", que alcanza para el formato de WhatsApp). Con
entradas simples ("221 123-4567") o ya en formato internacional
("+54 9 221 123-4567") el resultado es correcto — ambos casos se probaron
contra la base real.

**3. Botón "Eliminar período" agregado (no está en la lista de la sección
8.4, pero la regla de negocio de la sección 6 lo implica).**
"No se puede eliminar el período vigente" no tiene sentido si no hay ninguna
forma de eliminar un período. Se agregó el botón, habilitado solo cuando el
período que se está viendo no es el vigente (y se probó: intentar eliminar
el vigente está bloqueado por la Server Action, aparte de que el botón ni se
muestra).

**4. Al copiar miembros a un período nuevo, no se copia la foto.**
Si dos `MiembroComision` compartieran la misma `fotoUrl` (por copiar el
período con sus fotos), eliminar uno de los dos borraría el archivo de Blob
del otro también, porque `eliminarMiembro` borra el archivo al borrar el
registro. La opción más simple y segura: la copia no incluye `fotoUrl`
(queda `null`), así cada miembro tiene como máximo una foto propia y
borrarla nunca afecta a otro. Se probó: crear un período nuevo copiando
miembros del vigente, reordenar y eliminarlo (con sus 16 miembros, cascada
por `onDelete: Cascade` del schema) sin tocar los miembros del período
original.

**5. `CampoFoto` (miembros) es más simple que `CampoImagen` (noticias).**
La foto de un miembro es opcional y no tiene requisito de texto alternativo
(esa regla es específica de las noticias, sección 8.3). Se creó un
componente separado en vez de generalizar `CampoImagen` con props opcionales,
para no complicar ese componente con casos que no le corresponden. Ambos
reusan las mismas Server Actions de subida/borrado a Vercel Blob
(`src/actions/blob.ts`).

**6. Sigue sin probarse la subida real de fotos/imágenes.**
No se recibió un `BLOB_READ_WRITE_TOKEN` real en ninguna fase. Todo lo demás
de Comisión Directiva, Comisiones de trabajo, Usuarios, Textos de Inicio y
Datos de contacto se probó de punta a punta contra la base de Neon real
(crear, editar, reordenar, marcar vigente, eliminar con sus reglas de
negocio, protección del último administrador activo, revalidación del sitio
público sin redeploy).

## Fase 6 — Pulido

**1. Favicon, apple-icon y og-default se generan con código (`next/og`),
no se agregó ninguna librería nueva.**
La sección 10.3 pide favicon 32/180/512 y una imagen `og-default.png` de
1200×630. Generar esos tamaños a partir de `docs/logo.png` (1254×1254)
normalmente requeriría una librería de procesamiento de imágenes (sharp,
jimp, etc.), pero el stack de la sección 4 no la incluye y no se pidió
autorización para sumarla. La alternativa sin dependencias nuevas: usar la
convención de archivos de Next.js (`src/app/icon.tsx`, `apple-icon.tsx`,
`opengraph-image.tsx`) con la API `ImageResponse` de `next/og`, que ya viene
incluida con Next 16 (`node_modules/next/og.js`). Cada archivo lee
`public/logo.png` una sola vez (a nivel de módulo, vía `src/lib/logo.ts`) y
lo dibuja centrado sobre un `<div>` del tamaño pedido. `icon.tsx` usa
`generateImageMetadata` para servir 32 y 512 desde el mismo archivo;
`apple-icon.tsx` sirve 180 con fondo `crema` sólido (iOS no respeta
transparencia); `opengraph-image.tsx` sirve 1200×630 con el logo y el nombre
completo de la asociación en `verde-900`. Se verificaron las tres rutas
levantando `next dev` y pidiendo `/icon?<params>`, `/apple-icon` y
`/opengraph-image` directamente.

**2. `public/logo.svg`: no se vectorizó, se documenta el uso del PNG
(permitido explícitamente por la sección 10.3).**
La sección 10.3 permite usar el PNG optimizado si la vectorización no queda
limpia, dejándolo registrado acá. No se instaló `potrace` (tampoco está en
la sección 4 y hubiera requerido autorización) y, aunque se hubiera
instalado, un trazado automático de este logo en particular —un emblema con
varios colores y texto curvo— tiende a perder legibilidad del texto y a
generar formas con artefactos, quedando peor que el PNG. Se sigue usando
`public/logo.png` en todo el sitio (ya servido con `next/image`, que en
Vercel lo optimiza y convierte a WebP en tiempo de request sin necesidad de
`sharp` local). No se creó ningún archivo `.svg`.

**3. `not-found.tsx` duplicado a propósito: uno dentro de `(publico)`, otro
en la raíz.**
El `notFound()` que ya usa `/noticias/[slug]` (para una noticia inexistente
o despublicada) se resuelve con el `not-found.tsx` más cercano en el árbol
ya renderizado — dentro de `(publico)`, así que sale con `Header`/`Footer`
del layout del grupo de rutas. Pero una URL que no coincide con ningún
segmento (ej. `/loquesea`) no llega a renderizar ese layout, y usa el
`not-found.tsx` de la raíz en su lugar — que no tiene `Header`/`Footer`
porque el layout raíz solo define `<html>/<body>`. Para que ese caso
también se vea igual de "amable" y con los mismos dos links (Inicio y
Noticias, sección 7.9), el de la raíz importa `Header` y `Footer`
directamente en vez de depender del layout. Se probó pidiendo una noticia
con slug inexistente y una ruta cualquiera fuera de cualquier segmento
conocido: ambas muestran el mensaje y los dos botones: una con
`Header`/`Footer` vía el layout, la otra agregándolos a mano — mismo
resultado visual.

**4. CSP básico con `'unsafe-inline'` en `script-src` y `style-src`.**
La sección 9.5 pide "un CSP básico que permita Vercel Blob", sin pedir un
CSP estricto con nonces. Hay dos motivos concretos para permitir inline en
este sitio, no una elección por comodidad: (a) `layout.tsx` inyecta un
`<script>` inline (anti-FOUC del control de escala de texto A−/A+) y otro
con el JSON-LD `Organization`, y `DetalleNoticia.tsx` inyecta el JSON-LD
`NewsArticle`; (b) `next/font` (Lora, Atkinson Hyperlegible) inserta
`@font-face` en un `<style>` inline para los self-hosted fonts, y bloquear
eso degradaría justamente la tipografía elegida por legibilidad para el
público de 65+ (sección 3.2). Implementar nonces habría significado tocar
el render de cada página que usa estos scripts/estilos, una complejidad no
pedida por la sección 9.5. El resto del CSP es estricto: `default-src
'self'`, `img-src` solo el propio dominio y el hostname de Vercel Blob,
`frame-ancestors 'none'` (refuerza el `X-Frame-Options: DENY` de al lado) y
sin ningún dominio de terceros. Se probó con `next build && next start` y
se confirmó con las DevTools que el header `Content-Security-Policy` llega
en la respuesta y que el sitio (Inicio, Noticias, panel) funciona sin
errores de CSP en la consola.

*Ajuste posterior*: el header solo se manda cuando `NODE_ENV === "production"`
(`next.config.ts`). En `npm run dev`, Turbopack/React usan `eval()` para el
hot reload y el overlay de errores, que un CSP sin `'unsafe-eval'` bloquea y
rompe la app en desarrollo (se vio al probar el login en dev). No tiene
sentido relajar el CSP real de producción para eso, así que en dev
directamente no se envía el header.

**5. JSON-LD `Organization` con datos fijos, no leídos de la base.**
La sección 12 pide JSON-LD `Organization` en el layout. `DatosContacto`
(WhatsApp, teléfono, dirección, redes) se edita desde el panel y es
específico de la página de Contacto; agregar una consulta a la base de
datos en el layout raíz —que envuelve también todo `/admin`— para leer esos
datos solo para el JSON-LD es una complejidad nueva no pedida y agrega una
consulta a cada request del panel sin necesidad. El `Organization` del
layout usa solo nombre, nombre alternativo, URL, logo y descripción — datos
fijos que no cambian desde el panel. El JSON-LD `NewsArticle` de
`DetalleNoticia.tsx`, en cambio, sí usa datos de la noticia (ya los tiene
cargados para renderizar la página).

**6. Sigue sin probarse la subida real de fotos/imágenes (arrastrado de
fases anteriores).**
Sigue sin recibirse un `BLOB_READ_WRITE_TOKEN` real. No es un pendiente
nuevo de esta fase, se repite acá para que quede visible en el resumen
final: es la única funcionalidad del SDD que no se pudo probar de punta a
punta contra un entorno real.

## Ajustes posteriores a la Fase 6

**1. La asociación pidió sacar las fotos de los miembros de la Comisión
Directiva: solo listado de nombres con avatar de iniciales.**
Resuelve el pendiente #4 de la sección 15. Se sacó por completo la carga de
fotos: el campo `fotoUrl` del modelo `MiembroComision` (con su migración,
`20260924003220_quitar_foto_miembro`), el componente `CampoFoto.tsx`, el
manejo de subida/borrado en Blob de `src/actions/comision-directiva.ts` y el
branch de imagen en `AvatarIniciales.tsx` (ahora siempre muestra las
iniciales). Se consultó a la asociación (a través del usuario) si quería
sacar también el círculo de iniciales y dejar una lista de texto plano, o
mantenerlo — se mantuvo el círculo de iniciales, ya que no es una foto sino
solo las iniciales sobre un color de fondo. Se confirmó que ningún miembro
tenía `fotoUrl` cargado en la base real antes de aplicar la migración (no
había ningún dato que se fuera a perder). Probado de punta a punta contra
Neon: se editó un miembro real (Presidenta) desde el panel sin el campo de
foto, se guardó correctamente, y la vista pública se ve con los círculos de
iniciales en vez de fotos.

**2. Bug de sesión encontrado y arreglado (no pedido, pero bloqueaba probar
el login): `obtenerUsuarioActual()` intentaba borrar la cookie de sesión
inválida desde el render de una página.**
Next.js no permite modificar cookies fuera de una Server Action o Route
Handler. `obtenerUsuarioActual()` se llama también desde `admin/layout.tsx`
y `ingresar/page.tsx` (renders de Server Components, no Server Actions), así
que cualquier usuario con una cookie de sesión vencida, borrada o de un
usuario desactivado terminaba viendo una pantalla de error de servidor en
vez de la pantalla de login — se reprodujo justo así al probar el login
después de correr `admin:reset` (que invalida las sesiones existentes en la
base, dejando la cookie del navegador "colgada"). Se sacó el borrado de
cookie de esa función (`src/lib/auth.ts`): ya no hace falta, porque la
sesión sigue siendo inválida en la base en cada request siguiente igual, y
la cookie se termina reemplazando sola en el próximo login exitoso. El
borrado explícito en `cerrarSesion()` (que sí es una Server Action) no se
tocó. Probado: login completo funcionando de nuevo después del fix.

**3. Deploy a Vercel rompía el build: `new URL(NEXT_PUBLIC_SITE_URL)` en
`metadataBase` (layout.tsx) tira una excepción si esa variable no es una
URL absoluta válida.**
Los dos primeros deploys a Vercel fallaron con `TypeError: Invalid URL` en
`layout.tsx:20`, adentro de `Failed to collect configuration for
/_not-found`. Como el dominio real todavía está `[PENDIENTE]` (sección 13),
`NEXT_PUBLIC_SITE_URL` en Vercel quedó vacía o sin el prefijo `https://` —
cualquiera de los dos casos hace que `new URL(...)` explote, y como
`metadataBase` se evalúa a nivel de módulo del layout raíz, tumba el build
entero (no solo esa página). Se centralizó la lectura de esta variable en
`obtenerUrlSitio()` (`src/lib/site-url.ts`), usada ahora en `layout.tsx`,
`sitemap.ts`, `robots.ts` y `DetalleNoticia.tsx`: valida con `new URL()`
adentro de un `try/catch` y cae al valor por defecto
(`http://localhost:3000`) ante cualquier valor vacío o inválido, en vez de
romper el build. Se reprodujo el error exacto en local
(`NEXT_PUBLIC_SITE_URL="" npm run build` y también sin el `https://`) y se
confirmó que con el fix el build termina bien en ambos casos. Sigue
haciendo falta que, una vez resuelto el dominio real, se cargue
correctamente en Vercel (con `https://` y sin barra final) para que el
sitemap, el `robots.txt` y los links de "Compartir por WhatsApp"/"Copiar
enlace" apunten a la URL pública real en vez de `localhost`.
