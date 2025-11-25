import React, { useState } from "react";
import { Upload, ChevronDown } from "lucide-react";
import Navbar from "../../AuthorPages/navbar";
import PageHeader from "../../AuthorPages/sideHeader";

const categories = ["روايات", "قصص قصيرة", "تطوير الذات", "علوم وتكنولوجيا", "تاريخ", "شعر"];
const ageGroups = ["أطفال (3-8 سنوات)", "ناشئة (9-15 سنة)", "شباب (16-24 سنة)", "كبار (25+ سنة)"];

function NewBooks({ pageName = "رفع كتاب جديد" }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--earth-cream)] font-[family-name:var(--font-arabic)]">

      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 
          ${collapsed ? "md:mr-20" : "md:mr-64"} 
        `}
      >
        {/* Main Content Area  */}
        <main className="flex-1 flex flex-col" dir="rtl">

          <PageHeader
            mainTitle={pageName}
          />

          <div className="flex-1 p-6 md:p-10">
            
            {/* FORM CONTAINER CARD */}
            <div className="w-full max-w-6xl mx-auto bg-[var(--earth-paper)] rounded-2xl shadow-sm border border-[var(--earth-brown)]/10 p-6 md:p-10 fade-up">
              
              {/* Card Header */}
              <div className="mb-8 text-right">
                <h2 className="text-2xl font-bold text-[var(--earth-brown-dark)] mb-2">رفع كتاب جديد</h2>
                <p className="text-[var(--earth-brown)]/70">املأ المعلومات التالية لنشر كتابك على المنصة</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
                  
                  {/* Title Input */}
                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">
                      عنوان الكتاب <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="أدخل عنوان الكتاب" 
                      className="w-full h-12 px-4 rounded-lg bg-white border border-[var(--earth-sand)] focus:border-[var(--earth-olive)] focus:ring-2 focus:ring-[var(--earth-olive)]/20 outline-none transition-all placeholder:text-gray-400 text-right"
                    />
                  </div>

                  {/* Category Select */}
                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">
                      التصنيف <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full h-12 px-4 appearance-none rounded-lg bg-white border border-[var(--earth-sand)] focus:border-[var(--earth-olive)] focus:ring-2 focus:ring-[var(--earth-olive)]/20 outline-none transition-all text-[var(--earth-brown-dark)] cursor-pointer text-right"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="" disabled hidden>اختر التصنيف</option>
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Age Select */}
                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">
                      الفئة العمرية <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full h-12 px-4 appearance-none rounded-lg bg-white border border-[var(--earth-sand)] focus:border-[var(--earth-olive)] focus:ring-2 focus:ring-[var(--earth-olive)]/20 outline-none transition-all text-[var(--earth-brown-dark)] cursor-pointer text-right"
                        value={selectedAge}
                        onChange={(e) => setSelectedAge(e.target.value)}
                      >
                        <option value="" disabled hidden>اختر الفئة العمرية</option>
                        {ageGroups.map((age) => <option key={age} value={age}>{age}</option>)}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">
                      وصف الكتاب <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      rows={5}
                      placeholder="اكتب وصفاً موجزاً عن الكتاب..."
                      className="w-full p-4 rounded-lg bg-white border border-[var(--earth-sand)] focus:border-[var(--earth-olive)] focus:ring-2 focus:ring-[var(--earth-olive)]/20 outline-none transition-all resize-none placeholder:text-gray-400 text-right"
                    ></textarea>
                  </div>
                </div>

                {/* LEFT COLUMN (Uploads) */}
                <div className="lg:col-span-5 space-y-6 order-1 lg:order-2 text-right">
                  
                  {/* Cover Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">
                      غلاف الكتاب <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-[var(--earth-sand)] hover:border-[var(--earth-olive)] bg-[var(--earth-cream)]/30 rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                         <Upload className="w-6 h-6 text-[var(--earth-brown)]" />
                      </div>
                      <span className="text-[var(--earth-brown-dark)] font-medium">اضغط لرفع صورة الغلاف</span>
                      <span className="text-sm text-[var(--earth-brown)]/60 mt-1">PNG, JPG (نسبة 2:3)</span>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[var(--earth-brown-dark)]">
                      ملف الكتاب <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-[var(--earth-sand)] hover:border-[var(--earth-olive)] bg-[var(--earth-cream)]/30 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                         <Upload className="w-6 h-6 text-[var(--earth-brown)]" />
                      </div>
                      <span className="text-[var(--earth-brown-dark)] font-medium">اضغط لرفع ملف الكتاب</span>
                      <span className="text-sm text-[var(--earth-brown)]/60 mt-1">PDF, EPUB (حتى 50 MB)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-10 pt-6 border-t border-[var(--earth-sand)] flex flex-col sm:flex-row gap-4 ">
                 <button className="px-8 py-2.5 rounded-lg bg-[var(--earth-olive)] hover:bg-[var(--earth-olive-dark)] text-white font-semibold shadow-lg shadow-[var(--earth-olive)]/20 transition-all active:scale-95">
                   نشر الكتاب
                 </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewBooks;