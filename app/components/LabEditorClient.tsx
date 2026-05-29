// app/components/LabEditorClient.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function LabEditorClient({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,

      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class:
            "my-6 w-full max-w-full rounded-2xl border border-white/10 shadow-lg",
        },
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class:
            "text-[#D4AF37] underline underline-offset-4 hover:text-white",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder:
          "Write your article here. You can add text, links, images, headings, lists and more...",
      }),
    ],

    content: value || "",
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[420px] w-full rounded-b-xl border border-t-0 border-white/10 bg-[#111827] px-5 py-4 text-white outline-none prose prose-invert max-w-none prose-img:rounded-2xl prose-a:text-[#D4AF37]",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();

    if (value != null && value !== current) {
    editor.commands.setContent(value);
    }
  }, [editor, value]);

  const handleAddLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;

    const url = window.prompt(
      "Add link URL:",
      previousUrl || "https://",
    );

    if (url === null) return;

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: cleanUrl })
      .run();
  }, [editor]);

  const handleRemoveLink = useCallback(() => {
    if (!editor) return;

    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  const handleAddImageByUrl = useCallback(() => {
    if (!editor) return;

    const imageUrl = window.prompt("Paste image URL:");

    if (!imageUrl) return;

    const cleanImageUrl = imageUrl.trim();

    if (!cleanImageUrl) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: cleanImageUrl,
        alt: "Article image",
      })
      .run();
  }, [editor]);

  const handleOpenImagePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUploadImage = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;

      const file = event.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        window.alert("Please select an image file.");
        event.target.value = "";
        return;
      }

      try {
        setIsUploading(true);

        const safeFileName = file.name
          .toLowerCase()
          .replace(/[^a-z0-9.-]/g, "-");

        const imageRef = ref(
          storage,
          `lab-article-content-images/${Date.now()}-${safeFileName}`,
        );

        await uploadBytes(imageRef, file);

        const downloadUrl = await getDownloadURL(imageRef);

        editor
          .chain()
          .focus()
          .setImage({
            src: downloadUrl,
            alt: file.name,
          })
          .run();
      } catch (error) {
        console.error("Image upload failed:", error);
        window.alert("Image upload failed. Please try again.");
      } finally {
        setIsUploading(false);
        event.target.value = "";
      }
    },
    [editor],
  );

  if (!editor) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="flex flex-wrap gap-2 border-b border-white/10 bg-[#0f172a] p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("bold")
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("italic")
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("underline")
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Underline
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("heading", { level: 3 })
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          H3
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("bulletList")
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Bullet list
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("orderedList")
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Numbered list
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("blockquote")
              ? "bg-white text-[#111827]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Quote
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Left
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Center
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Right
        </button>

        <button
          type="button"
          onClick={handleAddLink}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            editor.isActive("link")
              ? "bg-[#D4AF37] text-[#111827]"
              : "bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30"
          }`}
        >
          Add link
        </button>

        <button
          type="button"
          onClick={handleRemoveLink}
          className="rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/30"
        >
          Remove link
        </button>

        <button
          type="button"
          onClick={handleAddImageByUrl}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Image URL
        </button>

        <button
          type="button"
          onClick={handleOpenImagePicker}
          disabled={isUploading}
          className="rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-semibold text-[#111827] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload image"}
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Redo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          className="hidden"
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}