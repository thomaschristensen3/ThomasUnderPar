"use client";

import { useCallback, useRef, useState } from "react";

type AcceptMode = "image" | "video" | "both";

interface FileUploadInputProps {
  /** Current URL value (controlled) */
  value: string;
  /** Called with the final URL once upload succeeds, or when URL input changes */
  onChange: (url: string) => void;
  /** Which file types to accept */
  accept?: AcceptMode;
  /** S3 folder path, e.g. "hero-images" or "media" */
  folder?: string;
  /** Placeholder for the URL fallback input */
  placeholder?: string;
  /** Whether a value is required */
  required?: boolean;
  /** Extra class names for the root element */
  className?: string;
}

const ACCEPT_MAP: Record<AcceptMode, string> = {
  image: "image/jpeg,image/png,image/gif,image/webp",
  video: "video/mp4,video/quicktime,video/webm",
  both: "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm",
};

const ACCEPT_LABEL: Record<AcceptMode, string> = {
  image: "JPG, PNG, GIF, WebP — max 10 MB",
  video: "MP4, MOV, WebM — max 50 MB",
  both: "Images (max 10 MB) or Videos (max 50 MB)",
};

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm)(\?|$)/i.test(url);
}

export default function FileUploadInput({
  value,
  onChange,
  accept = "both",
  folder = "media",
  placeholder = "https://example.com/file.jpg",
  required = false,
  className = "",
}: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      setProgress("Uploading…");

      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();

        if (!res.ok) {
          setError(json.error ?? "Upload failed.");
          setProgress(null);
        } else {
          onChange(json.url);
          setProgress(null);
        }
      } catch {
        setError("Network error — could not reach the upload server.");
        setProgress(null);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const hasValue = Boolean(value);
  const isVideo = hasValue && isVideoUrl(value);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Drop zone / upload trigger */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center cursor-pointer transition-colors select-none
          ${dragOver ? "border-forest bg-forest/5" : "border-gray-200 hover:border-forest/50 hover:bg-gray-50"}
          ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[accept]}
          className="sr-only"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {/* Preview */}
        {hasValue && !uploading && (
          <div className="w-full mb-1">
            {isVideo ? (
              <video
                src={value}
                className="max-h-40 mx-auto rounded-lg object-contain"
                controls={false}
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Preview"
                className="max-h-40 mx-auto rounded-lg object-contain"
              />
            )}
          </div>
        )}

        {uploading ? (
          <div className="flex items-center gap-2 text-sm text-forest font-medium">
            <svg className="animate-spin h-4 w-4 text-forest" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {progress ?? "Uploading…"}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M16.88 9.94A5 5 0 0010 5a5 5 0 00-4.9 4.06A4 4 0 106 17h10a4 4 0 00.88-7.06z" />
                <path d="M10 11v4m-2-2l2-2 2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span>
                {hasValue ? "Replace file" : "Click or drag & drop to upload"}
              </span>
            </div>
            <p className="text-xs text-gray-400">{ACCEPT_LABEL[accept]}</p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* URL fallback input */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs text-gray-400 shrink-0">or paste a URL</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest transition-colors bg-white"
      />
    </div>
  );
}
