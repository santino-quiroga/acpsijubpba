# SDD — Sitio Web Institucional ACPSIJUPBA

**Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires**
Versión: 1.0 · Fecha: 15/09/2026 · Destinatario: Claude Code

---

## 0. Instrucciones para Claude Code

- Este documento es la fuente de verdad del proyecto. Si algo no está definido acá, elegir la opción **más simple** y dejarla anotada en `docs/DECISIONES.md`.
- Material del cliente disponible en `/docs`:
  - `logo.png` → logo oficial (versión redibujada, usar esta).
  - `HISTORIA_ACPSIJUPBA.md` → texto de la página Historia.
  - `OBJETIVOS.md` → texto de la página Objetivos.
  - `PRESENTACION_DE_APCPSIJUPBA.md` → texto base para Inicio.
  - `COMISION_DIRECTIVA_ACPSIJUPBA_2025-1.md` → datos del seed de la comisión directiva.
  - `Requisitos_para_asociarse.md` → requisitos para asociarse, incorporados al bloque "¿Querés asociarte?" de Inicio (secciones 7.2 y 11).
- Todo el contenido visible del sitio y del panel va **en español (Argentina)**.
- Trabajar por fases (sección 14). Al terminar cada fase: `npm run lint`, `npm run build` y verificación de los criterios de aceptación.
- Los ítems marcados como **[PENDIENTE]** (sección 15) se implementan con el valor por defecto indicado y se dejan fáciles de cambiar.

---

## 1. Resumen

Sitio institucional público con 6 secciones (Inicio, Historia, Objetivos, Comisión Directiva, Noticias, Contacto) y un **panel de administración integrado** con acceso por usuario y contraseña. Desde el panel, la asociación gestiona:

1. Noticias (crear, editar, publicar/despublicar, eliminar).
2. Comisión directiva (por período).
3. Comisiones de trabajo (Cultura, Turismo, etc.).
4. Textos de la página de Inicio.
5. Datos de contacto.
6. Usuarios administradores.

Existe un único rol: **administrador**.

---

## 2. Alcance

### 2.1 Incluido (v1)
- Sitio público responsive y accesible.
- Panel admin con CRUD de las entidades listadas en la sección 1.
- Subida de imágenes con compresión automática.
- SEO básico, Open Graph y botón para compartir noticias por WhatsApp.
- Script de seed con el contenido inicial.

### 2.2 Fuera de alcance (v2 o posterior)
- Formulario de contacto o de asociación (Contacto muestra **solo datos**).
- Agenda de actividades o eventos.
- Galería de fotos.
- Área privada para socios.
- Newsletter.
- Envío de emails (incluida la recuperación de contraseña por mail; ver 9.4).
- Edición de Historia y Objetivos desde el panel (quedan como contenido estático en código).

---

## 3. Usuarios y principios de diseño

### 3.1 Perfiles
| Perfil | Descripción | Necesidad principal |
|---|---|---|
| Visitante | Psicólogos jubilados/pensionados (mayormente +65), colegas y público general | Leer con comodidad y encontrar contacto y novedades |
| Administrador | Miembros de la comisión directiva (+65), uso ocasional | Publicar una noticia sin ayuda técnica |

### 3.2 Principios obligatorios
**Accesibilidad (WCAG 2.1 AA como mínimo)**
- Tamaño de texto base de 18px (móvil) y 20px (desktop); interlineado ≥ 1.6.
- Contraste ≥ 4.5:1 en texto y ≥ 3:1 en elementos de interfaz.
- Áreas clicables de al menos 44×44px.
- Foco visible en todos los elementos interactivos y navegación completa por teclado.
- Control **"A− / A+"** en el header, que escala la tipografía (3 niveles) y guarda la preferencia en `localStorage`.
- Sin carruseles automáticos, sin animaciones decorativas y con respeto de `prefers-reduced-motion`.
- Links con texto descriptivo ("Leer noticia completa", no "Click aquí").
- Imágenes con `alt` obligatorio (el panel lo exige al subir).
- Solo modo claro.

**Simplicidad en el panel**
- Una tarea por pantalla, con botones de texto explícito ("Guardar noticia", "Publicar").
- Mensajes de confirmación y error en lenguaje llano, sin jerga técnica.
- Confirmación (modal) antes de cualquier eliminación.
- Aviso de cambios sin guardar al intentar salir de un formulario.
- Botón "Ver cómo queda" (vista previa) en noticias.

---

## 4. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router, versión estable actual) + TypeScript (strict) |
| Estilos | Tailwind CSS |
| Componentes | Propios (se puede usar shadcn/ui como base, adaptado a los tamaños de 3.2) |
| Base de datos | PostgreSQL (Neon, vía Vercel Marketplace) |
| ORM | Prisma |
| Autenticación | Propia: `bcryptjs` + sesiones en base de datos + cookie httpOnly |
| Validación | Zod (compartido entre cliente y servidor) |
| Editor de texto | Tiptap (extensiones limitadas, ver 8.3) |
| Sanitización de HTML | `sanitize-html` (al guardar) |
| Imágenes | Vercel Blob + compresión en el cliente con `browser-image-compression` |
| Tipografía | Atkinson Hyperlegible (cuerpo) + Lora (títulos) vía `next/font` |
| Iconos | lucide-react |
| Hosting | Vercel |

**Notas**
- Las mutaciones se hacen con **Server Actions**; no se crea una API REST pública.
- Las páginas públicas son estáticas (SSG) y se revalidan con `revalidatePath` después de cada cambio en el panel.
- Antes del deploy a producción, revisar las condiciones vigentes del plan de Vercel y de Neon (uso comercial, límites y pausa por inactividad). Las cuentas deben quedar a nombre de la asociación.

---

## 5. Arquitectura y estructura del proyecto

```
/
├─ docs/                      # material del cliente + DECISIONES.md
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/
│  ├─ logo.svg                # vectorizado desde docs/logo.png (ver 10.3)
│  ├─ logo.png
│  └─ og-default.png
├─ scripts/
│  └─ crear-admin.ts          # alta/reset de administradores por CLI
├─ src/
│  ├─ app/
│  │  ├─ (publico)/
│  │  │  ├─ layout.tsx        # Header + Footer
│  │  │  ├─ page.tsx          # Inicio
│  │  │  ├─ historia/page.tsx
│  │  │  ├─ objetivos/page.tsx
│  │  │  ├─ comision-directiva/page.tsx
│  │  │  ├─ noticias/page.tsx
│  │  │  ├─ noticias/[slug]/page.tsx
│  │  │  └─ contacto/page.tsx
│  │  ├─ ingresar/page.tsx    # login
│  │  ├─ admin/
│  │  │  ├─ layout.tsx        # verifica sesión + navegación del panel
│  │  │  ├─ page.tsx          # escritorio
│  │  │  ├─ noticias/...
│  │  │  ├─ comision-directiva/...
│  │  │  ├─ comisiones/...
│  │  │  ├─ inicio/page.tsx
│  │  │  ├─ contacto/page.tsx
│  │  │  ├─ usuarios/...
│  │  │  └─ mi-cuenta/page.tsx
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ publico/
│  │  ├─ admin/
│  │  └─ ui/
│  ├─ content/                # textos estáticos (historia.ts, objetivos.ts)
│  ├─ lib/
│  │  ├─ db.ts                # cliente Prisma singleton
│  │  ├─ auth.ts              # sesiones, hash, requireAdmin()
│  │  ├─ rate-limit.ts
│  │  ├─ sanitize.ts
│  │  ├─ slug.ts
│  │  └─ validations/         # esquemas Zod
│  └─ actions/                # server actions por entidad
└─ middleware.ts              # (o proxy.ts, según la versión de Next.js) protege /admin
```

**Regla de seguridad:** cada Server Action del panel llama a `requireAdmin()` al inicio, **además** del middleware. Nunca se confía solo en el middleware.

---

## 6. Modelo de datos (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}

// ---------- Autenticación ----------
model Usuario {
  id                   String    @id @default(cuid())
  nombre               String
  usuario              String    @unique        // nombre de usuario para login (minúsculas)
  passwordHash         String
  activo               Boolean   @default(true)
  debeCambiarPassword  Boolean   @default(true)
  ultimoAcceso         DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  sesiones             Sesion[]
  noticias             Noticia[]
}

model Sesion {
  id         String   @id              // hash SHA-256 del token (el token plano vive solo en la cookie)
  usuarioId  String
  usuario    Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  @@index([usuarioId])
}

model IntentoLogin {
  id            String   @id @default(cuid())
  identificador String   // `${usuario}|${ip}`
  exitoso       Boolean
  createdAt     DateTime @default(now())
  @@index([identificador, createdAt])
}

// ---------- Noticias ----------
enum EstadoNoticia {
  BORRADOR
  PUBLICADA
}

model Noticia {
  id                String         @id @default(cuid())
  titulo            String         @db.VarChar(150)
  slug              String         @unique
  resumen           String         @db.VarChar(250)
  contenidoHtml     String         @db.Text      // sanitizado al guardar
  imagenUrl         String?
  imagenAlt         String?        @db.VarChar(200)
  estado            EstadoNoticia  @default(BORRADOR)
  fechaPublicacion  DateTime?      // se completa al publicar; editable
  comisionId        String?        // categoría opcional
  comision          ComisionTrabajo? @relation(fields: [comisionId], references: [id], onDelete: SetNull)
  autorId           String?
  autor             Usuario?       @relation(fields: [autorId], references: [id], onDelete: SetNull)
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  @@index([estado, fechaPublicacion])
}

// ---------- Comisión Directiva ----------
model PeriodoComision {
  id        String   @id @default(cuid())
  nombre    String   // ej. "2025–2027"
  vigente   Boolean  @default(false)   // solo uno vigente (garantizado por transacción)
  createdAt DateTime @default(now())
  miembros  MiembroComision[]
}

enum GrupoComision {
  MESA_DIRECTIVA
  VOCAL_TITULAR
  VOCAL_SUPLENTE
  REVISORA_TITULAR
  REVISORA_SUPLENTE
}

enum TituloProfesional {
  PSIC
  LIC
  DR
  NINGUNO
}

model MiembroComision {
  id         String            @id @default(cuid())
  periodoId  String
  periodo    PeriodoComision   @relation(fields: [periodoId], references: [id], onDelete: Cascade)
  grupo      GrupoComision
  cargo      String?           // solo para MESA_DIRECTIVA: "Presidenta", "Secretaria", etc.
  titulo     TituloProfesional @default(PSIC)
  nombre     String
  apellido   String
  fotoUrl    String?
  orden      Int               @default(0)
  @@index([periodoId, grupo, orden])
}

// ---------- Comisiones de trabajo ----------
model ComisionTrabajo {
  id          String    @id @default(cuid())
  nombre      String    @db.VarChar(80)
  descripcion String    @db.VarChar(400)
  icono       String    @default("users")  // nombre de icono lucide de una lista cerrada
  orden       Int       @default(0)
  activa      Boolean   @default(true)
  noticias    Noticia[]
}

// ---------- Contenido editable (singletons, id = 1) ----------
model ContenidoInicio {
  id                  Int     @id @default(1)
  heroTitulo          String  @db.VarChar(120)
  heroSubtitulo       String  @db.VarChar(250)
  bienvenidaTitulo    String  @db.VarChar(120)
  bienvenidaTexto     String  @db.Text     // HTML sanitizado (mismo editor que noticias)
  asociarseTitulo     String  @db.VarChar(120)
  asociarseTexto      String  @db.Text     // HTML sanitizado
  updatedAt           DateTime @updatedAt
}

model DatosContacto {
  id                 Int      @id @default(1)
  email              String
  whatsapp           String?  // formato internacional sin símbolos: 5492211234567
  whatsappMostrar    String?  // formato legible: "221 123-4567"
  telefono           String?
  direccion          String?
  horarios           String?
  filialNombre       String?  @default("Filial Mar del Plata")
  filialDireccion    String?
  filialEmail        String?
  filialTelefono     String?
  facebookUrl        String?
  instagramUrl       String?
  updatedAt          DateTime @updatedAt
}
```

**Reglas de negocio**
- `slug` se genera a partir del título (minúsculas, sin tildes, guiones). Si ya existe, se le agrega el sufijo `-2`, `-3`, etc. **No cambia** al editar el título de una noticia publicada, para no romper links compartidos.
- Solo un `PeriodoComision` puede estar vigente: al marcar uno, en la misma transacción se desmarcan los demás.
- No se puede desactivar ni eliminar al último administrador activo, ni un usuario puede eliminarse a sí mismo.
- Al eliminar una comisión de trabajo, sus noticias quedan sin categoría (`SetNull`).
- Al eliminar una noticia o un miembro con imagen, se borra también el archivo en Vercel Blob.

---

## 7. Sitio público

### 7.1 Layout común
**Header (sticky)**
- Logo + "ACPSIJUPBA" y, debajo en desktop, el nombre completo en tipografía chica.
- Menú: Inicio · Historia · Objetivos · Comisión Directiva · Noticias · Contacto. El ítem activo se marca con subrayado y color, no solo con color.
- Control A− / A+.
- En móvil: botón "Menú" (con texto, no solo el ícono hamburguesa) que abre un panel a pantalla completa con links grandes.

**Footer**
- Logo, nombre completo y email.
- Links rápidos a las secciones.
- "Acceso administración" → `/ingresar` (link discreto, pero visible y accesible).
- © año actual ACPSIJUPBA.

### 7.2 Inicio `/`
Secciones en este orden:
1. **Hero:** `heroTitulo` + `heroSubtitulo` (editables), logo grande y botones "Conocé nuestra historia" y "Contactanos".
2. **Bienvenida:** `bienvenidaTitulo` + `bienvenidaTexto` (editables; el seed toma el texto de la presentación).
3. **Nuestras comisiones de trabajo:** tarjetas de las `ComisionTrabajo` activas, ordenadas por `orden` (ícono, nombre y descripción).
4. **Últimas noticias:** las 3 más recientes publicadas y el botón "Ver todas las noticias". Si no hay ninguna, la sección no se muestra.
5. **¿Querés asociarte?:** `asociarseTitulo` + `asociarseTexto` (editables), con botones a email y WhatsApp tomados de `DatosContacto`.

### 7.3 Historia `/historia`
- Contenido estático en `src/content/historia.ts`, transcripto de `docs/HISTORIA_ACPSIJUPBA.pdf` **con las correcciones ortográficas y de redacción abajo aplicadas**.
- Estructura sugerida:
  - Intro.
  - Línea de tiempo visual (vertical, simple) con hitos: 2013 (inicio del grupo), 2014 (camino como asociación), 25/04/2015 (Asamblea Constitutiva), 05/2017 (Personería Jurídica), 2020–2021 (pandemia y actividades virtuales), actualidad.
  - "Algunos de nuestros logros" (lista).
  - Cierre con invitación a asociarse.
- Normalizar la tipografía del original (el PDF usa negrita y espaciado; en la web va texto normal).

**Correcciones a aplicar al transcribir (Historia):**
- "2.013" → "2013"; "2.014" → "2014" (el punto de miles no corresponde en años).
- "etareo" → "etario".
- "Exposiciones. Talleres. Conferencias. Turismo.etc" → "Exposiciones, talleres, conferencias, turismo, etc." (puntuación y minúsculas).
- "Culturales tales como" → "culturales, tales como" (falta la coma).
- Uniformar el uso de mayúsculas: dejar en minúscula las que no correspondan a nombres propios o inicio de oración (ej. "Nuestros colegas" → "nuestros colegas", salvo cuando el original ya esté bien: "La Caja de Psicólogos" y "Personería Jurídica" son nombres propios y se mantienen en mayúscula).
- Revisar espacios dobles y saltos de línea a mitad de palabra que dejó la extracción del PDF (ej. "Jurídicas de la Pcia." quedó partido en el original) y unificar en párrafos normales.
- Título final "COMISION DIRECTIVA DE ACPSIJUPBA" → no se transcribe como texto (queda representado por la sección Comisión Directiva del sitio).

### 7.4 Objetivos `/objetivos`
- Estático en `src/content/objetivos.ts`, transcripto de `docs/OBJETIVOS.pdf` **con las correcciones ortográficas y de redacción abajo aplicadas**.
- Objetivo general destacado en un bloque con fondo verde claro.
- Objetivos específicos a) a g) como tarjetas o lista numerada con letra.

**Correcciones a aplicar al transcribir (Objetivos):**
- "Ley de L a Caja de Seguridad" → "Ley de la Caja de Seguridad" (error de tipeo).
- "propiciar iniciativa tendientes" → "propiciar iniciativas tendientes" (concordancia singular/plural).
- Formato de los ítems: "-a)", "-b)"... → "a)", "b)"... (sin guion inicial).

### 7.5 Comisión Directiva `/comision-directiva`
- Título: "Comisión Directiva" + período vigente (ej. "Período 2025–2027").
- Bloques por grupo, en este orden:
  1. Mesa Directiva: tarjetas con cargo destacado, título + nombre y foto (o avatar con iniciales si no hay foto).
  2. Vocales Titulares.
  3. Vocales Suplentes.
  4. Comisión Revisora de Cuentas, en dos sub-bloques: Titulares y Suplentes.
- Formato de nombre: `Psic. María Angela Odera` (apellido en capitalización normal; opcionalmente en versalitas con CSS).
- Si no hay período vigente, mostrar "Información próximamente disponible".

### 7.6 Noticias `/noticias`
- Grilla de tarjetas (1 columna en móvil, 2 en tablet y 3 en desktop): imagen, fecha ("15 de septiembre de 2026"), categoría (si tiene), título, resumen y "Leer noticia completa".
- Paginación de 9 por página con `?pagina=N`, usando botones grandes "Anteriores" / "Más recientes" y el número de página.
- Filtro opcional por comisión (`?comision=slug`) con chips simples.
- Solo se listan las noticias con `estado = PUBLICADA`, ordenadas por `fechaPublicacion` descendente.

### 7.7 Detalle de noticia `/noticias/[slug]`
- Título, fecha, categoría, imagen de portada y contenido.
- Botones "Compartir por WhatsApp" (`https://wa.me/?text=` + título + URL) y "Copiar enlace".
- Link "← Volver a noticias".
- Metadatos Open Graph (título, resumen e imagen).
- Un borrador responde 404 públicamente; los admins lo ven solo desde la vista previa del panel.

### 7.8 Contacto `/contacto`
Solo muestra datos, **sin formulario**.
- Tarjetas grandes con acción directa:
  - Email (`mailto:`), botón "Enviar un email".
  - WhatsApp (`wa.me`), botón "Escribir por WhatsApp".
  - Teléfono (`tel:`), si existe.
  - Dirección y horarios, si existen.
- Bloque "Filial Mar del Plata" con sus datos (se oculta si no tiene ningún dato cargado).
- Redes sociales, si existen.
- Cualquier campo vacío no se muestra.

### 7.9 Otros
- `not-found.tsx` amable, con links a Inicio y Noticias.
- `sitemap.ts` con las páginas estáticas y las noticias publicadas.
- `robots.ts`: bloquear `/admin` e `/ingresar`.

---

## 8. Panel de administración

### 8.1 Layout
- Barra superior: logo + "Panel de administración", el nombre del usuario, "Ver sitio" (en pestaña nueva) y "Cerrar sesión".
- Menú lateral en desktop y superior desplegable en móvil:
  - Escritorio
  - Noticias
  - Comisión Directiva
  - Comisiones de trabajo
  - Textos de Inicio
  - Datos de contacto
  - Usuarios
  - Mi cuenta
- Mismos tamaños tipográficos que el sitio público.
- Notificaciones tipo toast que duran al menos 6 segundos y se pueden cerrar.

### 8.2 Escritorio `/admin`
- Saludo ("Hola, {nombre}").
- Tres accesos grandes: **"Publicar una noticia"**, "Editar comisión directiva" y "Editar datos de contacto".
- Resumen: cantidad de noticias publicadas y de borradores, y fecha de la última publicación.

### 8.3 Noticias
**Listado `/admin/noticias`**
- Tabla en desktop y tarjetas en móvil, con: título, estado (badge "Publicada" / "Borrador"), fecha y acciones (Editar, Ver, Eliminar).
- Botón principal "+ Nueva noticia".
- Buscador por título y filtro por estado.

**Formulario `/admin/noticias/nueva` y `/admin/noticias/[id]`**
| Campo | Reglas |
|---|---|
| Título | Obligatorio, 5–150 caracteres |
| Resumen | Obligatorio, 20–250 caracteres, con contador visible |
| Imagen de portada | Opcional. JPG/PNG/WEBP. Se comprime en el cliente (máx. 1600px de ancho, ~500KB, WebP) antes de subir |
| Descripción de la imagen (alt) | **Obligatoria si hay imagen**. Ayuda: "Describí brevemente qué se ve en la foto" |
| Contenido | Obligatorio. Editor Tiptap con barra: Subtítulo (H2), Negrita, Cursiva, Lista con viñetas, Lista numerada, Enlace, Deshacer/Rehacer. Botones con ícono **y** texto |
| Comisión (categoría) | Opcional, selector |
| Fecha de publicación | Por defecto la fecha de hoy; editable |

- Acciones: "Guardar borrador", "Publicar" (o "Guardar cambios" si ya está publicada), "Despublicar", "Vista previa" y "Eliminar".
- La vista previa abre `/admin/noticias/[id]/vista-previa`, que usa el mismo componente que la página pública, con un aviso "Vista previa — no publicada".
- El HTML se sanitiza en el servidor con una whitelist: `p, h2, strong, em, ul, ol, li, a[href|target|rel], br`. Los links externos llevan `rel="noopener noreferrer" target="_blank"`.
- Al guardar se revalidan `/`, `/noticias`, `/noticias/[slug]` y `sitemap.xml`.

### 8.4 Comisión Directiva `/admin/comision-directiva`
- Selector de período (el vigente, preseleccionado) y botones "Nuevo período" y "Marcar como vigente".
- "Nuevo período" pide el nombre y ofrece **copiar los miembros del período actual** como punto de partida.
- Miembros agrupados igual que en la vista pública. En cada grupo:
  - Lista con título, nombre, apellido, cargo (solo en la mesa directiva) y foto.
  - Botones "Subir" / "Bajar" para ordenar (sin drag & drop).
  - Editar y Eliminar.
  - "+ Agregar miembro a este grupo".
- Formulario de miembro: grupo, cargo (texto libre con sugerencias: Presidenta/e, Vicepresidenta/e, Secretaria/o, Prosecretaria/o, Tesorera/o, Protesorera/o), título, nombre, apellido y foto opcional.
- No se puede eliminar el período vigente.

### 8.5 Comisiones de trabajo `/admin/comisiones`
- Lista con nombre, estado activa/inactiva, orden (Subir/Bajar), Editar y Eliminar.
- Formulario:
  - Nombre.
  - Descripción (máx. 400 caracteres).
  - Ícono, elegido de una grilla visual cerrada de unos 12 íconos lucide: `palette`, `plane`, `scale`, `book-open`, `heart-pulse`, `users`, `megaphone`, `landmark`, `calendar`, `music`, `camera`, `sprout`.
  - Activa (sí/no).
- Eliminar una comisión que tiene noticias muestra el aviso "X noticias quedarán sin categoría".

### 8.6 Textos de Inicio `/admin/inicio`
- Formulario único con los campos de `ContenidoInicio`, agrupados como "Encabezado", "Bienvenida" y "Asociarse".
- Los textos largos usan el mismo editor que las noticias, pero sin H2.
- Cada grupo tiene el link "Ver en el sitio".

### 8.7 Datos de contacto `/admin/contacto`
- Formulario de `DatosContacto` agrupado en "Sede", "Filial Mar del Plata" y "Redes sociales".
- Campo WhatsApp: el usuario escribe el número como le resulte cómodo y el sistema lo normaliza a formato `549…` para el link y guarda también el formato legible. Debajo del campo se ve el link generado ("Probar enlace").
- Validaciones: email válido y URLs válidas.

### 8.8 Usuarios `/admin/usuarios`
- Lista de administradores con nombre, usuario, estado y último acceso.
- "+ Nuevo administrador":
  - Pide nombre y usuario.
  - El sistema genera una **contraseña temporal** legible (ej. `verde-arbol-4821`) y la muestra **una sola vez** con el botón "Copiar".
  - El usuario queda con `debeCambiarPassword = true`.
- Acciones sobre otros usuarios: "Restablecer contraseña" (genera una nueva contraseña temporal y cierra sus sesiones), "Desactivar/Activar" y "Eliminar".

### 8.9 Mi cuenta `/admin/mi-cuenta`
- Cambiar nombre.
- Cambiar contraseña: pide la actual, la nueva y la confirmación, con un indicador de requisitos.

---

## 9. Autenticación y seguridad

### 9.1 Login `/ingresar`
- Campos "Usuario" y "Contraseña", con botón "Mostrar contraseña" y botón "Ingresar".
- Error genérico: "Usuario o contraseña incorrectos".
- Si el usuario ya tiene sesión, redirige a `/admin`.
- Si `debeCambiarPassword = true`, redirige a `/admin/mi-cuenta?primer-ingreso=1` y bloquea el resto del panel hasta que cambie la contraseña.

### 9.2 Sesiones
- Token aleatorio de 32 bytes (`crypto.randomBytes`) en la cookie `acp_sesion`, con `httpOnly`, `secure`, `sameSite=lax` y `path=/`.
- En la base de datos se guarda **solo el hash SHA-256** del token.
- Duración de 7 días, renovada si quedan menos de 3 días.
- Al cerrar sesión se elimina el registro y la cookie.
- Al cambiar o restablecer la contraseña se eliminan todas las sesiones del usuario (excepto la actual, en el caso de un cambio propio).

### 9.3 Contraseñas y límites
- `bcryptjs` con costo 12.
- Política: mínimo 10 caracteres. No se exigen símbolos, para facilitar el uso por el público objetivo; se sugiere usar frases.
- Límite de intentos: 5 fallidos por `usuario|ip` en 15 minutos → bloqueo de 15 minutos con el mensaje "Demasiados intentos. Probá de nuevo en 15 minutos".
- Los registros de `IntentoLogin` con más de 30 días se limpian en cada login.

### 9.4 Recuperación de acceso (sin email)
- Otro administrador restablece la contraseña desde el panel (8.8).
- Si nadie tiene acceso: `npm run admin:crear -- --usuario X --nombre "Y"` o `npm run admin:reset -- --usuario X`, ejecutado por la agencia (`scripts/crear-admin.ts`).

### 9.5 Otras medidas
- `requireAdmin()` en cada Server Action y en `admin/layout.tsx`.
- Validación Zod en servidor para todos los inputs.
- Subida de imágenes:
  - Se valida el MIME en el servidor (`image/jpeg|png|webp`), con un tamaño máximo de 4MB.
  - Nombre de archivo aleatorio.
  - `serverActions.bodySizeLimit` configurado en `4mb`.
- Headers de seguridad en `next.config`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY` y un CSP básico que permita Vercel Blob.
- `/admin` e `/ingresar` llevan `noindex`.

---

## 10. Diseño visual

### 10.1 Paleta (derivada del logo)
| Token | Hex | Uso |
|---|---|---|
| `verde-900` | `#0B5E3C` | Primario: header, botones, títulos |
| `verde-700` | `#177A50` | Hover |
| `verde-100` | `#E6F2EC` | Fondos de bloques destacados |
| `tierra-900` | `#3D2A14` | Secundario: footer, acentos |
| `tierra-100` | `#F3EDE4` | Fondos alternos de sección |
| `crema` | `#FBFAF7` | Fondo general |
| `texto` | `#1F2421` | Texto principal |
| `texto-suave` | `#4A524D` | Texto secundario (verificar contraste AA) |
| `error` | `#B42318` | Errores |
| `exito` | `#177A50` | Confirmaciones |

Tomar los valores exactos con un cuentagotas sobre `docs/logo.png` y ajustarlos si difieren.

### 10.2 Tipografía y estilo
- Títulos en **Lora** (600/700). Cuerpo e interfaz en **Atkinson Hyperlegible** (400/700), diseñada para máxima legibilidad.
- Escala desktop: H1 44px · H2 34px · H3 26px · cuerpo 20px · chico 17px (nunca menos de 16px).
- Bordes redondeados de 12px en tarjetas y 10px en botones; sombras sutiles.
- Botón primario: fondo `verde-900`, texto blanco, altura mínima de 48px y texto en peso 700.
- Ancho máximo de texto corrido: 70ch.
- Tono general: sobrio, cálido e institucional. Motivo gráfico opcional: una línea curva verde/tierra inspirada en el anillo del logo como separador de secciones.

### 10.3 Logo
- Vectorizar `docs/logo.png` a `public/logo.svg` (con potrace u otra herramienta equivalente, o redibujando a mano si el resultado no es limpio).
- Generar el favicon (32/180/512) y `og-default.png` (1200×630, logo sobre fondo crema con el nombre completo).
- Si la vectorización no queda bien, usar el PNG optimizado y registrarlo en `DECISIONES.md`.

---

## 11. Contenido inicial (seed)

`prisma/seed.ts` debe ser **idempotente** (usar upsert) y cargar lo siguiente.

**Usuario admin inicial**
- Se toma de las variables de entorno `SEED_ADMIN_USUARIO`, `SEED_ADMIN_NOMBRE` y `SEED_ADMIN_PASSWORD`, con `debeCambiarPassword = true`.

**Período "2025–2027" (vigente)**
| Grupo | Cargo | Título | Nombre | Apellido | Orden |
|---|---|---|---|---|---|
| MESA_DIRECTIVA | Presidenta | PSIC | María Angela | Odera | 1 |
| MESA_DIRECTIVA | Secretaria | LIC | Silvia | Di Stefano | 2 |
| MESA_DIRECTIVA | Prosecretaria | PSIC | Susana | D'Onofrio | 3 |
| MESA_DIRECTIVA | Tesorera | PSIC | Alicia | Sager | 4 |
| MESA_DIRECTIVA | Protesorera | PSIC | Carmen | Le Favi | 5 |
| VOCAL_TITULAR | — | PSIC | Jorge | Rómulo | 1 |
| VOCAL_TITULAR | — | PSIC | Laura | Mariani | 2 |
| VOCAL_TITULAR | — | PSIC | Olga | Espinosa | 3 |
| VOCAL_SUPLENTE | — | PSIC | Alicia | Perez | 1 |
| VOCAL_SUPLENTE | — | PSIC | Stella Maris | Gadea | 2 |
| VOCAL_SUPLENTE | — | PSIC | Susana | Anasagasti | 3 |
| REVISORA_TITULAR | — | PSIC | Hugo | Cerbino | 1 |
| REVISORA_TITULAR | — | PSIC | Alda | Spacapan | 2 |
| REVISORA_SUPLENTE | — | PSIC | Ana | Negri | 1 |
| REVISORA_SUPLENTE | — | PSIC | Graciela | Gagliano | 2 |

**Comisiones de trabajo** (la Historia y la Presentación no coinciden; se confirmó que ante cualquier discrepancia entre documentos prevalece la Presentación, por eso se usa esta lista)
| Orden | Nombre | Ícono | Descripción (placeholder, a validar) |
|---|---|---|---|
| 1 | Cultura | `palette` | Exposiciones, talleres y conferencias para compartir intereses y saberes. |
| 2 | Turismo | `plane` | Salidas y viajes para disfrutar y fortalecer vínculos entre colegas. |
| 3 | Temas Legales | `scale` | Seguimiento de la legislación previsional y defensa de los derechos de los jubilados. |
| 4 | Reconstrucción de la Historia | `book-open` | Recuperación y registro de la historia de la asociación y sus protagonistas. |
| 5 | Salud y Buenestar | `heart-pulse` | Propuestas para el cuidado integral y la calidad de vida. |

**ContenidoInicio**
- `heroTitulo`: "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires"
- `heroSubtitulo`: "Un espacio de participación, contención, orientación y pertenencia para colegas jubilados y pensionados."
- `bienvenidaTitulo`: "Quiénes somos"
- `bienvenidaTexto`: texto de `docs/PRESENTACION_DE_APCPSIJUPBA.docx`, en 2–3 párrafos, con las mismas correcciones ortográficas y de redacción que en 7.3/7.4: mayúsculas innecesarias en minúscula ("Nuestro Objetivo" → "nuestro objetivo", "Nuestras Reuniones" → "nuestras reuniones", "Representar a Nuestros asociados" → "representar a nuestros asociados"), y "esto facilitó" con mayúscula inicial tras el punto ("...fuera de la provincia. Esto facilitó...").
- `asociarseTitulo`: "¿Querés asociarte?"
- `asociarseTexto`: "Te invitamos a sumarte a la asociación, participar de las reuniones y formar parte de nuestras comisiones. Escribinos y te contamos cómo." seguido de los requisitos para asociarse de `docs/Requisitos_para_asociarse.md` (lista, con las mismas correcciones de mayúsculas/redacción que en 7.3/7.4): ser jubilado/a de la Caja de Psicólogos de la Provincia de Buenos Aires; socios adherentes (psicólogos activos que aportan a la Caja y están jubilados en el IPS o en el ANSES); presentar la Ficha de Inscripción, con la opción de debitar la cuota societaria del haber jubilatorio (trámite en La Caja).

**DatosContacto**
- `email`: `acpsijupba@gmail.com`
- `filialNombre`: "Filial Mar del Plata"
- El resto de los campos queda vacío (**[PENDIENTE]**, lo carga la asociación desde el panel).

**Noticias**
- Ninguna en producción.
- Crear 4 noticias de ejemplo **solo** si `SEED_DEMO=true`, para desarrollo.

---

## 12. SEO y rendimiento

- `metadata` por página, con el template de título `%s | ACPSIJUPBA`.
- Descripción por defecto: "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires."
- `lang="es-AR"`.
- JSON-LD `Organization` en el layout y `NewsArticle` en el detalle de noticia.
- Imágenes con `next/image` (dominio de Vercel Blob en `remotePatterns`).
- Objetivos de Lighthouse en móvil: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Fechas formateadas con `Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'America/Argentina/Buenos_Aires' })`.

---

## 13. Entorno y despliegue

**`.env.example`**
```
DATABASE_URL=
DATABASE_URL_UNPOOLED=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=https://acpsijupba.org.ar
SEED_ADMIN_USUARIO=
SEED_ADMIN_NOMBRE=
SEED_ADMIN_PASSWORD=
SEED_DEMO=false
```

**Scripts de `package.json`**
- `dev`, `build`, `start`, `lint`, `typecheck`
- `db:migrate` (`prisma migrate dev`), `db:deploy` (`prisma migrate deploy`), `db:seed`
- `admin:crear`, `admin:reset`

**Deploy**
1. Crear el proyecto en Vercel (cuenta de la asociación) y conectar el repositorio.
2. Agregar Neon Postgres y Vercel Blob desde el Marketplace/Storage (las variables se inyectan automáticamente).
3. Build command: `prisma migrate deploy && next build`.
4. Ejecutar el seed una única vez contra producción.
5. Configurar el dominio **[PENDIENTE]**. Sugerido: `acpsijupba.org.ar`, que se registra en NIC Argentina con la documentación de la Personería Jurídica.

**README.md**: incluir instalación local, variables de entorno, cómo crear o restablecer un admin, y un **mini instructivo para la asociación** ("Cómo publicar una noticia", paso a paso con lenguaje simple).

---

## 14. Plan de implementación por fases

| Fase | Entregable | Criterios de aceptación |
|---|---|---|
| **1. Base** | Setup Next.js, Tailwind con tokens, fuentes, Prisma + schema + migración, seed | `npm run build` OK; el seed corre dos veces sin duplicar datos |
| **2. Sitio público estático** | Layout, Inicio, Historia, Objetivos, Comisión Directiva, Contacto (leyendo de la base de datos) | Todas las páginas renderizan con los datos del seed; control A−/A+ funciona; navegación por teclado completa; menú móvil usable |
| **3. Autenticación** | Login, sesiones, middleware, `requireAdmin`, límite de intentos, cambio obligatorio de contraseña, scripts CLI | Sin sesión, `/admin` redirige a `/ingresar`; 6.º intento fallido bloqueado; logout invalida la sesión en la base de datos |
| **4. Noticias** | Páginas públicas de noticias + CRUD admin + editor + imágenes + vista previa | Un admin crea una noticia con imagen, la previsualiza, la publica, aparece en Inicio y en /noticias, la despublica y responde 404; el HTML malicioso (`<script>`) se elimina |
| **5. Resto del panel** | Comisión directiva (períodos), comisiones de trabajo, textos de Inicio, contacto, usuarios, mi cuenta, escritorio | Cada cambio se refleja en el sitio público sin redeploy; no se puede eliminar el último admin ni el período vigente |
| **6. Pulido** | SEO, sitemap, OG, 404, headers de seguridad, logo SVG, favicon, README e instructivo | Lighthouse con los objetivos de la sección 12; axe sin errores críticos; sitio probado en 375px, 768px y 1280px |

---

## 15. Pendientes a confirmar con el cliente

| # | Tema | Valor por defecto implementado |
|---|---|---|
| 1 | Descripciones de cada comisión de trabajo | Placeholders de la sección 11 (no salen de ningún documento fuente) |
| 2 | WhatsApp, teléfono, dirección, horarios, datos de la filial y redes | Vacíos (se cargan desde el panel) |
| 3 | Dominio y titularidad de las cuentas (Vercel, Neon, dominio) | A nombre de la asociación |
| 4 | Fotos de los miembros de la comisión | Avatar con iniciales |
| 5 | ~~Requisitos o cuota para asociarse (texto del bloque "Asociarse")~~ | **Resuelto**: `docs/Requisitos_para_asociarse.md`, incorporado en la sección 11 |

**Confirmado con el cliente:**
- Nombre oficial: "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires" (sin "de").
- Apellidos: D'Onofrio y Anasagasti.
- Ante discrepancias entre los documentos fuente, prevalece la Presentación (`PRESENTACION_DE_APCPSIJUPBA.docx`) — aplicado a la lista de comisiones de trabajo (sección 11).
- Nombre de la comisión de trabajo: "Salud y Buenestar" (con "u"; confirmado con el cliente que esta es la forma correcta, no "Bienestar").
- Se aplican correcciones ortográficas y de redacción a los textos transcriptos de Historia, Objetivos y la Bienvenida de Inicio (detalle en 7.3, 7.4 y 11).
