"use client";

import { useRef, useState } from "react";

interface Props {
  images: string[];          // current URLs (already uploaded)
  onChange: (urls: string[]) => void;
  emoji?: string;    
  type?:string;        // fallback emoji for empty state
}

export default function ImageUploader({ images, onChange, emoji = "📦", type = "productImage" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange([...images, ...data.urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function remove(url: string) {
    onChange(images.filter((u) => u !== url));
  }

  function move(from: number, to: number) {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors ${
          dragOver
            ? "border-[var(--green-400)] bg-[var(--green-50)]"
            : "border-gray-200 hover:border-[var(--green-300)] hover:bg-[var(--green-50)]"
        }`}
      >
        {uploading ? (
          <>
            <span className="text-2xl animate-spin">⏳</span>
            <p className="text-sm text-gray-500">Uploading…</p>
          </>
        ) : (
          <>
            <span className="text-3xl">🖼️</span>
            <p className="text-sm font-medium text-gray-700">
              Drop images here or <span className="text-[var(--green-600)] underline">browse</span>
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP, AVIF — multiple allowed</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-square bg-[var(--green-50)]">
              <img src={url} alt="" className="w-full h-full object-cover" />

              {/* Primary badge */}
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 rounded-full bg-[var(--green-600)] px-2 py-0.5 text-[10px] font-semibold text-white">
                  Primary
                </span>
              )}

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    title="Move left"
                    className="w-7 h-7 rounded-full bg-white/90 text-gray-700 text-xs flex items-center justify-center hover:bg-white"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  title="Remove"
                  className="w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    title="Move right"
                    className="w-7 h-7 rounded-full bg-white/90 text-gray-700 text-xs flex items-center justify-center hover:bg-white"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty emoji fallback note */}
      {images.length === 0 && type === "productImage" && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <span className="text-2xl">{emoji}</span>
          <p className="text-xs text-gray-500">
            No images yet — the emoji <strong>{emoji}</strong> will be used as a fallback on the storefront.
          </p>
        </div>
      )}
    </div>
  );
}