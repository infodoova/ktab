import { BookOpen, Loader2 } from "lucide-react";
import { TrailerPopup } from "../TrailerPopup/TrailerPopup";
import "./TrailerCreateDialog.css";

export function TrailerCreateDialog({ book, busy, collection, onClose, onConfirm, onCloseAutoFocus }) {
  return <TrailerPopup open={Boolean(book)} onClose={onClose} onClosed={() => onCloseAutoFocus?.({ preventDefault() {} })} title="إنشاء إعلان لهذا الكتاب؟" className="trailer-create-dialog">
        <div className="trailer-create-dialog__book"><div className="trailer-create-dialog__cover">{book?.coverImageUrl ? <img src={book.coverImageUrl} alt="" /> : <BookOpen size={22} />}</div><div><h3>{book?.title}</h3><p>{book?.authorName}</p></div></div>
        {collection?.error && <p className="trailer-create-dialog__error" role="alert">{collection.error}</p>}
        <div className="trailer-create-dialog__actions">
          <button type="button" className="trailer-create-dialog__confirm" onClick={onConfirm} disabled={busy || !collection?.canCreate}>{busy && <Loader2 className="trailer-spinner" size={16} />}{busy ? "جاري إرسال الطلب..." : "نعم، إنشاء الإعلان"}</button>
          <button type="button" onClick={onClose} disabled={busy}>رجوع</button>
        </div>
  </TrailerPopup>;
}
