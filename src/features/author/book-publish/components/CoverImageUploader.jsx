import React, { useRef, useMemo, useEffect, memo } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

export const CoverImageUploader = memo(function CoverImageUploader({
  coverFile,
  coverUrl,
  onFileChange,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null);

  // Generate Blob URL only when coverFile changes
  const previewSrc = useMemo(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }
    return coverUrl || null;
  }, [coverFile, coverUrl]);

  // Clean up object URL when changed or unmounted to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);


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
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleSelect}
        className="hidden"
      />

      {previewSrc ? (
        <div className="relative w-40 h-56 rounded-2xl overflow-hidden shadow-lg border border-black/10">
          <img src={previewSrc} alt="غلاف الكتاب" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemoveFile}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-all"
            title="حذف الغلاف"
          >
            <X size={16} />
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
          <span className="text-sm font-black text-slate-800 mb-1">رفع صورة الغلاف</span>
          <span className="text-xs font-bold text-slate-400">JPG, PNG, WebP (نسبة 1.6:1 تقريباً - حتى 10MB)</span>
        </div>
      )}
    </div>
  );
});

export default CoverImageUploader;

