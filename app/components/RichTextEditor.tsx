"use client";

import { useRef } from "react";
import { parseMarkdownWithParagraphs } from "@/lib/markdown";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

type FormatToken = {
  label: string;
  syntax: string;
  placeholder: string;
  title: string;
};

const FORMATS: FormatToken[] = [
  { label: "B", syntax: "**", placeholder: "bold text", title: "Bold (**text**)" },
  { label: "I", syntax: "*", placeholder: "italic text", title: "Italic (*text*)" },
  { label: "U", syntax: "__", placeholder: "underlined text", title: "Underline (__text__)" },
];

export default function RichTextEditor({
  value,
  onChange,
  rows = 5,
  placeholder,
  className = "",
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyFormat(syntax: string, defaultPlaceholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const insertion = selected.length > 0 ? selected : defaultPlaceholder;
    const wrapped = `${syntax}${insertion}${syntax}`;

    const next = value.slice(0, start) + wrapped + value.slice(end);
    onChange(next);

    // Restore focus and selection after React re-renders
    requestAnimationFrame(() => {
      textarea.focus();
      if (selected.length > 0) {
        // Keep the inner text selected (excluding the syntax tokens)
        textarea.setSelectionRange(
          start + syntax.length,
          start + syntax.length + insertion.length
        );
      } else {
        // Select the placeholder text so the user can type over it
        textarea.setSelectionRange(
          start + syntax.length,
          start + syntax.length + insertion.length
        );
      }
    });
  }

  const previewHtml = parseMarkdownWithParagraphs(value);
  const hasFormatting = value.trim().length > 0 && (
    previewHtml !== `<p>${value}</p>` || /\n/.test(value)
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1.5 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0">
        {FORMATS.map(({ label, syntax, placeholder: ph, title }) => (
          <button
            key={syntax}
            type="button"
            title={title}
            onClick={() => applyFormat(syntax, ph)}
            className={`
              inline-flex items-center justify-center w-8 h-8 rounded text-sm font-semibold
              text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm
              transition-all border border-transparent hover:border-gray-200
              ${label === "B" ? "font-bold" : ""}
              ${label === "I" ? "italic" : ""}
              ${label === "U" ? "underline" : ""}
            `}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-gray-400 pr-1 font-medium tracking-wide">
          Markdown
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={[
          "w-full rounded-b-lg rounded-t-none border border-gray-200 px-3 py-2 text-sm text-gray-900",
          "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest",
          "transition-colors bg-white resize-none font-mono",
          className,
        ].join(" ")}
      />

      {/* Live preview — only shown when formatting syntax is present */}
      {hasFormatting && (
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 leading-relaxed">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Preview
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            className="[&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_p]:mb-3 [&_p:last-child]:mb-0"
          />
        </div>
      )}

      {/* Syntax hint */}
      <p className="text-[11px] text-gray-400 leading-snug">
        <span className="font-mono">**bold**</span>
        {" · "}
        <span className="font-mono">*italic*</span>
        {" · "}
        <span className="font-mono">__underline__</span>
      </p>
    </div>
  );
}
