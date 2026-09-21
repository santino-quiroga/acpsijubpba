/**
 * Normaliza un número escrito "como resulte cómodo" (sección 8.7) al formato
 * `549...` que necesita el link de wa.me. Cubre los casos más comunes (con o
 * sin "0" de larga distancia, con o sin "54" adelante, con o sin "15" de
 * celular al principio). No intenta separar un "15" que aparezca después del
 * código de área sin un "0" inicial (ambiguo sin una tabla de códigos de
 * área) — por eso el campo siempre muestra el link generado, para que se
 * pueda verificar y corregir a mano si hace falta.
 */
export function normalizarWhatsapp(entrada: string): string | null {
  let numero = entrada.replace(/\D/g, "");
  if (!numero) return null;

  if (numero.startsWith("0")) numero = numero.slice(1);
  if (numero.startsWith("54")) numero = numero.slice(2);
  if (numero.startsWith("9")) numero = numero.slice(1);
  if (numero.startsWith("15")) numero = numero.slice(2);

  if (!numero) return null;
  return `549${numero}`;
}

export function urlWhatsapp(whatsapp: string): string {
  return `https://wa.me/${whatsapp}`;
}
