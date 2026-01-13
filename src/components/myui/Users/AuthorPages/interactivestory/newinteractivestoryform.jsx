import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import PageHeader from "../sideHeader";
import { AlertToast } from "../../../AlertToast";
import Loader from "./loader";
import {
  BookOpen,
  Compass,
  Ghost,
  Search,
  Heart,
  Rocket,
  GraduationCap,
  Palette,
  Image,
  Wand2,
  Eye,
  Users,
  Calendar,
  Grid3x3,
  Layers,
  Baby,
} from "lucide-react";

function NewInteractiveStoryForm({ pageName = "قصة تفاعلية جديدة", onSubmit }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    ageRange: "",
    cover: null,
    sceneNum: "",
    optionNum: "",
    artStyle: "",
    positivePrompt: "",
    negativePrompt: "",
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      genre: "",
      ageRange: "",
      cover: null,
      sceneNum: "",
      optionNum: "",
      artStyle: "",
      positivePrompt: "",
      negativePrompt: "",
    });
    setErrors({});
    setCoverPreview(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover" && files?.[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return previewUrl;
      });
    }
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const validateForm = () => {
    const newErrors = {};
    const missingFields = [];

    const fieldLabels = {
      title: "عنوان القصة",
      description: "وصف القصة",
      genre: "نوع القصة",
      ageRange: "الفئة العمرية",
      cover: "غلاف القصة",
      sceneNum: "عدد المشاهد",
      optionNum: "عدد الخيارات",
    };

    if (!form.title.trim()) {
      newErrors.title = "عنوان القصة مطلوب";
      missingFields.push(fieldLabels.title);
    }
    if (!form.description.trim()) {
      newErrors.description = "وصف القصة مطلوب";
      missingFields.push(fieldLabels.description);
    }
    if (!form.genre) {
      newErrors.genre = "يرجى اختيار نوع القصة";
      missingFields.push(fieldLabels.genre);
    }
    if (!form.ageRange) {
      newErrors.ageRange = "يرجى تحديد الفئة العمرية";
      missingFields.push(fieldLabels.ageRange);
    }
    if (!form.cover) {
      newErrors.cover = "غلاف القصة مطلوب";
      missingFields.push(fieldLabels.cover);
    }
    if (!form.sceneNum) {
      newErrors.sceneNum = "يرجى اختيار عدد المشاهد";
      missingFields.push(fieldLabels.sceneNum);
    }
    if (!form.optionNum) {
      newErrors.optionNum = "يرجى اختيار عدد الخيارات";
      missingFields.push(fieldLabels.optionNum);
    }

    setErrors(newErrors);
    return {
      valid: Object.keys(newErrors).length === 0,
      missingFields,
    };
  };

  const handleSubmit = async () => {
    const { valid, missingFields } = validateForm();
    if (!valid) {
      if (missingFields.length) {
        AlertToast(
          `يرجى إكمال الحقول التالية: ${missingFields.join("، ")}`,
          "info",
          "حقول ناقصة"
        );
      }
      return;
    }
    if (!onSubmit) {
      AlertToast("لا يوجد إجراء حفظ متاح حالياً", "info", "تنبيه");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await onSubmit(form);
      if (success) {
        AlertToast("تم إنشاء القصة التفاعلية بنجاح", "success", "نجاح");
        resetForm();
      } else {
        AlertToast("حدث خطأ أثناء إنشاء القصة", "error", "خطأ");
      }
    } catch (error) {
      console.error("Interactive story submit failed:", error);
      AlertToast("حدث خطأ أثناء إنشاء القصة", "error", "خطأ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const genres = [
    {
      value: "fantasy",
      label: "خيال",
      icon: Wand2,
      color: "from-violet-600 to-purple-600",
    },
    {
      value: "adventure",
      label: "مغامرة",
      icon: Compass,
      color: "from-orange-600 to-amber-600",
    },
    {
      value: "horror",
      label: "رعب",
      icon: Ghost,
      color: "from-slate-700 to-gray-900",
    },
    {
      value: "mystery",
      label: "غموض",
      icon: Search,
      color: "from-indigo-600 to-blue-600",
    },
    {
      value: "romance",
      label: "رومانسي",
      icon: Heart,
      color: "from-rose-600 to-pink-600",
    },
    {
      value: "scifi",
      label: "خيال علمي",
      icon: Rocket,
      color: "from-cyan-600 to-blue-600",
    },
    {
      value: "kids",
      label: "قصص أطفال",
      icon: Baby,
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "educational",
      label: "تعليمي",
      icon: GraduationCap,
      color: "from-emerald-600 to-green-600",
    },
  ];

  const ageRanges = [
    { value: "3-5", label: "3-5 سنوات" },
    { value: "6-8", label: "6-8 سنوات" },
    { value: "9-12", label: "9-12 سنة" },
    { value: "13-16", label: "13-16 سنة" },
    { value: "17+", label: "17+ سنة" },
  ];

  const artStyles = [
    { value: "storybook", label: "قصصي", icon: BookOpen },
    { value: "anime", label: "أنمي", icon: Wand2 },
    { value: "watercolor", label: "ألوان مائية", icon: Palette },
    { value: "realistic", label: "واقعي", icon: Eye },
    { value: "pixel", label: "بيكسل آرت", icon: Grid3x3 },
    { value: "dark-fantasy", label: "خيال مظلم", icon: Ghost },
  ];

  return (
    <div className="min-h-screen bg-[var(--earth-cream)] rtl" dir="rtl">
      {/* NAVBAR WITH COLLAPSE CONTROL */}
      <Navbar
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* DYNAMIC LAYOUT SPACING BASED ON COLLAPSED STATE */}
      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex-1 flex flex-col">
          {/* PAGE HEADER */}
          <PageHeader
            mainTitle={pageName}
          />

          {/* CONTENT */}
          <div className="flex-1 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Story Title */}
              <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-3 uppercase tracking-wide">
                  <BookOpen className="w-4 h-4" />
                  عنوان القصة
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="أدخل عنوان القصة"
                  className="w-full text-2xl font-semibold bg-transparent border-none focus:outline-none text-[var(--earth-brown)] placeholder:text-[var(--earth-brown)]/30"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-2">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-3 uppercase tracking-wide">
                  <Eye className="w-4 h-4" />
                  وصف القصة
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="اكتب وصفاً موجزاً للقصة"
                  className="w-full min-h-[120px] bg-transparent border-none focus:outline-none resize-none text-[var(--earth-brown)]/80 text-lg leading-relaxed placeholder:text-[var(--earth-brown)]/30"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Genre Selection */}
              <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-6 uppercase tracking-wide">
                  <Layers className="w-4 h-4" />
                  نوع القصة
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {genres.map((genre) => {
                    const Icon = genre.icon;
                    return (
                      <button
                        key={genre.value}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "genre", value: genre.value },
                          })
                        }
                        onMouseEnter={() => setHoveredGenre(genre.value)}
                        onMouseLeave={() => setHoveredGenre(null)}
                        className={`relative overflow-hidden rounded-lg p-5 transition-all duration-300 group ${
                          form.genre === genre.value
                            ? "ring-2 ring-[var(--earth-brown)] shadow-lg"
                            : "border border-[var(--earth-brown)]/10 hover:border-[var(--earth-brown)]/30 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${
                            genre.color
                          } transition-opacity duration-300 ${
                            form.genre === genre.value ||
                            hoveredGenre === genre.value
                              ? "opacity-10"
                              : "opacity-0"
                          }`}
                        ></div>
                        <div className="relative flex flex-col items-center gap-3">
                          <Icon
                            className={`w-6 h-6 transition-all duration-300 ${
                              form.genre === genre.value
                                ? "text-[var(--earth-brown)] scale-110"
                                : "text-[var(--earth-brown)]/60 group-hover:text-[var(--earth-brown)] group-hover:scale-110"
                            }`}
                          />
                          <span
                            className={`font-medium text-sm transition-colors ${
                              form.genre === genre.value
                                ? "text-[var(--earth-brown)]"
                                : "text-[var(--earth-brown)]/60 group-hover:text-[var(--earth-brown)]"
                            }`}
                          >
                            {genre.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.genre && (
                  <p className="text-red-600 text-sm mt-4">{errors.genre}</p>
                )}
              </div>

              {/* Age Range */}
              <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-6 uppercase tracking-wide">
                  <Users className="w-4 h-4" />
                  الفئة العمرية
                </label>
                <div className="flex flex-wrap gap-3">
                  {ageRanges.map((age) => (
                    <button
                      key={age.value}
                      type="button"
                      onClick={() =>
                        handleChange({
                          target: { name: "ageRange", value: age.value },
                        })
                      }
                      className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                        form.ageRange === age.value
                          ? "bg-[var(--earth-brown)] text-white shadow-md"
                          : "bg-[var(--earth-cream)] text-[var(--earth-brown)] border border-[var(--earth-brown)]/20 hover:bg-white hover:border-[var(--earth-brown)]/40"
                      }`}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
                {errors.ageRange && (
                  <p className="text-red-600 text-sm mt-4">{errors.ageRange}</p>
                )}
              </div>

              {/* Cover Upload */}
              <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-4 uppercase tracking-wide">
                  <Image className="w-4 h-4" />
                  غلاف القصة
                </label>
                <input
                  type="file"
                  name="cover"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-[var(--earth-brown)]/20 rounded-lg cursor-pointer hover:border-[var(--earth-brown)]/40 hover:bg-[var(--earth-cream)] transition-all duration-200 group overflow-hidden"
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="معاينة الغلاف"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Image className="w-12 h-12 text-[var(--earth-brown)]/40 mb-3 group-hover:text-[var(--earth-brown)]/60 transition-colors" />
                      <span className="text-[var(--earth-brown)] font-medium mb-1">
                        {form.cover ? form.cover.name : "اضغط لرفع الغلاف"}
                      </span>
                      <span className="text-[var(--earth-brown)]/60 text-sm">
                        PNG, JPG, WEBP (حتى 10MB)
                      </span>
                    </>
                  )}
                </label>
                {errors.cover && (
                  <p className="text-red-600 text-sm mt-2">{errors.cover}</p>
                )}
              </div>

              {/* Scene & Options Configuration */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-6 uppercase tracking-wide">
                    <Calendar className="w-4 h-4" />
                    عدد المشاهد
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "sceneNum", value: n },
                          })
                        }
                        className={`aspect-square rounded-lg font-semibold text-lg transition-all duration-200 ${
                          form.sceneNum == n
                            ? "bg-[var(--earth-brown)] text-white shadow-md"
                            : "bg-[var(--earth-cream)] text-[var(--earth-brown)] border border-[var(--earth-brown)]/20 hover:bg-white hover:border-[var(--earth-brown)]/40"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {errors.sceneNum && (
                    <p className="text-red-600 text-sm mt-3">
                      {errors.sceneNum}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-6 uppercase tracking-wide">
                    <Grid3x3 className="w-4 h-4" />
                    عدد الخيارات
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "optionNum", value: n },
                          })
                        }
                        className={`aspect-square rounded-lg font-semibold text-2xl transition-all duration-200 ${
                          form.optionNum == n
                            ? "bg-[var(--earth-brown)] text-white shadow-md"
                            : "bg-[var(--earth-cream)] text-[var(--earth-brown)] border border-[var(--earth-brown)]/20 hover:bg-white hover:border-[var(--earth-brown)]/40"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {errors.optionNum && (
                    <p className="text-red-600 text-sm mt-3">
                      {errors.optionNum}
                    </p>
                  )}
                </div>
              </div>

              {/* Art Style */}
              <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--earth-brown)] mb-6 uppercase tracking-wide">
                  <Palette className="w-4 h-4" />
                  نمط الرسم{" "}
                  <span className="text-[var(--earth-brown)]/40 font-normal mr-2">
                    (اختياري)
                  </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {artStyles.map((style) => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "artStyle", value: style.value },
                          })
                        }
                        className={`rounded-lg p-5 transition-all duration-200 group ${
                          form.artStyle === style.value
                            ? "bg-[var(--earth-brown)] text-white shadow-md"
                            : "bg-[var(--earth-cream)] text-[var(--earth-brown)] border border-[var(--earth-brown)]/20 hover:bg-white hover:border-[var(--earth-brown)]/40"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 mb-2 mx-auto transition-transform group-hover:scale-110 ${
                            form.artStyle === style.value
                              ? "text-white"
                              : "text-[var(--earth-brown)]/60"
                          }`}
                        />
                        <div className="font-medium text-sm text-center">
                          {style.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Prompts */}
              <div className="bg-white rounded-xl border border-[var(--earth-brown)]/10 p-8 hover:border-[var(--earth-brown)]/20 transition-colors duration-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Wand2 className="w-4 h-4 text-[var(--earth-brown)]" />
                  <h3 className="text-sm font-semibold text-[var(--earth-brown)] uppercase tracking-wide">
                    توجيهات الذكاء الاصطناعي
                    <span className="text-[var(--earth-brown)]/40 font-normal mr-2">
                      (اختياري)
                    </span>
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-[var(--earth-brown)]/70 mb-2 block">
                      التوجيه الإيجابي
                    </label>
                    <textarea
                      name="positivePrompt"
                      value={form.positivePrompt}
                      onChange={handleChange}
                      placeholder="حدد الخصائص المرغوبة في الصور (مثل: إضاءة طبيعية، تفاصيل دقيقة، ألوان دافئة)"
                      className="w-full min-h-[100px] bg-[var(--earth-cream)] rounded-lg px-4 py-3 border border-[var(--earth-brown)]/10 focus:border-[var(--earth-brown)]/30 focus:bg-white focus:outline-none resize-none text-[var(--earth-brown)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--earth-brown)]/70 mb-2 block">
                      التوجيه السلبي
                    </label>
                    <textarea
                      name="negativePrompt"
                      value={form.negativePrompt}
                      onChange={handleChange}
                      placeholder="حدد ما تريد تجنبه في الصور (مثل: مشاهد عنيفة، ألوان قاتمة، تشوهات)"
                      className="w-full min-h-[100px] bg-[var(--earth-cream)] rounded-lg px-4 py-3 border border-[var(--earth-brown)]/10 focus:border-[var(--earth-brown)]/30 focus:bg-white focus:outline-none resize-none text-[var(--earth-brown)] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6 pb-12">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-12 py-4 rounded-xl bg-[var(--earth-brown)] text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإنشاء..." : "إنشاء القصة التفاعلية"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default NewInteractiveStoryForm;
