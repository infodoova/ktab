import React, { useRef, memo } from "react";
import { FileText, Upload, X } from "lucide-react";

export const PdfUploadZone = memo(function PdfUploadZone({
  pdfFile,
  existingPdfName,
  pageCount,
  onFileChange,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null);

  const displayName = pdfFile?.name || existingPdfName;

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
    // Reset file input so re-selecting same file triggers onChange
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-black/10 rounded-[2.5rem] relative group hover:border-[#5de3ba] transition-all">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleSelect}
        className="hidden"
      />

      {displayName ? (
        <div className="flex items-center justify-between w-full bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 truncate">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div className="truncate text-right">
              <p className="font-bold text-xs text-slate-800 truncate">{displayName}</p>
              {pageCount > 0 && (
                <p className="text-[10px] font-bold text-slate-400">{pageCount} صفحة</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveFile}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shrink-0"
            title="حذف الملف"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center text-center cursor-pointer py-10 px-6 w-full"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#5de3ba]/10 text-[#5de3ba] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload size={28} />
          </div>
          <span className="text-sm font-black text-slate-800 mb-1">رفع ملف الكتاب (PDF)</span>
          <span className="text-xs font-bold text-slate-400">PDF فقط (حتى 100MB)</span>
        </div>
      )}
    </div>
  );
});

export default PdfUploadZone;

