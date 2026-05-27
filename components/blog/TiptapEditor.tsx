"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const ToolbarBtn = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
        ${
          active
            ? "bg-[var(--green-700)] text-white shadow-sm"
            : "text-[var(--green-700)] hover:bg-[var(--green-100)] hover:text-[var(--green-800)]"
        }
      `}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <span className="w-px h-5 bg-[var(--green-200)] self-center mx-1" />
  );

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: "1.5px solid var(--green-200)",
        background: "#fff",
        minHeight: "600px",
        boxShadow:
          "0 2px 8px 0 rgba(31,94,31,0.06), 0 1px 2px 0 rgba(31,94,31,0.04)",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 px-4 py-2.5"
        style={{
          borderBottom: "1.5px solid var(--green-100)",
          background: "var(--green-50)",
        }}
      >
        {/* Text style */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <s>S</s>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <span style={{ textDecoration: "underline" }}>U</span>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          {"</>"}
        </ToolbarBtn>

        <Divider />

        {/* Headings */}
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          • List
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. List
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          ❝
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          ≡L
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          ≡C
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          ≡R
        </ToolbarBtn>

        <Divider />

        {/* History */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}>
          ↩
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}>
          ↪
        </ToolbarBtn>
      </div>

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="prose prose-green max-w-none p-8 flex-1 focus:outline-none overflow-auto"
        style={{
          minHeight: "520px",
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--green-900)",
          lineHeight: "1.8",
        }}
      />

      {/* Footer word count */}
      <div
        className="flex justify-end px-5 py-2 text-xs"
        style={{
          borderTop: "1px solid var(--green-100)",
          color: "var(--green-400)",
          background: "var(--green-50)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {editor.storage.characterCount?.words?.() ??
          editor.getText().trim().split(/\s+/).filter(Boolean).length}{" "}
        words
      </div>
    </div>
  );
};

export default TiptapEditor;
