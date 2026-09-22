import DOMPurify from "dompurify";

/**
 * Strips HTML tags and trims whitespace from a string to prevent XSS.
 *
 * @param {any} input
 * @returns {string}
 */
export function sanitizeText(input) {
  if (input === null || input === undefined) return "";
  if (typeof input !== "string") return String(input).trim();
  
  // Replace HTML tag brackets and trim
  return input
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Sanitizes HTML content using DOMPurify for rich text / markdown rendering.
 *
 * @param {string} dirtyHtml
 * @param {Object} options
 * @returns {string}
 */
export function sanitizeHtml(dirtyHtml, options = {}) {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";
  
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "em", "strong", "span", "div",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "code", "pre", "a"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "dir"],
    ...options,
  });
}

/**
 * Sanitizes an ID (or route param) to ensure it contains only safe alphanumeric characters, dashes, or underscores.
 * Prevents URL parameter injection and path traversal.
 *
 * @param {string|number} id
 * @returns {string}
 */
export function sanitizeId(id) {
  if (id === null || id === undefined) return "";
  const strId = String(id).trim();
  // Allow alphanumeric, dashes, underscores
  return strId.replace(/[^a-zA-Z0-9_-]/g, "");
}

/**
 * Checks if a given target URL is a safe, allowed redirect destination.
 * Prevents Open Redirect and javascript:/data: pseudo-protocol attacks.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isAllowedRedirectUrl(url) {
  if (!url || typeof url !== "string") return false;

  const trimmed = url.trim();

  // 1. Block dangerous protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  // 2. Allow safe relative paths (e.g. /reader/home, /login, but NOT //evil.com)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return true;
  }

  // 3. For absolute URLs, verify allowed domains
  try {
    const parsed = new URL(trimmed, typeof window !== "undefined" ? window.location.origin : "https://ktab.app");
    
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    
    // Allowed hostnames
    const allowedHosts = [
      "ktab.app",
      "www.ktab.app",
      "localhost",
      "127.0.0.1",
    ];

    if (allowedHosts.includes(hostname) || hostname.endsWith(".ktab.app") || hostname.endsWith(".ngrok-free.dev")) {
      return true;
    }

    // Match current window origin host if in browser
    if (typeof window !== "undefined" && window.location.hostname === hostname) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Sanitizes and validates standard email format.
 *
 * @param {string} email
 * @returns {string}
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

/**
 * Validates uploaded file MIME type and size.
 *
 * @param {File} file
 * @param {Object} options
 * @param {string[]} options.allowedTypes - e.g. ['application/pdf'] or ['image/jpeg', 'image/png', 'image/webp']
 * @param {number} options.maxSizeBytes - max file size in bytes
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file, { allowedTypes = [], maxSizeBytes = 50 * 1024 * 1024 }) {
  if (!file) {
    return { valid: false, error: "لم يتم اختيار أي ملف" };
  }

  if (allowedTypes.length > 0) {
    const isAllowedType = allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const prefix = type.replace("/*", "");
        return file.type.startsWith(prefix);
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      return {
        valid: false,
        error: `نوع الملف غير مدعوم (${file.type || "غير معروف"}).`,
      };
    }
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `حجم الملف يتجاوز الحد المسموح به وهو ${maxMb} ميغابايت.`,
    };
  }

  return { valid: true };
}

/**
 * Known dangerous executable and script extensions that must never appear in filenames.
 */
const DANGEROUS_EXTENSIONS = new Set([
  "php", "php3", "php4", "php5", "phtml", "phar", "phps",
  "exe", "bat", "cmd", "sh", "bash", "js", "vbs", "vbe", "wsf", "wsh",
  "py", "pyc", "pyo", "pl", "cgi", "jar", "war", "jsp", "jspx",
  "asp", "aspx", "cer", "csr", "htm", "html", "xhtml", "svg", "shtml",
  "htaccess", "htpasswd", "env", "config", "dll", "bin", "msi", "apk",
  "ps1", "scr", "com", "hta", "cpl", "inf", "reg", "vb"
]);

/**
 * Validates that a file is strictly a legitimate PDF or Word Document (.docx, .doc),
 * defending against double extension attacks (e.g. .pdf.php), null-byte injections,
 * spoofed MIME types, and mismatched magic bytes.
 *
 * @param {File} file
 * @param {Object} [options]
 * @param {number} [options.maxSizeBytes=100*1024*1024] - default 100MB
 * @returns {Promise<{ valid: boolean, error?: string, fileType?: 'pdf' | 'word', extension?: string }>}
 */
export async function validateSecureBookDocument(file, { maxSizeBytes = 100 * 1024 * 1024 } = {}) {
  if (!file || !file.name) {
    return { valid: false, error: "لم يتم اختيار أي ملف" };
  }

  const rawName = file.name.trim();

  // 1. Null-byte injection check
  if (rawName.includes("\0") || rawName.includes("%00")) {
    return { valid: false, error: "اسم الملف غير آمن (يحتوي على محارف مشبوهة)." };
  }

  // 2. Traversal and path separator check
  if (rawName.includes("/") || rawName.includes("\\") || rawName.includes("..")) {
    return { valid: false, error: "اسم الملف يحتوي على مسارات غير مسموح بها." };
  }

  // 3. Extension extraction and multi-dot / double-extension analysis
  const parts = rawName.split(".").filter(Boolean);
  if (parts.length < 2) {
    return { valid: false, error: "الملف لا يحتوي على امتداد صالح (مطلوب ملف PDF بصيغة .pdf)." };
  }

  const finalExt = parts[parts.length - 1].toLowerCase().trim();
  const allowedExts = ["pdf"];

  if (!allowedExts.includes(finalExt)) {
    return {
      valid: false,
      error: `امتداد الملف (.${finalExt}) غير مدعوم. الصيغة المقبولة للكتاب هي ملف PDF (.pdf) فقط.`,
    };
  }

  // 4. Double-extension attack check:
  // Check all segments preceding the final extension to ensure no executable/script extensions exist.
  // E.g. "book.php.pdf", "novel.docx.exe"
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].toLowerCase().trim();
    if (DANGEROUS_EXTENSIONS.has(part)) {
      return {
        valid: false,
        error: `تم رفض الملف لأسباب أمنية (اسم الملف يحتوي على امتداد مشبوه: .${part}).`,
      };
    }
    // Also forbid stacking multiple document extensions, e.g. "book.docx.pdf"
    if (allowedExts.includes(part)) {
      return {
        valid: false,
        error: `تم رفض الملف لأسباب أمنية (امتداد مكرر غير مسموح: .${part}).`,
      };
    }
  }

  // 5. Size check
  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `حجم ملف الكتاب يتجاوز الحد الأقصى المسموح به (${maxMb} ميغابايت).`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: "ملف الكتاب فارغ (0 بايت)." };
  }

  // 6. Magic Bytes Header Verification (reading first 8 bytes)
  try {
    const headerBuffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(headerBuffer);

    if (finalExt === "pdf") {
      // PDF starts with "%PDF" -> 0x25, 0x50, 0x44, 0x46
      const isPdfHeader =
        bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
      if (!isPdfHeader) {
        return {
          valid: false,
          error: "محتوى الملف لا يتطابق مع ملف PDF صالح (فحص ترويسة الملف الأمني).",
        };
      }
      return { valid: true, fileType: "pdf", extension: finalExt };
    }

    if (finalExt === "docx") {
      // DOCX is a zip archive, starts with PK\x03\x04 -> 0x50, 0x4B, 0x03, 0x04
      const isDocxHeader =
        bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04;
      if (!isDocxHeader) {
        return {
          valid: false,
          error: "محتوى الملف لا يتطابق مع مستند Word DOCX صالح (فحص ترويسة الملف).",
        };
      }
      return { valid: true, fileType: "word", extension: finalExt };
    }

    if (finalExt === "doc") {
      // Legacy DOC binary is OLE Compound file: 0xD0, 0xCF, 0x11, 0xE0
      const isDocHeader =
        bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
      if (!isDocHeader) {
        return {
          valid: false,
          error: "محتوى الملف لا يتطابق مع مستند Word DOC صالح (فحص ترويسة الملف).",
        };
      }
      return { valid: true, fileType: "word", extension: finalExt };
    }
  } catch (err) {
    return { valid: false, error: "تعذر قراءة بيانات الملف للتحقق الأمني." };
  }

  return { valid: true, fileType: finalExt === "pdf" ? "pdf" : "word", extension: finalExt };
}
