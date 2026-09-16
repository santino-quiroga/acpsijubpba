import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Lora } from "next/font/google";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ACPSIJUPBA",
    template: "%s | ACPSIJUPBA",
  },
  description:
    "Asociación Civil Psicólogos Jubilados y Pensionados de la Provincia de Buenos Aires.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${atkinson.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
