import type { Metadata } from "next";
import { ListadoNoticiasPaginado } from "@/components/publico/ListadoNoticiasPaginado";

export const metadata: Metadata = {
  title: "Próximas actividades",
  description: "Próximas actividades de ACPSIJUPBA.",
};

export default async function PaginaProximasActividades({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  const parametros = await searchParams;
  const pagina = Math.max(1, Number(parametros.pagina) || 1);
  const comisionId =
    typeof parametros.comision === "string" ? parametros.comision : undefined;

  return <ListadoNoticiasPaginado tipo="proximas" pagina={pagina} comisionId={comisionId} />;
}
