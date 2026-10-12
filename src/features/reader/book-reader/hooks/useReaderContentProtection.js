import { useEffect } from "react";
import { AlertToast } from "@/components/myui/AlertToast";

const PROTECTED_CONTENT = ".ktab-book-display-root, .ktab-img-excerpt-box, .ktab-page-image-gen-drawer .ktab-img-selected-text";

function isProtectedNode(node) {
  const element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  return Boolean(element?.closest?.(PROTECTED_CONTENT));
}

function isReaderAction(event) {
  const selection = window.getSelection();
  // Browser menu commands can target document.body rather than the selected text.
  return isProtectedNode(event.target) ||
    (!selection?.isCollapsed && (isProtectedNode(selection?.anchorNode) || isProtectedNode(selection?.focusNode)));
}

/** Blocks ordinary clipboard and drag export without disabling image-gen selection. */
export function useReaderContentProtection() {
  useEffect(() => {
    const blockClipboard = (event) => {
      if (!isReaderAction(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      event.clipboardData?.clearData();
      event.clipboardData?.setData("text/plain", "");
      AlertToast("النسخ غير متاح داخل القارئ", "INFO");
    };
    const blockShortcut = (event) => {
      if (!(event.ctrlKey || event.metaKey) || !["c", "x"].includes(event.key.toLowerCase())) return;
      if (!isReaderAction(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      AlertToast("النسخ غير متاح داخل القارئ", "INFO");
    };
    const blockDrag = (event) => {
      if (!isReaderAction(event)) return;
      event.preventDefault();
      event.dataTransfer?.clearData();
    };
    document.addEventListener("copy", blockClipboard, true);
    document.addEventListener("cut", blockClipboard, true);
    document.addEventListener("keydown", blockShortcut, true);
    document.addEventListener("dragstart", blockDrag, true);
    return () => {
      document.removeEventListener("copy", blockClipboard, true);
      document.removeEventListener("cut", blockClipboard, true);
      document.removeEventListener("keydown", blockShortcut, true);
      document.removeEventListener("dragstart", blockDrag, true);
    };
  }, []);
}
