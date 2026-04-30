"use client";

import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

const buttonClass =
  "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500";

const activeButtonClass =
  "border-emerald-400 bg-emerald-50 text-emerald-800";

function className(active = false) {
  return active ? `${buttonClass} ${activeButtonClass}` : buttonClass;
}

export function NoticeRichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write the notice message...",
      }),
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: {
        class:
          "min-h-36 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm leading-6 text-zinc-900 outline-none transition focus:border-emerald-500/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
      },
    },
    onUpdate({ editor }) {
      setHtml(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");

    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
        <button
          type="button"
          className={className(editor?.isActive("bold"))}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={className(editor?.isActive("italic"))}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={className(editor?.isActive("underline"))}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
        <button
          type="button"
          className={className(editor?.isActive("strike"))}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          type="button"
          className={className(editor?.isActive("heading", { level: 3 }))}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          Heading
        </button>
        <button
          type="button"
          className={className(editor?.isActive("bulletList"))}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </button>
        <button
          type="button"
          className={className(editor?.isActive("orderedList"))}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          Numbers
        </button>
        <button type="button" className={className(editor?.isActive("link"))} onClick={setLink}>
          Link
        </button>
        <button
          type="button"
          className={className(editor?.isActive({ textAlign: "left" }))}
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        >
          Left
        </button>
        <button
          type="button"
          className={className(editor?.isActive({ textAlign: "center" }))}
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        >
          Center
        </button>
        <button
          type="button"
          className={className(editor?.isActive({ textAlign: "right" }))}
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        >
          Right
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
