import sanitizeHtml from "sanitize-html";

// Whitelist de la sección 8.3 del SDD. Los links externos llevan
// rel="noopener noreferrer" target="_blank".
export function sanitizarContenidoNoticia(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "strong", "em", "ul", "ol", "li", "a", "br"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}
