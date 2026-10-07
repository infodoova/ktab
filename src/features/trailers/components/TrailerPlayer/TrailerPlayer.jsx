import { Play, Download, Loader2, RotateCcw } from "lucide-react";
import { useTrailerPlayer } from "../../hooks/useTrailerPlayer";
import "./TrailerPlayer.css";

export function TrailerPlayer({ trailerId, directUrl, readerBookId, poster, title = "إعلان الكتاب", showDownloads = true }) {
  const player = useTrailerPlayer({ trailerId, directUrl, readerBookId });
  return (
    <div className="trailer-player">
      {!player.opened ? (
        <button type="button" className="trailer-player__open" onClick={player.handleOpen} aria-label={`مشاهدة إعلان ${title}`}>
          {poster && <img src={poster} alt="" className="trailer-player__poster" loading="lazy" />}
          <span className="trailer-player__play"><Play size={24} fill="currentColor" /></span>
          <span className="trailer-player__open-label">مشاهدة الإعلان</span>
        </button>
      ) : player.loading ? (
        <div className="trailer-player__loading" role="status">
          <Loader2 className="trailer-spinner" size={26} />
          <span>جاري تجهيز الفيديو للمشاهدة...</span>
        </div>
      ) : player.links && !player.error ? (
        <video className="trailer-player__video" src={player.links.video} poster={poster} controls controlsList={showDownloads ? undefined : "nodownload"} playsInline preload="metadata" onError={player.handleVideoError} aria-label={`إعلان ${title}`} />
      ) : null}
      {player.error && (
        <div className="trailer-player__error" role="alert">
          <p>{player.error}</p>
          <button type="button" onClick={player.handleRetry}><RotateCcw size={15} /> إعادة تحميل الفيديو</button>
        </div>
      )}
      {player.downloadError && <p className="trailer-player__error" role="alert">{player.downloadError}</p>}
      {showDownloads && player.links && !player.loading && (
        <div className="trailer-player__downloads">
          <button type="button" data-kind="video" onClick={player.handleDownload} disabled={player.downloading}><Download size={14} /> تحميل الفيديو</button>
          {player.links.captions && <button type="button" data-kind="captions" onClick={player.handleDownload} disabled={player.downloading}>ملف الترجمة</button>}
          {player.downloading && <Loader2 className="trailer-spinner" size={15} aria-label="جاري التحميل" />}
        </div>
      )}
    </div>
  );
}
