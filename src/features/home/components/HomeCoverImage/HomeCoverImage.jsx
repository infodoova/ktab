import { BookOpen } from "lucide-react";
import { useHomeCoverImage } from "../../hooks/useHomeCoverImage";
import "./HomeCoverImage.css";

export default function HomeCoverImage({ src, loading = "lazy", onImageError }) {
  const { isLoaded, hasFailed, handleLoad, handleError } = useHomeCoverImage(src, onImageError);
  return (
    <div className={`home-cover-image ${isLoaded ? "is-loaded" : ""}`} aria-busy={!isLoaded && !hasFailed}>
      {!isLoaded && !hasFailed && <div className="home-cover-skeleton" aria-hidden="true" />}
      {src && !hasFailed && (
        <img src={src} alt="غلاف كتاب" loading={loading} decoding="async" onLoad={handleLoad} onError={handleError} />
      )}
      {hasFailed && (
        <div className="home-cover-unavailable" role="img" aria-label="تعذر تحميل الغلاف">
          <BookOpen size={28} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
