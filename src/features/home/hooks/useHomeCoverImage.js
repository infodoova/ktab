import { useCallback, useState } from "react";

export function useHomeCoverImage(src, onImageError) {
  const [imageState, setImageState] = useState(null);
  const isLoaded = Boolean(src && imageState?.src === src && imageState.loaded);
  const hasFailed = Boolean(src && imageState?.src === src && imageState.failed);
  const handleLoad = useCallback(() => {
    setImageState({ src, loaded: true, failed: false });
  }, [src]);
  const handleError = useCallback(() => {
    setImageState({ src, loaded: false, failed: true });
    onImageError?.();
  }, [src, onImageError]);
  return { isLoaded, hasFailed, handleLoad, handleError };
}
