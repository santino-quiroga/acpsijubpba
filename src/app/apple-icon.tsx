import { ImageResponse } from "next/og";
import { obtenerLogoDataUrl } from "@/lib/logo";

// 180×180 — tamaño estándar de apple-touch-icon (sección 10.3 del SDD).
// Fondo sólido (no transparente): iOS no respeta la transparencia y agrega
// un fondo blanco por defecto si no se provee uno.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
          background: "#FBFAF7",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- JSX de ImageResponse (next/og), se renderiza a PNG en el servidor, no es HTML de navegador */}
        <img src={logoSrc} width={150} height={150} />
      </div>
    ),
    { ...size },
  );
}
