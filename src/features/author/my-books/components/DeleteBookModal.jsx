import React from "react";
import { Trash2, X } from "lucide-react";

export function DeleteBookModal({ isOpen, onClose, onConfirm, bookTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-black/5 animate-in fade-in zoom-in-95 duration-200" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <Trash2 size={28} />
        </div>

        <div>
          <h3 className="font-black text-slate-900 text-lg">تأكيد حذف الكتاب</h3>
          <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">
            هل أنت متأكد من رغبتك في حذف <span className="text-slate-800 font-black">"{bookTitle}"</span>؟
            لا يمكن التراجع عن هذا الإجراء لاحقاً.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
          >
            حذف الكتاب
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBookModal;
