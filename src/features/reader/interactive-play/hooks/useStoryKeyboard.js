import { useEffect } from "react";

/**
 * Dedicated custom hook for keyboard navigation and controls in Interactive Story Player.
 * - ArrowRight / ArrowUp: Go to previous scene (in RTL reading direction, previous is to the right)
 * - ArrowLeft / ArrowDown: Go to next scene (in RTL reading direction, next is to the left)
 * - Keys 1-4, A-D (a-d / أ-د): Select choice options A, B, C, D on active scene
 * - Escape: Close preview image modal
 *
 * @param {Object} params
 * @param {boolean} params.canGoPrev
 * @param {boolean} params.canGoNext
 * @param {() => void} params.onGoPrev
 * @param {() => void} params.onGoNext
 * @param {Array} params.nodes
 * @param {(node: Object) => void} params.onSelectChoice
 * @param {boolean} params.isCurrentActive
 * @param {boolean} params.isGenerating
 * @param {string|null} params.previewImage
 * @param {() => void} params.onClosePreview
 */
export function useStoryKeyboard({
  canGoPrev,
  canGoNext,
  onGoPrev,
  onGoNext,
  nodes = [],
  onSelectChoice,
  isCurrentActive,
  isGenerating,
  previewImage,
  onClosePreview,
  isChoicesSheetOpen,
  onCloseChoicesSheet,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not trigger shortcuts when focus is inside text input, textarea, or contentEditable
      const targetTag = e.target?.tagName?.toLowerCase();
      if (
        targetTag === "input" ||
        targetTag === "textarea" ||
        e.target?.isContentEditable
      ) {
        return;
      }

      // Close modal preview or choices bottom sheet on Escape
      if (e.key === "Escape") {
        if (previewImage) {
          e.preventDefault();
          onClosePreview?.();
          return;
        }
        if (isChoicesSheetOpen) {
          e.preventDefault();
          onCloseChoicesSheet?.();
          return;
        }
        return;
      }

      // Scene navigation via Arrow keys (RTL: Right = previous scene, Left = next scene)
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        if (canGoPrev && !isGenerating) {
          e.preventDefault();
          onGoPrev?.();
        }
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        if (canGoNext && !isGenerating) {
          e.preventDefault();
          onGoNext?.();
        }
        return;
      }

      // Choice selection via keys 1-4 or letters A-D / a-d / أ-د
      if (isCurrentActive && !isGenerating && nodes.length > 0) {
        let choiceIndex = -1;

        if (e.key === "1" || e.key === "a" || e.key === "A" || e.key === "أ") {
          choiceIndex = 0;
        } else if (e.key === "2" || e.key === "b" || e.key === "B" || e.key === "ب") {
          choiceIndex = 1;
        } else if (e.key === "3" || e.key === "c" || e.key === "C" || e.key === "ج") {
          choiceIndex = 2;
        } else if (e.key === "4" || e.key === "d" || e.key === "D" || e.key === "د") {
          choiceIndex = 3;
        }

        if (choiceIndex >= 0 && choiceIndex < nodes.length) {
          e.preventDefault();
          onSelectChoice?.(nodes[choiceIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    canGoPrev,
    canGoNext,
    onGoPrev,
    onGoNext,
    nodes,
    onSelectChoice,
    isCurrentActive,
    isGenerating,
    previewImage,
    onClosePreview,
    isChoicesSheetOpen,
    onCloseChoicesSheet,
  ]);
}

export default useStoryKeyboard;
