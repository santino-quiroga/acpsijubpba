import {
  Palette,
  Plane,
  Scale,
  BookOpen,
  HeartPulse,
  Users,
  Megaphone,
  Landmark,
  Calendar,
  Music,
  Camera,
  Sprout,
  type LucideIcon,
} from "lucide-react";

// Lista cerrada de íconos para ComisionTrabajo.icono (sección 8.5 del SDD).
export const ICONOS_COMISION: Record<string, LucideIcon> = {
  palette: Palette,
  plane: Plane,
  scale: Scale,
  "book-open": BookOpen,
  "heart-pulse": HeartPulse,
  users: Users,
  megaphone: Megaphone,
  landmark: Landmark,
  calendar: Calendar,
  music: Music,
  camera: Camera,
  sprout: Sprout,
};

export function obtenerIconoComision(nombre: string): LucideIcon {
  return ICONOS_COMISION[nombre] ?? Users;
}
