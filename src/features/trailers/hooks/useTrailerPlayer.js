import { useCallback, useEffect, useRef, useState } from "react";
import { trailerService } from "../services/trailerService";
import { safeMediaUrl } from "../utils/trailerUtils";

export function useTrailerPlayer({ trailerId, directUrl, readerBookId }) {
  const [opened, setOpened] = useState(false);
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const downloadLock = useRef(false);
  const [downloading, setDownloading] = useState(false);
  const requestId = useRef(0);
  const refreshAttempts = useRef(0);
  const opening = useRef(false);

  useEffect(() => {
    requestId.current++;
    opening.current = false;
    refreshAttempts.current = 0;
    setOpened(false);
    setLinks(null);
    setError("");
    setLoading(false);
    setDownloadError("");
    setDownloading(false);
    downloadLock.current = false;
    const requestCounter = requestId;
    return () => { requestCounter.current++; };
  }, [trailerId, directUrl, readerBookId]);

  const fetchLinks = useCallback(async () => {
    // Links stay in this player's memory only; reopening fetches fresh signed URLs.
    const data = readerBookId != null ? await trailerService.readerDownload(readerBookId)
      : trailerId != null ? await trailerService.download(trailerId) : { video: directUrl };
    const cleanVideo = safeMediaUrl(data?.videoClean) || safeMediaUrl(data?.video);
    const normalized = {
      video: cleanVideo,
      videoClean: cleanVideo,
      captions: safeMediaUrl(data?.captions),
    };
    if (!normalized.video) throw new Error("الفيديو غير متاح حالياً. يرجى المحاولة مجددًا.");
    return normalized;
  }, [trailerId, directUrl, readerBookId]);

  const handleOpen = useCallback(async () => {
    if (opening.current) return;
    opening.current = true;
    const request = ++requestId.current;
    setOpened(true);
    setLoading(true);
    setError("");
    try {
      const data = await fetchLinks();
      if (request === requestId.current) setLinks(data);
    } catch (err) {
      if (request === requestId.current) setError(err.message);
    } finally {
      if (request === requestId.current) { setLoading(false); opening.current = false; }
    }
  }, [fetchLinks]);

  const handleVideoError = useCallback(() => {
    if ((trailerId != null || readerBookId != null) && refreshAttempts.current < 1) {
      refreshAttempts.current++;
      handleOpen();
    } else setError("تعذر تشغيل الفيديو. أعد تحميله للمحاولة مجددًا.");
  }, [trailerId, readerBookId, handleOpen]);

  const handleRetry = useCallback(() => {
    refreshAttempts.current = 0;
    handleOpen();
  }, [handleOpen]);

  const handleDownload = useCallback(async (event) => {
    const kind = event.currentTarget.dataset.kind;
    if (downloadLock.current) return;
    downloadLock.current = true;
    const request = requestId.current;
    // Open inside the tap event so iPhone popup policies don't block an async download.
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    setDownloading(true);
    setDownloadError("");
    try {
      const fresh = await fetchLinks();
      if (request !== requestId.current) { tab?.close(); return; }
      const url = fresh[kind];
      if (!url) throw new Error("هذا الملف غير متاح للتحميل.");
      if (tab) tab.location.href = url;
      else {
        setDownloadError("يرجى السماح بفتح نافذة التحميل ثم المحاولة مجددًا.");
      }
    } catch (err) {
      tab?.close();
      if (request === requestId.current) setDownloadError(err.message);
    } finally {
      if (request === requestId.current) { setDownloading(false); downloadLock.current = false; }
    }
  }, [fetchLinks]);

  return { opened, links, loading, error, downloadError, downloading, handleOpen, handleRetry, handleVideoError, handleDownload };
}
