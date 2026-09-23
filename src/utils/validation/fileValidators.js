/**
 * Centralized file, document, and image validation utilities for Ktab.
 * Protects against spoofed MIME types, oversized uploads, double-extension exploits,
 * and malformed image aspect ratios.
 */

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
 * Validates uploaded file MIME type and size boundaries.
 *
 * @param {File} file
 * @param {Object} [options]
 * @param {string[]} [options.allowedTypes=[]] - e.g. ['application/pdf'] or ['image/jpeg', 'image/png']
 * @param {number} [options.maxSizeBytes=50*1024*1024] - Max file size in bytes
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(
  file,
  { allowedTypes = [], maxSizeBytes = 50 * 1024 * 1024 } = {}
) {
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

  if (file.size === 0) {
    return { valid: false, error: "الملف المحدد فارغ (0 بايت)." };
  }

  return { valid: true };
}

/**
 * Validates image aspect ratio by creating an off-screen HTML Image.
 * Enforces editorial 1:1.6 ratio within allowed tolerance boundaries (1.35 to 1.85).
 *
 * @param {File} file - Image file
 * @param {number} [minRatio=1.35]
 * @param {number} [maxRatio=1.85]
 * @returns {Promise<{ isValid: boolean, ratio: number, width: number, height: number }>}
 */
export function validateImageDimensions(file, minRatio = 1.35, maxRatio = 1.85) {
  return new Promise((resolve) => {
    if (!file || typeof window === "undefined") {
      resolve({ isValid: true, ratio: 1.6, width: 0, height: 0 });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    let settled = false;

    const cleanup = () => {
      if (!settled) {
        settled = true;
        URL.revokeObjectURL(objectUrl);
      }
    };

    // Safety timeout in case image loading stalls
    const timer = setTimeout(() => {
      cleanup();
      resolve({ isValid: true, ratio: 1.6, width: 0, height: 0 });
    }, 4000);

    img.onload = () => {
      clearTimeout(timer);
      const { naturalWidth, naturalHeight } = img;
      const ratio = naturalHeight / naturalWidth;
      const isValid = ratio >= minRatio && ratio <= maxRatio;
      cleanup();
      resolve({ isValid, ratio, width: naturalWidth, height: naturalHeight });
    };

    img.onerror = () => {
      clearTimeout(timer);
      cleanup();
      resolve({ isValid: false, ratio: 0, width: 0, height: 0 });
    };

    img.src = objectUrl;
  });
}

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
export async function validateSecureBookDocument(
  file,
  { maxSizeBytes = 100 * 1024 * 1024 } = {}
) {
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

  // 3. Extension extraction and format validation
  const parts = rawName.split(".").filter(Boolean);
  if (parts.length < 2) {
    return {
      valid: false,
      error: "الملف لا يحتوي على امتداد صالح (مطلوب ملف PDF بصيغة .pdf).",
    };
  }

  const finalExt = parts[parts.length - 1].toLowerCase().trim();
  const allowedExts = ["pdf"];

  if (!allowedExts.includes(finalExt)) {
    return {
      valid: false,
      error: `امتداد الملف (.${finalExt}) غير مدعوم. الصيغة المقبولة للكتاب هي ملف PDF (.pdf) فقط.`,
    };
  }

  // 4. Double-extension attack check
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].toLowerCase().trim();
    if (DANGEROUS_EXTENSIONS.has(part)) {
      return {
        valid: false,
        error: `تم رفض الملف لأسباب أمنية (اسم الملف يحتوي على امتداد مشبوه: .${part}).`,
      };
    }
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
      // PDF header begins with %PDF (0x25, 0x50, 0x44, 0x46)
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
  } catch (err) {
    return { valid: false, error: "تعذر قراءة بيانات الملف للتحقق الأمني." };
  }

  return { valid: true, fileType: "pdf", extension: finalExt };
}

/**
 * Convenient all-in-one validator for book cover images.
 * Validates existence, MIME type, file size, and 1:1.6 aspect ratio.
 *
 * @param {File} file
 * @param {Object} [options]
 * @param {number} [options.maxSizeBytes=10*1024*1024] - 10MB
 * @param {number} [options.minRatio=1.35]
 * @param {number} [options.maxRatio=1.85]
 * @returns {Promise<{ valid: boolean, error?: string, width?: number, height?: number, ratio?: number }>}
 */
export async function validateCoverImage(
  file,
  {
    maxSizeBytes = 10 * 1024 * 1024,
    minRatio = 1.35,
    maxRatio = 1.85,
  } = {}
) {
  const fileCheck = validateFile(file, {
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSizeBytes,
  });

  if (!fileCheck.valid) {
    return fileCheck;
  }

  const dimCheck = await validateImageDimensions(file, minRatio, maxRatio);
  if (!dimCheck.isValid) {
    return {
      valid: false,
      error: `يجب أن تكون نسبة غلاف الكتاب 1:1.6 تقريباً (المسموح بين ${minRatio.toFixed(2)} و ${maxRatio.toFixed(2)}). أبعاد صورتك: ${dimCheck.width}×${dimCheck.height}.`,
      ...dimCheck,
    };
  }

  return { valid: true, ...dimCheck };
}
