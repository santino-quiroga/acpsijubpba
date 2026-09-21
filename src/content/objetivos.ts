// Contenido estático de /objetivos (sección 7.4 del SDD), transcripto de
// docs/OBJETIVOS.md con las correcciones ortográficas y de formato de la
// sección 7.4 (más la limpieza de espacios dobles de la extracción del
// documento original).

export const objetivoGeneral =
  "Representar a los socios en defensa de sus legítimos intereses promoviendo la solidaridad y el compañerismo entre los psicólogos jubilados y pensionados, brindando un espacio de participación y orientación.";

export type ObjetivoEspecifico = { letra: string; texto: string };

export const objetivosEspecificos: ObjetivoEspecifico[] = [
  {
    letra: "a",
    texto:
      "Participar en las Asambleas de acuerdo con la Ley de la Caja de Seguridad para los Psicólogos de la Provincia de Buenos Aires y en todas las entidades vinculadas con la profesión.",
  },
  {
    letra: "b",
    texto:
      "Velar por el mejor cumplimiento de las leyes y reglamentaciones que se refieran a los aportes profesionales y a su administración, en procura que en ningún caso resulten afectados los derechos de los jubilados y pensionados.",
  },
  {
    letra: "c",
    texto:
      "Contactar con los poderes públicos y organismos profesionales para el perfeccionamiento de la legislación previsional, emitiendo opinión en todas las circunstancias que sea necesario.",
  },
  {
    letra: "d",
    texto:
      "Defender los principios de solidaridad profesional y propiciar iniciativas tendientes a asegurar a los jubilados y pensionados de beneficios acordes con su jerarquía que les permita una vida digna.",
  },
  {
    letra: "e",
    texto:
      "Facilitar la comunicación y acceso a las fuentes informativas vinculadas con la profesión.",
  },
  {
    letra: "f",
    texto:
      "Organizar actividades culturales, recreativas, sociales y de turismo, como así también cursos y conferencias a realizarse sin fines de lucro.",
  },
  {
    letra: "g",
    texto:
      "Integrarse con instituciones del mismo carácter y constituir federaciones o confederaciones para actuar en defensa de los intereses que les sean comunes.",
  },
];
