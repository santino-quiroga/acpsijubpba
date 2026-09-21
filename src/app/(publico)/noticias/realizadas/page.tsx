import type { Metadata } from "next";
import { ListadoNoticiasPaginado } from "@/components/publico/ListadoNoticiasPaginado";

export const metadata: Metadata = {
  title: "Actividades realizadas",
  description: "Actividades realizadas por ACPSIJUPBA.",
};

export default async function PaginaActividadesRealizadas({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  const parametros = await searchParams;
  const pagina = Math.max(1, Number(parametros.pagina) || 1);
  const comisionId =
    typeof parametros.comision === "string" ? parametros.comision : undefined;

  return <ListadoNoticiasPaginado tipo="realizadas" pagina={pagina} comisionId={comisionId} />;
}
