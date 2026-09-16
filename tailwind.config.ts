import type { Config } from "tailwindcss";

// Tokens de color, tipografía y radios definidos en docs/SDD_ACPSIJUPBA.md
// (secciones 3.2 y 10.1/10.2). Ver docs/DECISIONES.md para detalles de las
// decisiones tomadas donde el SDD no especificaba un valor exacto.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        verde: {
          900: "#0B5E3C",
          700: "#177A50",
          100: "#E6F2EC",
        },
        tierra: {
          900: "#3D2A14",
          100: "#F3EDE4",
        },
        crema: "#FBFAF7",
        texto: "#1F2421",
        "texto-suave": "#4A524D",
        error: "#B42318",
        exito: "#177A50",
      },
      fontFamily: {
        sans: ["var(--font-atkinson)", "Arial", "Helvetica", "sans-serif"],
        display: ["var(--font-lora)", "Georgia", "serif"],
      },
      fontSize: {
        // Escala desktop (sección 10.2): H1 44 / H2 34 / H3 26 / cuerpo 20 / chico 17.
        // El tamaño real en móvil surge de bajar el font-size del <html> a 18px
        // (sección 3.2); estos valores están en rem para escalar junto con esa base.
        h1: ["2.2rem", { lineHeight: "1.15" }],
        h2: ["1.7rem", { lineHeight: "1.2" }],
        h3: ["1.3rem", { lineHeight: "1.3" }],
        cuerpo: ["1rem", { lineHeight: "1.6" }],
        // Ajustado a 0.9rem (en vez de 0.85rem) para no bajar de 16px en móvil,
        // respetando la regla "nunca menos de 16px" de la sección 10.2.
        chico: ["0.9rem", { lineHeight: "1.6" }],
      },
      borderRadius: {
        tarjeta: "12px",
        boton: "10px",
      },
      maxWidth: {
        prosa: "70ch",
      },
      minHeight: {
        boton: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
