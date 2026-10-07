import { Film, SlidersHorizontal, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { useTrailerStudio } from "../hooks/useTrailerStudio";
import { TrailerBookCard } from "../components/TrailerBookCard/TrailerBookCard";
import { TrailerBookController } from "../components/TrailerBookController/TrailerBookController";
import { TrailerVideoCard } from "../components/TrailerVideoCard/TrailerVideoCard";
import { TrailerCreateDialog } from "../components/TrailerCreateDialog/TrailerCreateDialog";
import { TrailerFilters } from "../components/TrailerFilters/TrailerFilters";
import "./TrailerStudioView.css";

export default function TrailerStudioView() {
  const studio = useTrailerStudio();
  return (
    <AppLayout pageName="إعلانات الكتب" showSearch searchQuery={studio.searchQuery} onSearchChange={studio.setSearchQuery} onFilterClick={studio.handleOpenFilters} searchPlaceholder="ابحث في كتب هذه الصفحة..." activeFiltersCount={studio.activeFiltersCount} headerActions={<button type="button" className="trailer-header-filter" onClick={studio.handleOpenFilters} aria-label="تصفية الإعلانات"><SlidersHorizontal size={18} /><span>تصفية</span></button>} className="trailer-workspace">
      <div className="trailer-studio" dir="rtl">
        {!studio.loading && studio.books.map((book) => <TrailerBookController key={book.id} bookId={book.id} isAdmin={studio.isAdmin} role={studio.role} onChange={studio.handleTrailersChange} />)}
        {studio.error && <div className="trailer-studio__error" role="alert"><p>{studio.error}</p></div>}

        {studio.viewFilter !== "active" && <section className="trailer-studio__section" aria-labelledby="trailer-finished-heading">
          <div className="trailer-studio__section-heading"><div><h2 id="trailer-finished-heading">جاهزة للمشاهدة <span>{studio.finished.length}</span></h2><p>إعلانات الكتب المكتملة الجاهزة للمشاهدة والتحميل.</p></div>{!studio.loading && studio.galleryLoading && studio.finished.length > 0 && <Loader2 size={17} className="trailer-spinner" aria-label="جاري تحميل بقية الإعلانات" />}</div>
          {(studio.loading || studio.galleryLoading) && studio.finished.length === 0 ? <div className="trailer-studio__video-grid" role="status" aria-label="جاري تحميل الإعلانات"><span className="trailer-studio__sr">جاري تحميل الإعلانات...</span>{[0,1].map((id) => <div key={id} className="trailer-studio__video-skeleton" aria-hidden="true"><div /><span /></div>)}</div>
            : studio.finished.length > 0 ? <div className="trailer-studio__video-grid">{studio.finished.map(({ book, trailer }) => <TrailerVideoCard key={`${book.id}-${trailer.id}`} book={book} trailer={trailer} />)}</div>
            : <div className="trailer-studio__gallery-empty"><Film size={22} strokeWidth={1.5} /><div><h3>{studio.galleryHasErrors ? "تعذر تحميل بعض الإعلانات" : "لا توجد إعلانات جاهزة للمشاهدة"}</h3><p>ستظهر الفيديوهات هنا عند اكتمال الإنتاج.</p></div></div>}
        </section>}

        {studio.viewFilter !== "ready" && (studio.activeBooks.length > 0 || studio.viewFilter === "active") && <section className="trailer-studio__section trailer-studio__queue" aria-labelledby="trailer-queue-heading">
          <div className="trailer-studio__section-heading"><div><h2 id="trailer-queue-heading" tabIndex={-1}>قائمة الانتظار والإنتاج <span>{studio.activeBooks.length}</span></h2><p>تابع حالة الإعلانات قيد الإنتاج، أو أعد محاولة إنتاج الإعلانات التي تعذر إكمالها.</p></div></div>
          <div className="trailer-studio__book-grid">{studio.activeBooks.map((book) => <TrailerBookCard key={book.id} book={book} isAdmin={studio.isAdmin} collection={studio.trailersByBook[book.id]} mode="queue" />)}</div>
          {!studio.loading && !studio.galleryLoading && studio.activeBooks.length === 0 && <div className="trailer-studio__empty"><Film size={28} strokeWidth={1.2} /><h3>لا توجد إعلانات في قائمة الانتظار</h3><p>ستظهر طلباتك هنا بعد تأكيد إنشاء الإعلان.</p></div>}
          {(studio.loading || studio.galleryLoading) && studio.activeBooks.length === 0 && <div className="trailer-book-card__list-loading" role="status"><Loader2 className="trailer-spinner" size={20} /> جاري تحميل طلباتك...</div>}
        </section>}

        {studio.viewFilter === "all" && <section className="trailer-studio__section" aria-labelledby="trailer-books-heading">
          <div className="trailer-studio__section-heading"><div><h2 id="trailer-books-heading">إنشاء إعلان جديد <span>{studio.availableBooks.length}</span></h2><p>اختر كتاباً. بعد التأكيد، ينتقل إلى قائمة الانتظار.</p></div></div>
          {studio.loading ? <div className="trailer-studio__book-grid" role="status" aria-label="جاري تحميل الكتب">{[0,1,2].map((id) => <div key={id} className="trailer-studio__book-skeleton" aria-hidden="true"><span /><div><i /><i /></div><b /></div>)}</div>
            : <div className="trailer-studio__book-grid">{studio.availableBooks.map((book) => <TrailerBookCard key={book.id} book={book} isAdmin={studio.isAdmin} collection={studio.trailersByBook[book.id]} onRequestCreate={studio.handleRequestCreate} />)}</div>}
          {!studio.loading && !studio.error && studio.availableBooks.length === 0 && <div className="trailer-studio__empty"><Film size={28} strokeWidth={1.2} /><h3>{studio.activeBooks.length ? "كتبك المعروضة موجودة في قائمة الانتظار" : "لا توجد كتب مطابقة"}</h3><p>غيّر البحث أو التصفية.</p></div>}
          {studio.showPagination && <nav className="trailer-studio__pagination" aria-label="صفحات الكتب المتاحة لإنشاء إعلان"><button className="trailer-studio__button" type="button" onClick={studio.handlePreviousPage} disabled={studio.page === 0}><ChevronRight size={16} /> السابقة</button><span>{studio.page + 1} / {studio.totalPages}</span><button className="trailer-studio__button" type="button" onClick={studio.handleNextPage} disabled={studio.page + 1 >= studio.totalPages}>التالية <ChevronLeft size={16} /></button></nav>}
        </section>}
        <footer className="trailer-studio__policy"><p>{studio.isAdmin ? "المشرف معفى من الحصة الشهرية. إعلان واحد نشط لكل كتاب." : "حتى ٣ إعلانات لكل كتاب خلال أي ٣٠ يوماً."}</p></footer>
      </div>
      <TrailerFilters studio={studio} />
      <TrailerCreateDialog book={studio.bookToCreate} busy={studio.creationBusy} collection={studio.createCollection} onClose={studio.handleCloseCreate} onConfirm={studio.handleConfirmCreate} onCloseAutoFocus={studio.handleCreateCloseAutoFocus} />
    </AppLayout>
  );
}
