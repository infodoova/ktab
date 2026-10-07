import { BookOpen } from "lucide-react";
import { TrailerPlayer } from "../TrailerPlayer/TrailerPlayer";
import "./TrailerVideoCard.css";

export function TrailerVideoCard({ book, trailer }) {
  return (
    <article className="trailer-video-card">
      <TrailerPlayer trailerId={trailer.id} poster={book.coverImageUrl} title={book.title} />
      <div className="trailer-video-card__details">
        <div className="trailer-video-card__cover">{book.coverImageUrl ? <img src={book.coverImageUrl} alt="" loading="lazy" /> : <BookOpen size={20} />}</div>
        <div className="trailer-video-card__title"><h3>{book.title}</h3><p>{book.authorName || "إعلان الكتاب"}</p></div>
        {trailer.dateLabel && <time className="trailer-video-card__date">{trailer.dateLabel}</time>}
      </div>
    </article>
  );
}
