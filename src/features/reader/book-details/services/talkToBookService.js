import { postHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const RAW_API_BASE = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/api/v1") ? RAW_API_BASE : `${RAW_API_BASE}/api/v1`)
  : "/api/v1";

/**
 * Extracts and sanitizes clean conversational text and citation metadata from LLM output.
 * Handles:
 * 1. Valid JSON strings (e.g. `{"answer": "...", "citations": [...]}`)
 * 2. Truncated or unterminated JSON (when LLM generation reaches token limits before closing braces)
 * 3. Markdown code fences (e.g. ````json ... ````)
 * 4. Literal escaped character sequences (`\n`, `\r\n`, `\t`, `\"`) in unparsed JSON text
 * 5. Structured object payloads where `answer` is nested or stringified
 *
 * @param {any} raw - Raw API response, envelope, or answer string
 * @returns {{ answer: string, citations: Array, citedPages: Array }}
 */
export function cleanLlmJsonAnswer(raw) {
  if (!raw) return { answer: "", citations: [], citedPages: [] };

  let text = "";
  let citations = [];
  let citedPages = [];

  if (typeof raw === "object" && raw !== null) {
    if (Array.isArray(raw.citations)) citations = raw.citations;
    if (Array.isArray(raw.citedPages)) citedPages = raw.citedPages;

    if (typeof raw.answer === "string") {
      text = raw.answer.trim();
    } else if (typeof raw.data === "string") {
      text = raw.data.trim();
    } else if (raw.data && typeof raw.data === "object") {
      if (typeof raw.data.answer === "string") text = raw.data.answer.trim();
      if (Array.isArray(raw.data.citations) && citations.length === 0) citations = raw.data.citations;
      if (Array.isArray(raw.data.citedPages) && citedPages.length === 0) citedPages = raw.data.citedPages;
    } else if (typeof raw.content === "string") {
      text = raw.content.trim();
    }
  } else if (typeof raw === "string") {
    text = raw.trim();
  }

  // Strip markdown code fences if wrapped in ```json ... ``` or ``` ... ```
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Parse if string begins with JSON object or array notation
  if (text.startsWith("{") || text.startsWith("[")) {
    let parsedSuccessfully = false;
    try {
      const parsed = JSON.parse(text);
      parsedSuccessfully = true;
      if (parsed && typeof parsed === "object") {
        if (typeof parsed.answer === "string") text = parsed.answer;
        else if (typeof parsed.content === "string") text = parsed.content;
        else if (typeof parsed.text === "string") text = parsed.text;

        if (Array.isArray(parsed.citations) && citations.length === 0) {
          citations = parsed.citations;
        }
        if (Array.isArray(parsed.citedPages) && citedPages.length === 0) {
          citedPages = parsed.citedPages;
        }
      }
    } catch {
      parsedSuccessfully = false;
    }

    // Fallback for truncated or unterminated JSON (e.g. LLM output exceeding max token boundary)
    if (!parsedSuccessfully) {
      const answerRegex = /(?:"answer"|'answer'|answer)\s*:\s*"?/i;
      const match = text.match(answerRegex);
      if (match) {
        let remainder = text.substring(match.index + match[0].length);
        if (remainder.startsWith('"')) remainder = remainder.substring(1);

        // Find unescaped quote followed by comma/brace or end of string
        let endIdx = -1;
        for (let i = 0; i < remainder.length; i++) {
          if (remainder[i] === '"' && (i === 0 || remainder[i - 1] !== "\\")) {
            const afterQuote = remainder.substring(i + 1).trim();
            if (afterQuote.length === 0 || afterQuote.startsWith(",") || afterQuote.startsWith("}")) {
              endIdx = i;
              break;
            }
          }
        }

        if (endIdx !== -1) {
          text = remainder.substring(0, endIdx);
        } else {
          // Unterminated string: strip trailing unclosed JSON syntax
          text = remainder.replace(/"?\s*\}?\s*$/, "");
        }
      } else {
        text = text.replace(/^\{\s*/, "").replace(/\s*\}?$/, "");
      }
    }
  }

  // Unescape literal backslash escapes: \n, \r\n, \t, \"
  if (/\\r\\n|\\n|\\t|\\"/.test(text)) {
    text = text
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"');
  }

  return {
    answer: text.trim(),
    citations,
    citedPages,
  };
}

/**
 * Submits a question about a specific book to the Talk-to-Book AI agent.
 * Matches endpoint: POST /api/v1/books/{bookId}/talk
 *
 * @param {string|number} bookId - Target book database identifier.
 * @param {string} question - Inquired prompt (length: 3 to 350 characters).
 * @returns {Promise<{
 *   question: string,
 *   answer: string,
 *   citations?: Array<{ id: number, snippet: string, page: number | null }>,
 *   citedPages: number[],
 *   cached: boolean,
 *   source: 'INTERNAL_RAG' | 'WEB_AUGMENTED' | 'CACHED' | 'REJECTED_OFF_TOPIC',
 *   hitCount: number
 * }>}
 */
export async function askBookQuestion(bookId, question) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const cleanQuestion = typeof question === "string" ? question.trim() : "";

  const response = await postHelper({
    url: `${API_BASE}/books/${safeId}/talk`,
    body: {
      question: cleanQuestion,
    },
    headers: {
      "Accept-Language": "ar",
    },
  });

  const statusCode =
    typeof response?.statusCode === "number"
      ? response.statusCode
      : typeof response?.status === "number"
      ? response.status
      : response?.status === "OK" || response?.success === true || response?.messageStatus === "SUCCESS"
      ? 200
      : response?.status === "BAD_REQUEST"
      ? 400
      : response?.status === "NOT_FOUND"
      ? 404
      : response?.status === "TOO_MANY_REQUESTS"
      ? 429
      : response?.status === "BAD_GATEWAY" || response?.status === 502
      ? 502
      : 500;

  const isSuccess =
    (statusCode >= 200 && statusCode < 300) ||
    response?.success === true ||
    response?.messageStatus === "SUCCESS" ||
    response?.status === "OK";

  // Check for successful envelope status code and data payload
  if (isSuccess && (response?.data || response?.answer)) {
    const rawPayload = response?.data || response;
    const cleaned = cleanLlmJsonAnswer(rawPayload);

    return {
      question: cleanQuestion,
      answer: cleaned.answer,
      citations:
        cleaned.citations.length > 0
          ? cleaned.citations
          : Array.isArray(rawPayload?.citations)
          ? rawPayload.citations
          : [],
      citedPages:
        cleaned.citedPages.length > 0
          ? cleaned.citedPages
          : Array.isArray(rawPayload?.citedPages)
          ? rawPayload.citedPages
          : [],
      cached: Boolean(rawPayload?.cached || rawPayload?.isCached),
      source: rawPayload?.source || "INTERNAL_RAG",
      hitCount: typeof rawPayload?.hitCount === "number" ? rawPayload?.hitCount : 0,
    };
  }

  // Handle Citation Validation Failure / Bad Gateway (HTTP 502)
  if (
    statusCode === 502 ||
    response?.statusCode === 502 ||
    response?.status === 502 ||
    response?.status === "BAD_GATEWAY" ||
    response?.error === "BAD_GATEWAY" ||
    response?.error === "Bad Gateway" ||
    response?.error === "INVALID_BOOK_CITATIONS" ||
    (typeof response?.message === "string" &&
      (response.message.includes("Invalid citation") ||
       response.message.includes("InvalidBookCitationsException") ||
       response.message.includes("502")))
  ) {
    const error = new Error(
      "تعذر توثيق الاقتباسات من صفحات الكتاب بدقة، يرجى إعادة صياغة السؤال."
    );
    error.status = 502;
    error.code = "INVALID_BOOK_CITATIONS";
    throw error;
  }

  // Handle Rate Limiting (HTTP 429)
  if (
    statusCode === 429 ||
    response?.error === "RATE_LIMIT_EXCEEDED" ||
    response?.status === "TOO_MANY_REQUESTS"
  ) {
    const error = new Error(
      response?.message || "لقد تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة لاحقاً."
    );
    error.status = 429;
    error.code = "RATE_LIMIT_EXCEEDED";
    throw error;
  }

  // Handle Client Validation Errors (HTTP 400)
  if (
    statusCode === 400 ||
    response?.error === "VALIDATION_ERROR" ||
    response?.status === "BAD_REQUEST"
  ) {
    const message =
      response?.errors?.question ||
      response?.message ||
      "يجب ألا يتجاوز السؤال 350 حرفًا ولا يقل عن 3 أحرف.";
    const error = new Error(message);
    error.status = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  // Handle Book Not Found (HTTP 404)
  if (
    statusCode === 404 ||
    response?.error === "NOT_FOUND" ||
    response?.status === "NOT_FOUND"
  ) {
    const error = new Error(response?.message || "الكتاب غير موجود.");
    error.status = 404;
    error.code = "NOT_FOUND";
    throw error;
  }

  // Fallback for general server errors
  const fallbackMessage =
    response?.message || "تعذر إكمال الاستعلام حالياً. يرجى إعادة المحاولة.";
  const genericError = new Error(fallbackMessage);
  genericError.status = statusCode || 500;
  throw genericError;
}
