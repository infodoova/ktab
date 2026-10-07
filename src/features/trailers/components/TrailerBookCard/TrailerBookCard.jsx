import { BookOpen, Film, Loader2, RefreshCw, Plus, Check, X, ChevronDown } from "lucide-react";
import { useTrailerBookCard } from "../../hooks/useTrailerBookCard";
import { TrailerPlayer } from "../TrailerPlayer/TrailerPlayer";
import { TrailerStatusBadge } from "../TrailerStatusBadge/TrailerStatusBadge";
import "./TrailerBookCard.css";

export function TrailerBookCard({ book, isAdmin, collection, onRequestCreate, mode = "create" }) {
  const card = useTrailerBookCard(book, isAdmin, collection, onRequestCreate, mode);

  return (
    <article className={`trailer-book-card trailer-book-card--${mode}`} aria-label={`إعلانات ${book.title}`}>
      <header className="trailer-book-card__header">
        <div className="trailer-book-card__cover">
          {book.coverImageUrl && !card.coverFailed ? (
            <img
              src={book.coverImageUrl}
              alt={`غلاف ${book.title}`}
              loading="lazy"
              onError={card.handleCoverError}
            />
          ) : (
            <BookOpen size={25} aria-hidden="true" />
          )}
        </div>
        <div className="trailer-book-card__heading">
          <h2>{book.title}</h2>
          {book.authorName && <p>{book.authorName}</p>}
          {mode === "create" && <span className="trailer-book-card__quota">{card.quotaLabel}</span>}
        </div>
      </header>

      <div className="trailer-book-card__body">
        {card.loading ? (
        <div className="trailer-book-card__list-loading" role="status">
          <Loader2 className="trailer-spinner" size={20} /> جاري تحميل إعلانات الكتاب...
        </div>
      ) : (
        <>
          {mode === "queue" && card.visibleItems.length === 0 && !card.error && (
            <div className="trailer-book-card__empty">
              <Film size={20} />
              <p>
                {card.completedCount
                  ? "إعلاناتك الجاهزة في أعلى الصفحة."
                  : "لا توجد إعلانات لهذا الكتاب بعد."}
              </p>
            </div>
          )}
          {card.visibleItems.map((trailer) => {
            const isReady = trailer.status === "READY";
            const isFailed = trailer.status === "FAILED";

            return (
              <section className={`trailer-job ${isFailed ? "trailer-job--failed" : ""}`} key={trailer.id}>
                <div className="trailer-job__heading">
                  <div className="trailer-job__status-group">
                    <TrailerStatusBadge status={trailer.status} size="sm" />
                  </div>
                  {trailer.dateLabel && <span>{trailer.dateLabel}</span>}
                </div>

                {trailer.active && (
                  <div className="trailer-job__progress" role="status" aria-live="polite">
                    <div className="trailer-job__film-loader" aria-hidden="true">
                      <Film size={26} />
                      <span />
                      <span />
                      <span />
                    </div>
                    <p>
                      {trailer.status === "QUEUED"
                        ? "إعلانك في قائمة الانتظار. سيبدأ إنتاجه تلقائياً عند توفر مساحة."
                        : trailer.status === "HARVESTING"
                          ? "نجهز الفيديو النهائي للمشاهدة والتحميل."
                          : "نعمل على كتابة الإعلان وإنتاج مشاهده."}
                    </p>
                    <span>يمكنك متابعة كتب أخرى. سنرسل لك بريداً عند اكتماله.</span>
                    <div className="trailer-job__progress-track" aria-hidden="true">
                      <div />
                    </div>
                  </div>
                )}

                {trailer.canPlay && (
                  <TrailerPlayer trailerId={trailer.id} poster={book.coverImageUrl} title={book.title} />
                )}

                {trailer.status === "NEEDS_REVIEW" && !trailer.canReview && (
                  <p className="trailer-job__message">
                    اكتمل الإنتاج والإعلان قيد المراجعة قبل إتاحته للمشاهدة.
                  </p>
                )}

                {trailer.status === "NEEDS_REVIEW" && trailer.canReview && (
                  <p className="trailer-job__message trailer-job__message--review">
                    اكتمل إنتاج الإعلان وهو بانتظار اعتمادك لإتاحته للمشاهدين. عاين الفيديو أعلاه ثم اتخذ قرارك.
                  </p>
                )}


                <div className="trailer-job__actions">
                  {trailer.canCancel && (
                    <button
                      type="button"
                      data-action="cancel"
                      data-id={trailer.id}
                      onClick={card.handleJobAction}
                      disabled={Boolean(card.operation)}
                    >
                      <X size={14} /> إلغاء الإعلان
                    </button>
                  )}

                  {trailer.canReview && (
                    <>
                      <button
                        type="button"
                        data-action="approve"
                        data-id={trailer.id}
                        onClick={card.handleJobAction}
                        disabled={Boolean(card.operation)}
                      >
                        <Check size={14} /> اعتماد
                      </button>
                      <button
                        type="button"
                        data-action="reject"
                        data-id={trailer.id}
                        onClick={card.handleJobAction}
                        disabled={Boolean(card.operation)}
                      >
                        <X size={14} /> رفض
                      </button>
                    </>
                  )}

                  {trailer.canRetry && (
                    <button
                      type="button"
                      data-action="retry"
                      data-id={trailer.id}
                      onClick={card.handleJobAction}
                      disabled={Boolean(card.operation) || card.hasActive}
                      className="trailer-job__action-retry"
                    >
                      <RefreshCw
                        size={14}
                        className={
                          card.operation?.action === "retry" && card.operation?.id === trailer.id
                            ? "trailer-spinner"
                            : ""
                        }
                      />
                      <span>إعادة المحاولة</span>
                    </button>
                  )}

                  {card.operation?.id === trailer.id && card.operation?.action !== "retry" && (
                    <Loader2 className="trailer-spinner" size={16} aria-label="جاري تنفيذ الطلب" />
                  )}
                </div>

                {isAdmin && (
                  <details className="trailer-job__admin">
                    <summary>تفاصيل الإنتاج</summary>
                    <p>المقاطع المنتجة: {trailer.higgsfieldGenerations ?? 0}</p>
                    {trailer.outcomeResult && <p>{trailer.outcomeResult}</p>}
                  </details>
                )}
              </section>
            );
          })}

          {card.historyCount > 2 && (
            <button type="button" className="trailer-book-card__history" onClick={card.toggleHistory}>
              <ChevronDown size={15} />{" "}
              {card.showHistory
                ? "إخفاء الإعلانات السابقة"
                : `عرض جميع الإعلانات (${card.historyCount})`}
            </button>
          )}
        </>
      )}
      </div>

      {mode === "create" && (
        <footer className="trailer-book-card__footer">
          <button
            type="button"
            className="trailer-book-card__create"
            onClick={card.handleCreate}
            disabled={!card.canCreate}
          >
            {card.operation?.action === "create" ? (
              <Loader2 className="trailer-spinner" size={17} />
            ) : (
              <Plus size={17} />
            )}
            {card.createLabel}
          </button>
        </footer>
      )}
    </article>
  );
}
