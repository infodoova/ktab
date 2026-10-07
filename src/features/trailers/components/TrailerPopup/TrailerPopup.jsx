import { useEffect, useRef } from "react";
import { BottomSheet, Modal } from "@/components/myui";
import { useTrailerPopupMode } from "../../hooks/useTrailerPopupMode";
import "./TrailerPopup.css";

export function TrailerPopup({ open, onClose, onClosed, title, description, children, className = "" }) {
  const isMobile = useTrailerPopupMode();
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) onClosed?.();
    wasOpen.current = open;
  }, [open, onClosed]);
  if (isMobile) {
    return <BottomSheet isOpen={open} onClose={onClose} title={title} description={description} className={`trailer-popup ${className}`} maxHeight="90dvh">{children}</BottomSheet>;
  }
  return <Modal isOpen={open} onClose={onClose} title={title} description={description} maxWidth="max-w-lg" className={`trailer-popup ${className}`}>{children}</Modal>;
}
