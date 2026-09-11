import React from "react";
import { MoreVertical, Trash, Edit, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AuthorBookCard({
  book,
  onClick,
  onDelete,
  openMenuId,
  setOpenMenuId,
}) {
  const navigate = useNavigate();
  const isOpen = openMenuId === book.id;
  const isDraft = book.status === "DRAFT" || book.isDraft;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isOpen ? null : book.id);
  };

  return (
    <div
      onClick={onClick}
      className="relative group bg-white rounded-[2rem] p-4 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      dir="rtl"
    >
      {/* Menu Actions */}
      <div className="absolute top-4 left-4 z-20 book-menu-area">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-black/5 hover:bg-black/5 transition-all text-slate-600"
          title="خيارات"
        >
          <MoreVertical size={16} />
        </button>

        {isOpen && (
          <div
            className="absolute top-10 left-0 w-36 bg-white shadow-2xl rounded-2xl border border-black/5 p-2 text-xs font-bold z-30 book-menu-area animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {isDraft && (
              <button
                onClick={() => navigate(`/author/new-book/${book.id}`)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors"
              >
                <span>تعديل</span>
                <Edit size={14} />
              </button>
            )}
            <button
              onClick={() => {
                onDelete(book);
                setOpenMenuId(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
            >
              <span>حذف</span>
              <Trash size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative w-full aspect-[1/1.4] rounded-2xl overflow-hidden mb-4 shadow-sm border border-black/5">
        <img
          src={book.coverImageUrl || book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isDraft && (
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
            مسودة
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="space-y-2">
        <h3 className="font-black text-slate-900 text-sm md:text-base line-clamp-1 group-hover:text-[#5de3ba] transition-colors">
          {book.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
          <span className="truncate">{book.genreName || book.mainGenre?.name || "عام"}</span>
          <div className="flex items-center gap-1 text-slate-700">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span>{Number(book.averageRating || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorBookCard;
