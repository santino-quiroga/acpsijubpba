// Contenido estático de /historia (sección 7.3 del SDD), transcripto de
// docs/HISTORIA-ACPSIJUPBA.md con las correcciones ortográficas y de
// redacción de la sección 7.3, más limpieza de espacios dobles y saltos de
// línea que dejó la extracción del documento original. Ver docs/DECISIONES.md
// para el detalle de ajustes menores que exceden la lista explícita del SDD
// (por ejemplo, "lo mismos" → "los mismos").

export const historiaIntro: string[] = [
  "Su objetivo es representar a todos los socios en defensa de sus legítimos intereses y derechos, promoviendo la solidaridad y el compañerismo, y brindando un espacio de participación, contención, orientación y pertenencia como grupo.",
  "La tarea fue ardua y compleja: fue necesario contactarse y solicitar asesoramiento de organizaciones similares, contando especialmente con el apoyo de la Secretaría de Relaciones Institucionales de la Universidad Nacional de La Plata. Para eso hubo que aprender, poner energía, compromiso, tiempo, entusiasmo y dedicación conjunta en reuniones semanales.",
];

export type HitoHistoria = {
  fecha: string;
  titulo: string;
  descripcion: string;
};

export const historiaLineaDeTiempo: HitoHistoria[] = [
  {
    fecha: "2013",
    titulo: "Inicio del grupo",
    descripcion:
      "A mediados de 2013, la Psic. Laura Mariani, recientemente jubilada, se relaciona con colegas retiradas y retirados. Así se conforma un grupo que se presenta ante las autoridades de La Caja y consigue el apoyo de la Federación de Asociaciones Profesionales de Jubilados y Pensionados de las Cajas de Previsión y Seguridad Social y de otras instituciones.",
  },
  {
    fecha: "2014",
    titulo: "El camino como asociación",
    descripcion:
      "A partir de la Asamblea Ordinaria de la Caja de Seguridad Social de 2014, donde no se logró aumentar el módulo, surge la necesidad de fortalecer el acercamiento entre colegas que comparten situaciones de vida, experiencias y necesidades propias del mismo grupo etario. Así se inicia el camino como asociación, con los trámites correspondientes en la Dirección de Personas Jurídicas de la Provincia de Buenos Aires, para nuclear a todos los psicólogos jubilados de la provincia.",
  },
  {
    fecha: "25 de abril de 2015",
    titulo: "Asamblea Constitutiva",
    descripcion:
      "Se formaliza la constitución de ACPSIJUPBA en la Asamblea Constitutiva, donde se aprueban los estatutos y se eligen los miembros de la Comisión Directiva para el período 2015–2017.",
  },
  {
    fecha: "Mayo de 2017",
    titulo: "Personería Jurídica",
    descripcion: "ACPSIJUPBA obtiene la Personería Jurídica.",
  },
  {
    fecha: "2020–2021",
    titulo: "Pandemia y actividades virtuales",
    descripcion:
      "Por la pandemia, ACPSIJUPBA suspende las actividades presenciales que se desarrollaban en las instalaciones de La Caja de Psicólogos, que pasan a realizarse de forma virtual. Esto facilita el intercambio con jubilados de todos los distritos, y se sostienen conversatorios virtuales para contener y acompañar a los colegas en el tiempo de aislamiento, estrechando vínculos entre distintos lugares.",
  },
  {
    fecha: "Actualidad",
    titulo: "Comisiones de trabajo activas",
    descripcion:
      "Se organizaron comisiones de trabajo con el fin de realizar diferentes actividades culturales, tales como exposiciones, talleres, conferencias, turismo, etc. El balance hasta 2019 fue positivo en función de todas las acciones realizadas, y la asociación continúa activa, representando a sus socios.",
  },
];

export const historiaLogros: string[] = [
  "Obtener la Personería Jurídica.",
  "Integrar la Federación de Asociaciones de Profesionales Jubilados y Pensionados de la Provincia de Bs. As.",
  "Participar de la Mesa de Trabajo de Personas Mayores dependiente de la Secretaría de Relaciones Institucionales de la Universidad Nacional de La Plata.",
  "Convocar y promover la participación activa en las asambleas ordinarias de La Caja de Psicólogos de los socios y de los colegas jubilados en general, presentando propuestas de aumento del módulo y otras de interés para los socios.",
  "Intercambiar acciones y proyectos con colegas jubilados de diferentes distritos, habiendo iniciado reuniones presenciales con los mismos, que se suspendieron en 2020 y se mantienen como objetivo.",
  "Comprometer al Directorio de La Caja de Psicólogos con el objeto de mejorar los haberes jubilatorios, dada la imposibilidad de realizar asambleas ordinarias de La Caja de Psicólogos en tiempos de pandemia (2020/2021).",
  "En las dos últimas asambleas ordinarias de La Caja de Psicólogos se visualizó el nivel de representación y organización logrado por ACPSIJUPBA.",
  "Se mantienen las reuniones virtuales de socios como las comisiones de Cultura, Turismo, Gremiales, Comunicación y Difusión, pudiendo crearse nuevas comisiones de acuerdo con los intereses de los socios.",
];

export const historiaCierre =
  "Los invitamos a asociarse e incorporarse a las reuniones y a las comisiones.";
