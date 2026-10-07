import { Link2, Loader2 } from "lucide-react";
import { TrailerPopup } from "../TrailerPopup/TrailerPopup";
import "./TrailerFilters.css";

export function TrailerFilters({ studio }) {
  return <TrailerPopup open={studio.filtersOpen} onClose={studio.handleCloseFilters} onClosed={() => studio.handleFiltersCloseAutoFocus({ preventDefault() {} })} title="تصفية الإعلانات" description="اختر الإعلانات التي تريد عرضها." className="trailer-filter-dialog">
      <fieldset><legend>حالة الإعلان</legend><div className="trailer-studio__segments"><button type="button" data-filter="all" aria-pressed={studio.viewFilter === "all"} onClick={studio.handleViewFilter}>الكل</button><button type="button" data-filter="ready" aria-pressed={studio.viewFilter === "ready"} onClick={studio.handleViewFilter}>جاهزة</button><button type="button" data-filter="active" aria-pressed={studio.viewFilter === "active"} onClick={studio.handleViewFilter}>قائمة الانتظار</button></div></fieldset>
      {studio.isAdmin && <div className="trailer-filter-dialog__admin"><button type="button" className="trailer-studio__button" onClick={studio.handleConnect} disabled={studio.connecting}>{studio.connecting ? <Loader2 className="trailer-spinner" size={16} /> : <Link2 size={16} />} ربط خدمة الإنتاج</button>{studio.connectUrl && <a className="trailer-studio__button" href={studio.connectUrl} target="_blank" rel="noopener noreferrer">إكمال الربط</a>}</div>}
      <button type="button" className="trailer-filter-dialog__done" onClick={studio.handleCloseFilters}>عرض النتائج</button>
  </TrailerPopup>;
}
