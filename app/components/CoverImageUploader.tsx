"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export default function CoverImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);

    const imageRef = ref(
      storage,
      `lab-articles/${Date.now()}-${file.name}`
    );

    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);

    onChange(url);
    setUploading(false);
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-900">
      <p className="font-medium mb-2">Cover Image</p>

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Cover"
            className="rounded-lg w-full max-h-64 object-cover"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded"
          >
            Replace
          </button>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <div className="border-dashed border-2 rounded-lg p-6 text-center text-gray-400 hover:border-white transition">
            {uploading ? "Uploading..." : "Click to upload image"}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files && handleFile(e.target.files[0])
            }
          />
        </label>
      )}
    </div>
  );
}
