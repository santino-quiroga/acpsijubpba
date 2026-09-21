"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Heading2,
  type LucideIcon,
} from "lucide-react";

function BotonBarra({
  etiqueta,
  icono: Icono,
  activo,
  onClick,
}: {
  etiqueta: string;
  icono: LucideIcon;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex min-h-boton items-center gap-1 rounded-boton border-2 px-3 text-chico font-bold ${
        activo
          ? "border-verde-900 bg-verde-100 text-verde-900"
          : "border-tierra-100 text-texto"
      }`}
    >
      <Icono size={18} aria-hidden="true" />
      {etiqueta}
    </button>
  );
}

// Barra de la sección 8.3: Subtítulo (H2), Negrita, Cursiva, Lista con
// viñetas, Lista numerada, Enlace, Deshacer/Rehacer. Sin H1/blockquote/code:
// coincide con la whitelist de sanitización del servidor (sección 8.3).
export function EditorContenido({
  name,
  contenidoInicial,
  sinSubtitulo = false,
}: {
  name: string;
  contenidoInicial?: string;
  /** Textos de Inicio (8.6) usan el mismo editor pero sin H2. */
  sinSubtitulo?: boolean;
}) {
  const [, forzarRender] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: () => forzarRender((n) => n + 1),
    onSelectionUpdate: () => forzarRender((n) => n + 1),
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        heading: sinSubtitulo ? false : { levels: [2] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
    ],
    content: contenidoInicial || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "contenido-html min-h-60 rounded-boton border-2 border-tierra-100 bg-crema px-4 py-3 text-cuerpo focus:border-verde-700 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  function alAgregarEnlace() {
    if (!editor) return;
    const url = window.prompt("Pegá la dirección del enlace (https://...)");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Formato del texto">
        {!sinSubtitulo && (
          <BotonBarra
            etiqueta="Subtítulo"
            icono={Heading2}
            activo={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
        )}
        <BotonBarra
          etiqueta="Negrita"
          icono={Bold}
          activo={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <BotonBarra
          etiqueta="Cursiva"
          icono={Italic}
          activo={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <BotonBarra
          etiqueta="Lista con viñetas"
          icono={List}
          activo={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <BotonBarra
          etiqueta="Lista numerada"
          icono={ListOrdered}
          activo={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <BotonBarra
          etiqueta="Enlace"
          icono={LinkIcon}
          activo={editor.isActive("link")}
          onClick={alAgregarEnlace}
        />
        <BotonBarra
          etiqueta="Deshacer"
          icono={Undo2}
          activo={false}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <BotonBarra
          etiqueta="Rehacer"
          icono={Redo2}
          activo={false}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={editor.getHTML()} />
    </div>
  );
}
