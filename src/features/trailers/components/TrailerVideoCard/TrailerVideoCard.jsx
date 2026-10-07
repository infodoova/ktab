import { BookOpen } from "lucide-react";
import { TrailerPlayer } from "../TrailerPlayer/TrailerPlayer";
import { TrailerStatusBadge } from "../TrailerStatusBadge/TrailerStatusBadge";
import "./TrailerVideoCard.css";

export function TrailerVideoCard({ book, trailer }) {
  return (
    <article className="trailer-video-card" aria-label={`إعلان كتاب ${book.title}`}>
      <div className="trailer-video-card__media">
        <TrailerPlayer
          trailerId={trailer.id}
          poster={book.coverImageUrl}
          title={book.title}
        />
      </div>

      <div className="trailer-video-card__badges">
        <TrailerStatusBadge status={trailer.status} size="sm" />
      </div>

      <div className="trailer-video-card__details">
        <div className="trailer-video-card__cover">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt="" loading="lazy" />
          ) : (
            <BookOpen size={20} />
          )}
        </div>
        <div className="trailer-video-card__title">
          <h3>{book.title}</h3>
          <p>{book.authorName || "إعلان الكتاب"}</p>
        </div>
        {trailer.dateLabel && (
          <time className="trailer-video-card__date">{trailer.dateLabel}</time>
        )}
      </div>
    </article>
  );
}

export default TrailerVideoCard;
