import React, { useState, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import "./SceneArtwork.css";

/**
 * Scene artwork image with loading skeleton, error state, and zoom-in overlay.
 * @param {string} image - URL of the current scene's artwork
 * @param {(url: string) => void} onImageClick - Handler to open full-screen preview
 * @param {boolean} isGenerating - Whether a new scene is currently being generated
 */
export function SceneArtwork({ image, onImageClick, isGenerating }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [image]);

  const showSkeleton = isGenerating || (!loaded && !error);

  return (
    <div className="scene-artwork" onClick={() => onImageClick?.(image)}>
      {showSkeleton && (
        <div className="scene-artwork__skeleton">
          <div className="scene-artwork__spinner" />
        </div>
      )}

      {error && (
        <div className="scene-artwork__error">
          <span className="scene-artwork__error-icon">🖼️</span>
          <span className="scene-artwork__error-text">تعذر تحميل الصورة</span>
        </div>
      )}

      <img
        src={image}
        alt="Scene artwork"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`scene-artwork__image ${
          loaded ? "scene-artwork__image--loaded" : "scene-artwork__image--loading"
        }`}
      />

      <div className="scene-artwork__gradient" />

      <div className="scene-artwork__zoom-overlay">
        <div className="scene-artwork__zoom-icon">
          <ZoomIn size={20} />
        </div>
      </div>
    </div>
  );
}

export default SceneArtwork;
