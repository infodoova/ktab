import React, { useState } from "react";
import { Upload, ChevronDown } from "lucide-react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import { postFormDataHelper } from "../../../../apis/apiHelpers";
import { getUserData } from '../../../../store/authToken';

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const categories = ["روايات", "قصص قصيرة", "تطوير الذات", "علوم وتكنولوجيا", "تاريخ", "شعر"];
const ageGroups = ["أطفال (3-8 سنوات)", "ناشئة (9-15 سنة)", "شباب (16-24 سنة)", "كبار (25+)" ];

export default function NewBooks({ pageName = "رفع كتاب جديد" }) {
  const userData = getUserData();
  const [collapsed, setCollapsed] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({ open: false, variant: "info", title: "", description: "" });

  // --- Helper: Calculate Page Count ---
  const getPdfPageCount = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error("Error reading PDF:", error);
      return 0; 
    }
  };

  const getAgeRange = (ageString) => {
    if (ageString.includes("3-8")) return { min: 3, max: 8 };
    if (ageString.includes("9-15")) return { min: 9, max: 15 };
    if (ageString.includes("16-24")) return { min: 16, max: 24 };
    if (ageString.includes("25+")) return { min: 25, max: 100 }; // Arbitrary max for adults
    return { min: 0, max: 0 }; // Default fallback
  };

  const handleCreateBook = async () => {
    if (!title || !description || !selectedCategory || !selectedAge || !coverFile || !pdfFile) {
      return setToast({ open: true, variant: "error", title: "خطأ", description: "يرجى تعبئة جميع الحقول." });
    }

    setLoading(true);

    try {
      // 1. Get dynamic page count
      const calculatedPageCount = await getPdfPageCount(pdfFile);
      if (calculatedPageCount === 0) {
        throw new Error("لم نتمكن من قراءة ملف الكتاب للتأكد من عدد الصفحات.");
      }

      // 2. Get dynamic age range
      const { min: ageMin, max: ageMax } = getAgeRange(selectedAge);

      const formData = new FormData();
      formData.append("coverImage", coverFile);
      formData.append("pdfFile", pdfFile);

      formData.append(
        "bookDto",
        new Blob([JSON.stringify({
          title,
          description,
          authorId: userData.userId,
          genre: selectedCategory,
          language: "arabic",
          ageRangeMin: ageMin, // Dynamic Min
          ageRangeMax: ageMax, // Dynamic Max
          pageCount: calculatedPageCount, // Dynamic Page Count
          hasAudio: false,
        })], { type: "application/json" })
      );

      await postFormDataHelper({
        url: `${import.meta.env.VITE_API_URL}/books`,
        formData,
        onProgress: (p) => setProgress(p),
      });

      setToast({ open: true, variant: "success", title: "تم الرفع", description: "تم نشر الكتاب بنجاح" });
      
      // Optional: Reset form
      // setTitle(""); setDescription(""); setCoverFile(null); setPdfFile(null); 
      
    } catch (err) {
      setToast({ open: true, variant: "error", title: "خطأ", description: err?.message || "حدث خطأ أثناء الرفع" });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--earth-cream)] font-[family-name:var(--font-arabic)]">
      <div dir="ltr">
        <Navbar pageName={pageName} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "md:mr-20" : "md:mr-64"}`}>
        <main className="flex-1 flex flex-col" dir="rtl">
          <PageHeader mainTitle={pageName} />
          <div className="flex-1 p-6 md:p-10">
            <div className="w-full max-w-6xl mx-auto bg-[var(--earth-paper)] rounded-2xl shadow-sm border p-6 md:p-10">
              <div className="mb-8 text-right">
                <h2 className="text-2xl font-bold text-[var(--earth-brown-dark)] mb-2">رفع كتاب جديد</h2>
                <p className="text-[var(--earth-brown)]/70">املأ المعلومات التالية لنشر كتابك على المنصة</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">عنوان الكتاب *</label>
                    <input type="text" className="w-full h-12 px-4 rounded-lg bg-white border" placeholder="أدخل عنوان الكتاب" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">التصنيف *</label>
                    <div className="relative">
                      <select className="w-full h-12 px-4 rounded-lg bg-white border appearance-none" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="" disabled hidden>اختر التصنيف</option>
                        {categories.map((cat) => (<option key={cat}>{cat}</option>))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">الفئة العمرية *</label>
                    <div className="relative">
                      <select className="w-full h-12 px-4 rounded-lg bg-white border appearance-none" value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
                        <option value="" disabled hidden>اختر الفئة العمرية</option>
                        {ageGroups.map((age) => (<option key={age}>{age}</option>))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">وصف الكتاب *</label>
                    <textarea className="w-full p-4 rounded-lg bg-white border h-32" placeholder="اكتب وصفاً للكتاب" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6 order-1 lg:order-2 text-right">
                  <input id="coverInput" type="file" accept="image/*" className="hidden" onChange={(e) => setCoverFile(e.target.files[0])} />
                  <label htmlFor="coverInput">
                    <div className="border-2 border-dashed rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 mb-2" />
                      <span>{coverFile ? coverFile.name : "اضغط لرفع صورة الغلاف"}</span>
                    </div>
                  </label>

                  <input id="pdfInput" type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files[0])} />
                  <label htmlFor="pdfInput">
                    <div className="border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 mb-2" />
                      <span>{pdfFile ? pdfFile.name : "اضغط لرفع ملف الكتاب (PDF)"}</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t flex gap-4">
                <button onClick={handleCreateBook} disabled={loading} className="px-8 py-2.5 bg-[var(--earth-olive)] text-white rounded-lg disabled:opacity-50">
                  {loading ? `جاري معالجة الملف والرفع ${progress}%` : "نشر الكتاب"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AlertToast open={toast.open} variant={toast.variant} title={toast.title} description={toast.description} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}