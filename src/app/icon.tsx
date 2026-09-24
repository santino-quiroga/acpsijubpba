import { ImageResponse } from "next/og";
import { obtenerLogoDataUrl } from "@/lib/logo";

// 32 (pestaña del navegador) y 512 (ícono de alta resolución, ej. Android) —
// sección 10.3 del SDD.
export function generateImageMetadata() {
  return [
    { id: "32", size: { width: 32, height: 32 }, contentType: "image/png" },
    { id: "512", size: { width: 512, height: 512 }, contentType: "image/png" },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const tamanio = (await id) === "512" ? 512 : 32;
  const logoSrc = await obtenerLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- JSX de ImageResponse (next/og), se renderiza a PNG en el servidor, no es HTML de navegador */}
        <img src={logoSrc} width={tamanio} height={tamanio} />
      </div>
    ),
    { width: tamanio, height: tamanio },
  );
}
