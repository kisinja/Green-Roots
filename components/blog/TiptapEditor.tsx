// components/blog/TiptapEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TableOfContents from "@tiptap/extension-table-of-contents";
import Heading from "@tiptap/extension-heading";
import { useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  TableOfContents as TocIcon,
} from "lucide-react";

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

const TiptapEditor = ({ content = "", onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false, // Prevents hydration warnings
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading to avoid conflicts
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "scroll-mt-20",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-green-700 hover:underline" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Placeholder.configure({
        placeholder: "Start writing your beautiful article...",
      }),
      TableOfContents,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-green max-w-none focus:outline-none min-h-[520px] p-8 bg-white rounded-b-3xl border border-green-100",
      },
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = prompt(
      "Enter the URL:",
      editor.getAttributes("link").href || "",
    );
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const insertToC = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<h2>Table of Contents</h2>`).run();
  }, [editor]);

  if (!editor)
    return <div className="p-8 text-green-600">Loading editor...</div>;

  return (
    <div className="border border-green-100 rounded-3xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-green-50 border-b border-green-100 p-3 flex flex-wrap gap-1 items-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
        >
          <Bold size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`}
        >
          <Italic size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive("underline") ? "active" : ""}`}
        >
          <UnderlineIcon size={20} />
        </button>

        <div className="w-px h-7 bg-green-200 mx-3" />

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`toolbar-btn ${editor.isActive("heading", { level: 1 }) ? "active" : ""}`}
        >
          <Heading1 size={20} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`toolbar-btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
        >
          <Heading2 size={20} />
        </button>

        <div className="w-px h-7 bg-green-200 mx-3" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${editor.isActive("bulletList") ? "active" : ""}`}
        >
          <List size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${editor.isActive("orderedList") ? "active" : ""}`}
        >
          <ListOrdered size={20} />
        </button>

        <div className="w-px h-7 bg-green-200 mx-3" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: "left" }) ? "active" : ""}`}
        >
          <AlignLeft size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: "center" }) ? "active" : ""}`}
        >
          <AlignCenter size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: "right" }) ? "active" : ""}`}
        >
          <AlignRight size={20} />
        </button>

        <div className="w-px h-7 bg-green-200 mx-3" />

        <button
          onClick={setLink}
          className={`toolbar-btn ${editor.isActive("link") ? "active" : ""}`}
        >
          <LinkIcon size={20} />
        </button>
        <button
          onClick={insertToC}
          className="toolbar-btn text-green-700 hover:bg-white"
          title="Insert Table of Contents"
        >
          <TocIcon size={20} />
        </button>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />

      {/* Footer */}
      <div className="px-6 py-2.5 text-xs text-green-600 bg-green-50 border-t border-green-100 flex justify-between">
        <span>Rich Text Editor</span>
        <span>Headings auto-generate Table of Contents</span>
      </div>
    </div>
  );
};

export default TiptapEditor;
