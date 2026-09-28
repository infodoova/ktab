import React, { useMemo } from "react";
import { marked } from "marked";
import { sanitizeHtml } from "@/lib/sanitize";
import { cleanLlmJsonAnswer } from "../../../services/talkToBookService";
import "./TalkToBookMessageContent.css";

// Configure standard GitHub-flavored markdown with soft break conversion
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Pre-processes raw AI response text before markdown compilation:
 * 1. Strips any raw or truncated JSON wrapper keys (e.g. `{"answer": ...}`) and unescapes literal `\n`
 * 2. Converts Arabic ordinals and section titles at line beginnings into structured headings (###)
 * 3. Normalizes numeric list markers ("1- " or "1) ") into standard markdown ("1. ")
 * 4. Normalizes unicode bullet characters (•, ▪, ◆) into markdown ("- ")
 * 5. Guarantees preceding blank lines before lists so Marked constructs proper HTML <ul> and <ol>
 * 6. Converts page citations [صفحة 15] or [ص 15] into interactive page chips
 * 7. Converts numbered citations [1]...[99] into superscript reference pills
 * 8. Wraps book quotes and titles inside «...» with an editorial quote span
 *
 * @param {string} rawText
 * @returns {string}
 */
function prepareMarkdownSource(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  // 1. Strip raw or truncated JSON envelopes (e.g., `{"answer": "..."}`) and unescape literal backslashes
  const cleanedPayload = cleanLlmJsonAnswer(rawText);
  let processed = cleanedPayload.answer || rawText;

  // 2. Normalize heading markers missing whitespace (common in Arabic LLM outputs: "#عنوان" -> "# عنوان")
  processed = processed.replace(/(^|\n)(#{1,6})([^\s#])/g, "$1$2 $3");

  // 3. Convert Arabic ordinals and section headers at line starts into structured markdown headings (###)
  const arabicOrdinals =
    "(?:أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً|حادي عشر|ثاني عشر|المحور الأول|المحور الثاني|المحور الثالث|المحور الرابع|المحور الخامس|الخلاصة المكثفة|الخلاصة|خاتمة|استنتاج)";
  const ordinalRegex = new RegExp(
    "(^|\\n)(" + arabicOrdinals + ")(?:[:\\t \\-–]+([^\\n]+))?",
    "g"
  );
  processed = processed.replace(ordinalRegex, (m, prefix, ord, title) => {
    const headingText = title && title.trim() ? `${ord}: ${title.trim()}` : ord;
    return `${prefix}\n\n### ${headingText}\n\n`;
  });

  // 4. Normalize numbered list variations: "1- " or "1) " into standard markdown "1. "
  processed = processed.replace(/(^|\n)(\d+)[-)]\s+/g, "$1$2. ");

  // 5. Convert bullet variations (•, ▪, ◆) into standard markdown "- "
  processed = processed.replace(/(^|\n)[•▪◆]\s+/g, "$1- ");

  // 6. Ensure lists have an empty line before them so Marked treats them as a <ul> / <ol>
  processed = processed.replace(/([^\n])\n([0-9]+\.|-|\*)\s+/g, "$1\n\n$2 ");

  // 7. Render inline book page citations [صفحة 15] or [ص 15] as clickable badges
  processed = processed.replace(
    /\[(?:صفحة|ص|ص\.)\s*:?\s*(\d+)\]/gi,
    '<span class="talk-to-book-inline-page" data-page="$1" title="انقر للانتقال إلى صفحة $1">صفحة $1</span>'
  );

  // 8. Render numbered citations [1]...[99] as simple non-pressable reference text
  processed = processed.replace(
    /(?<!\[)\[(\d{1,2})\](?!\]|\()/g,
    '<span class="talk-to-book-inline-ref">[$1]</span>'
  );

  // 9. Style book titles and direct quotations inside «...» with an editorial quote span
  processed = processed.replace(
    /«([^»]+)»/g,
    '<span class="talk-to-book-inline-quote">«$1»</span>'
  );

  return processed;
}

/**
 * Renders rich formatted message content with full Markdown support:
 * - Bold (`**text**`), Italic (`*text*`), Bold Italic (`***text***`)
 * - Headers (`#`, `##`, `###`, `####`)
 * - Bullet lists (`*`, `-`) and numbered lists (`1.`, `2.`)
 * - Blockquotes (`>`), horizontal dividers (`---`), code blocks, and tables
 * - Inline page chips (`[صفحة X]`)
 *
 * @param {Object} props
 * @param {string} props.content - Raw message body.
 * @param {boolean} [props.isUser=false] - Whether the message originates from the user.
 * @param {Array<{ id: number, snippet?: string, page?: number | null }>} [props.citations=[]] - Citations list.
 * @param {(citation: { id?: number, snippet?: string, page?: number | null }) => void} [props.onCitationClick] - Handler for cited snippet navigation.
 * @param {(pageNumber: number) => void} [props.onPageClick] - Handler for cited page jumps.
 */
export function TalkToBookMessageContent({
  content,
  isUser = false,
  citations: _citations = [],
  onCitationClick: _onCitationClick,
  onPageClick,
}) {
  const formattedHtml = useMemo(() => {
    if (!content || typeof content !== "string") return "";
    const prepared = prepareMarkdownSource(content);
    const parsedHtml = marked.parse(prepared);
    return sanitizeHtml(parsedHtml);
  }, [content]);

  // Event delegation to catch clicks on page chips [صفحة X]
  const handleContainerClick = (e) => {
    const pageEl = e.target.closest(".talk-to-book-inline-page");
    if (pageEl && onPageClick) {
      const pageNum = parseInt(pageEl.getAttribute("data-page"), 10);
      if (!isNaN(pageNum)) {
        e.stopPropagation();
        onPageClick(pageNum);
      }
    }
  };

  if (!formattedHtml) return null;

  return (
    <div
      onClick={handleContainerClick}
      className={`talk-to-book-msg__formatted ${
        isUser
          ? "talk-to-book-msg__formatted--user"
          : "talk-to-book-msg__formatted--assistant"
      }`}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}

export default TalkToBookMessageContent;
