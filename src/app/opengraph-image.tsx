import { ImageResponse } from "next/og";
import { obtenerLogoDataUrl } from "@/lib/logo";

// 1200×630, logo sobre fondo crema con el nombre completo (sección 10.3 del SDD).
export const alt =
  "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await obtenerLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#FBFAF7",
          padding: "0 80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- JSX de ImageResponse (next/og), se renderiza a PNG en el servidor, no es HTML de navegador */}
        <img src={logoSrc} width={220} height={220} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 42,
            fontWeight: 700,
            color: "#0B5E3C",
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          <div>Asociación Civil Psicólogos Jubilados y Pensionados</div>
          <div>de la Provincia de Buenos Aires</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
