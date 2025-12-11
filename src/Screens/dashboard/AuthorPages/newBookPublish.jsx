import React, { useState } from "react";
import { Upload, ChevronDown, Info } from "lucide-react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import { postFormDataHelper } from "../../../../apis/apiHelpers";
import UploadModal from "../../../components/myui/Users/AuthorPages/createnewbook/UploadModal";

import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const categories = ["روايات", "قصص قصيرة", "تطوير الذات", "علوم وتكنولوجيا", "تاريخ", "شعر"];
const ageGroups = ["أطفال (3-8 سنوات)", "ناشئة (9-15 سنة)", "شباب (16-24 سنة)", "كبار (25+)"];

export default function NewBooks({ pageName = "رفع كتاب جديد" }) {
  const [collapsed, setCollapsed] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [setProgress] = useState(0);
  const [toast, setToast] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });
const resetForm = () => {
  setTitle("");
  setDescription("");
  setSelectedCategory("");
  setSelectedAge("");
  setCoverFile(null);
  setPdfFile(null);
};

  const showError = (title, description) =>
    setToast({ open: true, variant: "error", title, description });

  // ---------------- PDF Page Count ---------------- //
  const getPdfPageCount = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch {
      return 0;
    }
  };

  const getAgeRange = (ageString) => {
    if (ageString.includes("3-8")) return { min: 3, max: 8 };
    if (ageString.includes("9-15")) return { min: 9, max: 15 };
    if (ageString.includes("16-24")) return { min: 16, max: 24 };
    if (ageString.includes("25+")) return { min: 25, max: 100 };
    return { min: 0, max: 0 };
  };

  // ---------------- VALIDATION ---------------- //

  const validateTitle = () => {
    if (!title.trim()) {
      showError("خطأ في العنوان", "الرجاء إدخال عنوان الكتاب.");
      return false;
    }
    if (title.length > 255) {
      showError("العنوان طويل جداً", "الحد الأقصى للعنوان هو 255 حرف.");
      return false;
    }
    return true;
  };

  const validatePDF = (file) => {
    if (!file) {
      showError("ملف PDF مفقود", "يرجى رفع ملف الكتاب.");
      return false;
    }

    if (file.type !== "application/pdf") {
      showError("صيغة غير صحيحة", "الملف يجب أن يكون PDF فقط.");
      return false;
    }

    if (file.size > 50 * 1024 * 1024) {
      showError("PDF كبير جداً", "الحد الأقصى لحجم PDF هو 50MB.");
      return false;
    }

    return true;
  };

  const validateImage = (file) => {
    return new Promise((resolve) => {
      if (!file) {
        showError("صورة الغلاف مفقودة", "يرجى رفع صورة الغلاف.");
        return resolve(false);
      }

      if (file.size > 5 * 1024 * 1024) {
        showError("الصورة كبيرة جداً", "الحد الأقصى لحجم الصورة هو 5MB.");
        return resolve(false);
      }

      if (!["image/jpeg", "image/png" , "image/jpg"].includes(file.type)) {
        showError("صيغة الصورة غير مدعومة", "الرجاء استخدام JPG أو PNG فقط.");
        return resolve(false);
      }

const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const w = img.width;
      const h = img.height;
      const ratio = h / w;

      const min = 1.5; // lower bound
      const max = 1.7; // upper bound

      if (ratio < min || ratio > max) {
        showError(
          "نسبة الأبعاد غير صحيحة",
          "يجب أن تكون الصورة بنسبة تقريبية 1.6:1 (مسموح بين 1.5 إلى 1.7)"
        );
        return resolve(false);
      }

      resolve(true);
    };

    img.onerror = () => {
      showError("خطأ في قراءة الصورة", "يرجى رفع صورة صالحة.");
      resolve(false);
    };
  });
};

  // ---------------- SUBMIT ---------------- //

  const handleCreateBook = async () => {
    if (
      !title ||
      !description ||
      !selectedCategory ||
      !selectedAge ||
      !coverFile ||
      !pdfFile
    ) {
      return showError("حقول ناقصة", "يرجى تعبئة جميع الحقول.");
    }

    if (!validateTitle()) return;
    if (!validatePDF(pdfFile)) return;
    const imgValid = await validateImage(coverFile);
    if (!imgValid) return;

    setLoading(true);

    try {
      const pageCount = await getPdfPageCount(pdfFile);
      if (pageCount === 0) {
        throw new Error("لم نتمكن من قراءة ملف PDF للتأكد من عدد الصفحات.");
      }

      const { min: ageMin, max: ageMax } = getAgeRange(selectedAge);

      const formData = new FormData();
      formData.append("coverImage", coverFile);
      formData.append("pdfFile", pdfFile);

      formData.append(
        "bookDto",
        new Blob(
          [
            JSON.stringify({
              title,
              description,
              genre: selectedCategory,
              language: "arabic",
              ageRangeMin: ageMin,
              ageRangeMax: ageMax,
              pageCount,
              hasAudio: false,
            }),
          ],
          { type: "application/json" }
        )
      );

      await postFormDataHelper({
        url: `${import.meta.env.VITE_API_URL}/authors/createBook`,
        formData,
        onProgress: (p) => setProgress(p),
      });

    setToast({
  open: true,
  variant: "success",
  title: "تم النشر",
  description: "تم نشر الكتاب بنجاح!",
});

// Reset form inputs
resetForm();

    } catch (err) {
      showError("فشل الرفع", err?.message || "حدث خطأ غير متوقع." );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // ---------------- UI ---------------- //

  const WarningBox = ({ children }) => (
    <div className="mt-2 text-[var(--earth-brown)]/60 text-xs flex items-start gap-2 leading-tight">
      <Info className="w-4 h-4 text-[var(--earth-olive)] mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--earth-cream)] font-[family-name:var(--font-arabic)]">
      <div dir="ltr">
        <Navbar pageName={pageName} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "md:mr-20" : "md:mr-64"}`}>
        <main className="flex-1 flex flex-col" dir="rtl">
          <PageHeader mainTitle={pageName} />

          <div className="flex-1 px-4 sm:px-6 md:px-12 py-10">
            <div className="w-full max-w-6xl mx-auto bg-[var(--earth-paper)] rounded-3xl shadow-md border p-8 md:p-14">

              {/* Page Title */}
              <div className="mb-10 text-right">
                <h2 className="text-3xl font-bold text-[var(--earth-brown-dark)]">رفع كتاب جديد</h2>
                <p className="text-[var(--earth-brown)]/70 mt-2">املأ المعلومات التالية لنشر كتابك على المنصة</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT SIDE */}
                <div className="lg:col-span-7 space-y-8">

                  {/* Title */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">عنوان الكتاب *</label>
                    <input
                      type="text"
                      className="w-full h-14 px-5 rounded-xl bg-white border text-lg"
                      placeholder="أدخل عنوان الكتاب"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <WarningBox>
                      الحد الأقصى للعنوان هو <span className="font-semibold">255 حرف</span>.
                    </WarningBox>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">التصنيف *</label>
                    <div className="relative">
                      <select
                        className="w-full h-14 px-5 rounded-xl bg-white border text-lg appearance-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">اختر التصنيف</option>
                        {categories.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">الفئة العمرية *</label>
                    <div className="relative">
                      <select
                        className="w-full h-14 px-5 rounded-xl bg-white border text-lg appearance-none"
                        value={selectedAge}
                        onChange={(e) => setSelectedAge(e.target.value)}
                      >
                        <option value="">اختر الفئة العمرية</option>
                        {ageGroups.map((a) => <option key={a}>{a}</option>)}
                      </select>
                      <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">وصف الكتاب *</label>
                    <textarea
                      className="w-full p-5 rounded-xl bg-white border text-lg h-40"
                      placeholder="اكتب وصفاً للكتاب"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />

                    <WarningBox>
                      حاول كتابة وصف مختصر وواضح ليساعد القراء على فهم محتوى الكتاب.
                    </WarningBox>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:col-span-5 flex flex-col gap-8 mt-4">

                  {/* Cover Upload */}
                  <input id="coverInput" type="file" accept="image/*" className="hidden"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                  />

                  <label htmlFor="coverInput">
                    <div className="border-2 border-dashed rounded-2xl w-full flex flex-col items-center justify-center text-center cursor-pointer bg-white shadow-sm p-6" style={{ aspectRatio: '1 / 1.6' }}>
                      {coverFile ? (
                        <img src={URL.createObjectURL(coverFile)} className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-3 text-gray-600" />
                          <p className="text-lg text-gray-700">اضغط لرفع صورة الغلاف</p>
                        </>
                      )}
                    </div>
                  </label>

                  <WarningBox>
                    يجب أن تكون الصورة بنسبة تقريبية <span className="font-semibold">1.6 : 1</span> (مسموح بين 1.5 إلى 1.7). <br />
                    الحد الأقصى للحجم: <span className="font-semibold">5MB</span>. <br />
                    الصيغ المدعومة: <span className="font-semibold">JPG أو PNG</span>.
                  </WarningBox>

                  {/* PDF Upload */}
                  <input id="pdfInput" type="file" accept="application/pdf" className="hidden"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />

                  <label htmlFor="pdfInput">
                    <div className="border-2 border-dashed rounded-2xl h-[180px] w-full flex flex-col items-center justify-center text-center cursor-pointer bg-white shadow-sm p-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-600" />
                      <p className="text-lg text-gray-700">
                        {pdfFile ? pdfFile.name : "اضغط لرفع ملف الكتاب (PDF)"}
                      </p>
                    </div>
                  </label>

                  <WarningBox>
                    يجب أن يكون الملف بصيغة PDF فقط. <br />
                    الحجم الأقصى: 50MB. <br />
                    سيتم حساب عدد الصفحات تلقائياً.
                  </WarningBox>

                </div>
              </div>

              {/* BUTTON */}
              <div className="mt-14 border-t pt-8 flex justify-start">
                <button
                  onClick={handleCreateBook}
                  disabled={loading}
                  className="px-12 py-4 bg-[var(--earth-olive)] text-white rounded-xl text-lg font-semibold disabled:opacity-60"
                >
                  {loading ? "..." : "نشر الكتاب"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <UploadModal open={loading} />
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
