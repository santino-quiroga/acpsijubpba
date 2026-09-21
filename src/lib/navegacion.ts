export type ItemNav = { href: string; label: string };

// Menú del sitio público (sección 7.1 del SDD).
export const NAV_PUBLICO: ItemNav[] = [
  { href: "/", label: "Inicio" },
  { href: "/historia", label: "Historia" },
  { href: "/objetivos", label: "Objetivos" },
  { href: "/comision-directiva", label: "Nosotros" },
  { href: "/noticias", label: "Noticias" },
  { href: "/contacto", label: "Contacto" },
];
