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
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic: *text* → <em>text</em>
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Underline: __text__ → <u>text</u>
      .replace(/__(.+?)__/g, "<u>$1</u>")
  );
}

/**
 * Parses markdown formatting into HTML while also preserving paragraph
 * structure and line breaks.
 *
 * Supported syntax:
 *   **text**   → <strong>text</strong>
 *   *text*     → <em>text</em>
 *   __text__   → <u>text</u>
 *   \n\n       → paragraph break (</p><p>)
 *   \n         → <br> (line break within a paragraph)
 *
 * HTML is escaped before processing to prevent injection. The output
 * is wrapped in <p> tags so paragraph spacing is applied by the
 * browser's default block layout.
 */
export function parseMarkdownWithParagraphs(text: string): string {
  // Escape HTML special characters to prevent injection
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Apply inline markdown formatting
  const formatted = escaped
    // Bold: **text** → <strong>text</strong>
    // Must come before italic so ** is matched before *
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic: *text* → <em>text</em>
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Underline: __text__ → <u>text</u>
    .replace(/__(.+?)__/g, "<u>$1</u>");

  // Split on double line breaks to form paragraphs, then convert
  // single line breaks within each paragraph to <br> tags
  const paragraphs = formatted
    .split(/\n\n+/)
    .map((para) => para.replace(/\n/g, "<br>"))
    .filter((para) => para.trim().length > 0);

  return `<p>${paragraphs.join("</p><p>")}</p>`;
}
