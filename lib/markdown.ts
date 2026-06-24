/**
 * Parses a limited subset of markdown formatting into HTML.
 *
 * Supported syntax:
 *   **text**   → <strong>text</strong>
 *   *text*     → <em>text</em>
 *   __text__   → <u>text</u>
 *
 * The function is intentionally minimal — it only handles inline
 * formatting so it is safe to use on short category descriptions
 * without pulling in a full markdown parser.
 */
export function parseMarkdownFormatting(text: string): string {
  return (
    text
      // Bold: **text** → <strong>text</strong>
      // Must come before italic so ** is matched before *
      .replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>")
      // Italic: *text* → <em>text</em>
      .replace(/\*(.+?)\*/gs, "<em>$1</em>")
      // Underline: __text__ → <u>text</u>
      .replace(/__(.+?)__/gs, "<u>$1</u>")
  );
}
