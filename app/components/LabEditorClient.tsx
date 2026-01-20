// app/components/LabEditorClient.tsx
"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function LabEditorClient({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false, // IMPORTANT: fix pentru SSR/hydration warning
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none text-white",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // ținem editorul sincron cu value (când încărcăm din Firestore)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value != null && value !== current) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <EditorContent editor={editor} />
    </div>
  );
}
