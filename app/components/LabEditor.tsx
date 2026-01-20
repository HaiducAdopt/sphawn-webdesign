// app/components/LabEditor.tsx
"use client";

import dynamic from "next/dynamic";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const LabEditorClient = dynamic(() => import("./LabEditorClient"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/60">
      Loading editor...
    </div>
  ),
});

export default function LabEditor(props: Props) {
  return <LabEditorClient {...props} />;
}
