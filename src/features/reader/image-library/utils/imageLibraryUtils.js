/**
 * Helper utilities for Book Image Library:
 * - Direct image downloading with CORS proxy fallbacks
 * - Web Share API / Clipboard copy fallbacks
 * - Aspect ratio and artistic theme mappings
 */

/**
 * Triggers safe blob download in browser.
 */
function triggerBlobDownload(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

/**
 * Downloads image directly to reader's device.
 * Employs direct fetch, weserv.nl proxy, and canvas fallback
 * to handle cloud storage CORS headers.
 *
 * @param {string} imageUrl
 * @param {string} [filename="ktab-image.webp"]
 * @returns {Promise<boolean>}
 */
export async function downloadImageToDevice(imageUrl, filename = "ktab-image.webp") {
  if (!imageUrl) return false;

  // 1. Direct Data or Blob URL
  if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // 2. Direct simple fetch
  try {
    const res = await fetch(imageUrl, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // Direct CORS restricted, try proxy
  }

  // 3. Edge proxy fetch
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxyUrl, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // Proxy fetch failed, try canvas
  }

  // 4. HTMLCanvasElement fallback
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = proxyUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp"));
    if (blob) {
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // Canvas fallback failed
  }

  // 5. Ultimate fallback: open in new tab
  window.open(imageUrl, "_blank", "noopener,noreferrer");
  return true;
}

/**
 * Shares image via native Web Share API or falls back to copying link to clipboard.
 *
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.text
 * @param {string} options.url
 * @returns {Promise<"shared"|"copied"|"failed">}
 */
export async function shareImage({ title, text, url }) {
  if (!url) return "failed";

  if (navigator.share && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: title || "صورة كتاب من منصة كِتَاب",
        text: text || "شاهد هذه الصورة الفنية المُنشأة عبر منصة كِتَاب",
        url,
      });
      return "shared";
    } catch (err) {
      if (err.name === "AbortError") {
        return "failed";
      }
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      return "failed";
    }
  }

  return "failed";
}

/**
 * Normalizes aspect ratio key to standard CSS aspect-ratio value.
 */
export function getNormalizedRatio(ratio) {
  if (!ratio) return "3/4";
  const r = String(ratio).trim().toUpperCase();

  if (r === "3:4" || r === "PORTRAIT_3_4") return "3/4";
  if (r === "2:3" || r === "BOOK_COVER_2_3") return "2/3";
  if (r === "1:1" || r === "SQUARE_1_1") return "1/1";
  if (r === "16:9" || r === "LANDSCAPE_16_9") return "16/9";

  if (ratio.includes(":")) {
    const [w, h] = ratio.split(":");
    if (w && h) return `${w}/${h}`;
  }

  return "3/4";
}

/**
 * Localized readable label for aspect ratio.
 */
export function getRatioLabel(ratio) {
  if (!ratio) return "3:4";
  const r = String(ratio).trim().toUpperCase();

  if (r === "3:4" || r === "PORTRAIT_3_4") return "3:4 عمودي للكتب";
  if (r === "2:3" || r === "BOOK_COVER_2_3") return "2:3 غلاف كتاب";
  if (r === "1:1" || r === "SQUARE_1_1") return "1:1 مربع متوازن";
  if (r === "16:9" || r === "LANDSCAPE_16_9") return "16:9 شاشة عريضة";

  return ratio;
}

/**
 * Localized readable label for artistic themes.
 */
export function getThemeLabel(theme) {
  if (!theme) return "فن مخصص";
  const t = String(theme).trim().toUpperCase();

  switch (t) {
    case "DIGITAL_ART":
      return "فن رقمي";
    case "WATERCOLOR":
      return "ألوان مائية";
    case "REALISTIC":
      return "واقعي فوتوغرافي";
    case "FANTASY_ART":
      return "فانتازيا ملحمية";
    default:
      return theme;
  }
}

/**
 * Formats ISO date string to localized Arabic readable format.
 */
export function formatImageDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}
