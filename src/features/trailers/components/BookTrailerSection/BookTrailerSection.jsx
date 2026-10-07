import { Film } from "lucide-react";
import { useBookTrailerSection } from "../../hooks/useBookTrailerSection";
import { TrailerPlayer } from "../TrailerPlayer/TrailerPlayer";
import "./BookTrailerSection.css";

export function BookTrailerSection({ bookId, title, poster, enabled = true, readerMode = false }) {
  const trailer = useBookTrailerSection({ bookId, enabled, readerMode });
  if (!trailer.visible) return null;
  return <section className="book-trailer-section" dir="rtl" aria-label="الإعلان المرئي للكتاب"><h2><Film size={20} strokeWidth={1.5} /> إعلان الكتاب</h2><TrailerPlayer key={trailer.trailerId || bookId} trailerId={trailer.trailerId} directUrl={trailer.directUrl} readerBookId={trailer.readerBookId} poster={poster} title={title} showDownloads={!readerMode} /></section>;
}
