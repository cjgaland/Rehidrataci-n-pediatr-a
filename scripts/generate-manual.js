const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, TableOfContents, PageBreak, Header, Footer, PageNumber,
  ExternalHyperlink
} = require('docx');

const border = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const borders = { top: border, bottom: border, left: border, right: border };

const P = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  ...opts,
  children: Array.isArray(text) ? text : [new TextRun(text)],
});

const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun(text)],
});
const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun(text)],
});
const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun(text)],
});

const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 80 },
  children: Array.isArray(text) ? text : [new TextRun(text)],
});
const numbered = (text) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  spacing: { after: 80 },
  children: Array.isArray(text) ? text : [new TextRun(text)],
});

const cell = (text, opts = {}) => new TableCell({
  borders,
  width: { size: opts.width, type: WidthType.DXA },
  shading: opts.header ? { fill: "0E7C7B", type: ShadingType.CLEAR } : undefined,
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  children: [new Paragraph({
    children: [new TextRun({
      text,
      bold: !!opts.header,
      color: opts.header ? "FFFFFF" : "000000",
    })],
  })],
});

const table = (rows, columnWidths) => new Table({
  width: { size: columnWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  columnWidths,
  rows: rows.map((row, i) => new TableRow({
    children: row.map((c, j) => cell(c, { width: columnWidths[j], header: i === 0 })),
  })),
});

const link = (text, url) => new ExternalHyperlink({
  children: [new TextRun({ text, style: "Hyperlink", color: "0E7C7B", underline: {} })],
  link: url,
});

const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "HidratIV", bold: true, size: 56, color: "0E7C7B" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: "Manual de Uso", bold: true, size: 36 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: "Calculadora de rehidratación intravenosa pediátrica", italics: true, size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: "Versión 1.0.1 · 2026", size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: "Autor: Carlos J. Galán Doval", size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [link("https://cjgaland.github.io/Rehidrataci-n-pediatr-a/", "https://cjgaland.github.io/Rehidrataci-n-pediatr-a/")],
  }),
  new Paragraph({ children: [new PageBreak()] }),

  H1("Índice"),
  new TableOfContents("Índice", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ children: [new PageBreak()] }),

  H1("1. Introducción"),
  P("HidratIV es una aplicación web progresiva (PWA) diseñada para asistir al pediatra en urgencias en el cálculo de pautas de rehidratación intravenosa. Reúne en una sola pantalla la valoración clínica de la deshidratación (escala de Gorelick), el cálculo de necesidades basales (Holliday-Segar) y la selección de la estrategia terapéutica adecuada según la natremia y las contraindicaciones."),
  P("La aplicación funciona íntegramente en el navegador, sin enviar datos a ningún servidor. Toda la información clínica introducida permanece en el dispositivo del usuario."),

  H2("1.1. Características principales"),
  bullet("Funciona sin conexión una vez instalada (PWA con Service Worker)."),
  bullet("Instalable en el escritorio o pantalla de inicio del móvil."),
  bullet("Modo oscuro y claro, adaptable a las preferencias del sistema."),
  bullet("Informe clínico copiable y editable para pegar en la historia."),
  bullet("Sin servidor, sin cookies, sin telemetría."),

  H2("1.2. Advertencia clínica"),
  P([new TextRun({ text: "HidratIV es una herramienta de apoyo a la decisión clínica. ", bold: true }),
     new TextRun("No sustituye al juicio del facultativo responsable del paciente. Las pautas calculadas deben revisarse siempre antes de su aplicación, teniendo en cuenta el contexto clínico individual, comorbilidades y la evolución del niño.")]),

  new Paragraph({ children: [new PageBreak()] }),
  H1("2. Acceso e instalación"),

  H2("2.1. Acceso web"),
  P([new TextRun("La aplicación está disponible públicamente en: "),
     link("https://cjgaland.github.io/Rehidrataci-n-pediatr-a/", "https://cjgaland.github.io/Rehidrataci-n-pediatr-a/")]),
  P("Funciona en cualquier navegador moderno (Chrome, Safari, Firefox, Edge) tanto en escritorio como en dispositivos móviles."),

  H2("2.2. Instalación como PWA"),
  P("Para instalarla como aplicación nativa:"),
  numbered("Abrir la URL en el navegador del dispositivo."),
  numbered("En Android/Chrome: tocar el menú (⋮) → \"Instalar aplicación\" o \"Añadir a pantalla de inicio\"."),
  numbered("En iOS/Safari: tocar el icono compartir (□↑) → \"Añadir a pantalla de inicio\"."),
  numbered("En escritorio: aparecerá un icono de instalación en la barra de direcciones."),
  P("Una vez instalada, la app funciona sin conexión y se actualiza automáticamente cuando hay una nueva versión disponible (aparece un banner \"Nueva versión disponible\")."),

  new Paragraph({ children: [new PageBreak()] }),
  H1("3. Guía de uso paso a paso"),

  H2("3.1. Datos del paciente"),
  P("En la primera sección se introducen los datos básicos:"),
  bullet([new TextRun({ text: "Edad: ", bold: true }), new TextRun("en meses. Relevante para detectar lactantes < 3 meses (contraindica RHO/RIR).")]),
  bullet([new TextRun({ text: "Peso: ", bold: true }), new TextRun("en kilogramos. Base de todos los cálculos posteriores.")]),
  bullet([new TextRun({ text: "Sodio plasmático (Na+): ", bold: true }), new TextRun("en mEq/L. Determina el tipo de natremia y la estrategia de reposición.")]),
  bullet([new TextRun({ text: "Inestabilidad / comorbilidad: ", bold: true }), new TextRun("toggle Sí/No. Activar si hay shock, cardiopatía, nefropatía, sepsis, alteración del nivel de conciencia u otra condición que contraindique la rehidratación rápida.")]),
  bullet([new TextRun({ text: "Intolerancia oral: ", bold: true }), new TextRun("toggle Sí/No. Activar si el paciente presenta vómitos incoercibles, rechazo persistente de la ingesta, alteración del nivel de conciencia, íleo u otra causa que impida la vía oral. En ese caso, la app escalará automáticamente de RHO a una pauta intravenosa.")]),

  H2("3.2. Escala de Gorelick"),
  P("La escala de Gorelick estima el porcentaje de deshidratación a partir de 10 signos clínicos. Cada ítem marcado suma 1 punto."),
  table([
    ["Puntuación", "Grado de deshidratación", "% pérdida estimada"],
    ["0", "Sin deshidratación", "—"],
    ["1 – 2", "Leve", "≈ 4 %"],
    ["3 – 5", "Moderada", "≈ 7 %"],
    ["6 – 10", "Grave", "≈ 10 %"],
  ], [2200, 4000, 3160]),
  P(""),
  P("Marcar cada ítem presente. La puntuación total y el grado se actualizan automáticamente."),

  H2("3.3. Cálculo"),
  P("Pulsar el botón \"Calcular\" (o tecla Enter desde cualquier campo numérico). La aplicación mostrará:"),
  bullet("Tipo de natremia (hipo/iso/hipernatrémica)."),
  bullet("Necesidades basales (Holliday-Segar)."),
  bullet("Déficit estimado en ml."),
  bullet("Estrategia recomendada (basales, RHO, RIR o IV clásica)."),
  bullet("Volumen, ritmo de infusión y duración."),
  bullet("Informe clínico copiable."),

  new Paragraph({ children: [new PageBreak()] }),
  H1("4. Lógica clínica"),

  H2("4.1. Holliday-Segar (necesidades basales)"),
  table([
    ["Peso", "Necesidades basales diarias"],
    ["≤ 10 kg", "100 ml/kg/día"],
    ["10 – 20 kg", "1000 ml + 50 ml/kg por cada kg > 10"],
    ["> 20 kg", "1500 ml + 20 ml/kg por cada kg > 20"],
  ], [3000, 6360]),

  H2("4.2. Tipos de natremia"),
  table([
    ["Tipo", "Na+ (mEq/L)", "Consideraciones"],
    ["Hiponatrémica", "< 130", "Reposición habitual con suero isotónico."],
    ["Isonatrémica", "130 – 150", "Reposición estándar."],
    ["Hipernatrémica", "> 150", "Reposición en 48 h; descenso ≤ 0,5 mEq/L/h."],
  ], [2200, 2000, 5160]),

  H2("4.3. Selección de estrategia"),
  P("La función determinante de la estrategia evalúa en este orden:"),
  numbered([new TextRun({ text: "Solo basales: ", bold: true }), new TextRun("Gorelick = 0 (sin deshidratación).")]),
  numbered([new TextRun({ text: "RHO (rehidratación oral): ", bold: true }), new TextRun("deshidratación leve o moderada, sin contraindicaciones.")]),
  numbered([new TextRun({ text: "RIR (rehidratación IV rápida): ", bold: true }), new TextRun("deshidratación grave, sin contraindicaciones. 20 ml/kg/h, máximo 700 ml/h.")]),
  numbered([new TextRun({ text: "IV clásica: ", bold: true }), new TextRun("si existe alguna contraindicación.")]),

  H3("Contraindicaciones para RHO/RIR"),
  bullet("Edad < 3 meses."),
  bullet("Sodio plasmático alterado (< 130 o > 150 mEq/L)."),
  bullet("Comorbilidad o inestabilidad clínica significativa."),

  H3("Intolerancia oral"),
  P("La intolerancia oral (vómitos incoercibles, rechazo persistente de la ingesta, alteración del nivel de conciencia, íleo, etc.) no contraindica la rehidratación, pero impide la vía oral. Cuando se activa el toggle correspondiente:"),
  bullet("Si la estrategia recomendada habría sido RHO (leve/moderada sin otras contraindicaciones), la app la sustituye por RIR y lo indica explícitamente en la pantalla y en el informe."),
  bullet("Si ya existen otras contraindicaciones (< 3 meses, natremia alterada, comorbilidad), prevalece la IV clásica."),
  bullet("En pacientes sin signos de deshidratación, el aporte basal se planifica por vía IV hasta recuperar la tolerancia."),

  new Paragraph({ children: [new PageBreak()] }),
  H1("5. Funcionalidades de la interfaz"),

  H2("5.1. Modo oscuro / claro"),
  P("El icono de luna/sol situado en la cabecera alterna entre modo oscuro y claro. La aplicación respeta inicialmente la preferencia del sistema operativo y guarda la elección manual en el almacenamiento local del navegador."),

  H2("5.2. Informe clínico"),
  P("Tras el cálculo, se genera un informe en texto plano editable. Se puede:"),
  bullet("Modificar antes de copiar (añadir observaciones, ajustar valores)."),
  bullet("Copiar al portapapeles con un toque."),
  bullet("Pegar directamente en la historia clínica electrónica."),

  H2("5.3. Atajos"),
  bullet([new TextRun({ text: "Enter ", bold: true }), new TextRun("desde cualquier campo numérico ejecuta el cálculo.")]),

  H2("5.4. Bibliografía"),
  P("Al pie de la aplicación, una sección desplegable contiene las referencias bibliográficas que sustentan la lógica clínica, con enlaces directos al PDF o DOI cuando están disponibles."),

  new Paragraph({ children: [new PageBreak()] }),
  H1("6. Bibliografía"),
  bullet("García Herrero MA et al. (2024). SEUP, Protocolos diagnóstico-terapéuticos de Urgencias Pediátricas, 4.ª edición, Capítulo 17 (deshidratación y rehidratación)."),
  bullet("Mora-Capín A et al. (2022). Rehidratación intravenosa rápida en Urgencias: documento de consenso GRADE. An Pediatr 96(6):523-535."),
  bullet("Manrique-Martínez I et al. (2011). Nuevas pautas de rehidratación en el manejo de las gastroenteritis agudas en urgencias pediátricas. An Pediatr Cont 9(2):106-115."),

  new Paragraph({ children: [new PageBreak()] }),
  H1("7. Privacidad y datos"),
  P("HidratIV no envía ningún dato a servidores externos. Todos los cálculos se realizan en el dispositivo del usuario. No se utilizan cookies de seguimiento ni herramientas de analítica."),
  P("El único dato persistido en el navegador es la preferencia de tema (clave hidrativ-theme en localStorage)."),

  H1("8. Contacto y créditos"),
  P([new TextRun({ text: "Autor: ", bold: true }), new TextRun("Carlos J. Galán Doval")]),
  P([new TextRun({ text: "Año: ", bold: true }), new TextRun("2026")]),
  P([new TextRun({ text: "Repositorio: ", bold: true }), link("https://github.com/cjgaland/Rehidrataci-n-pediatr-a", "https://github.com/cjgaland/Rehidrataci-n-pediatr-a")]),
  P([new TextRun({ text: "App: ", bold: true }), link("https://cjgaland.github.io/Rehidrataci-n-pediatr-a/", "https://cjgaland.github.io/Rehidrataci-n-pediatr-a/")]),
];

const doc = new Document({
  creator: "Carlos J. Galán Doval",
  title: "HidratIV — Manual de Uso",
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "0E7C7B" },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "117A8B" },
        paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "HidratIV — Manual de Uso · Página ", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outPath = path.join(__dirname, "..", "HidratIV-Manual.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("Wrote", outPath);
});
