/* eslint-disable */
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
  Palette,
  Image as ImageIcon,
  Wand2,
  Eye,
  Calendar,
  Layers,
  Baby,
  Sparkles,
  Target,
  Clapperboard,
  Monitor,
  MessageSquare,
  Info,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const InfoTooltip = ({ content }) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center ml-2 text-black/20 hover:text-[#5de3ba] transition-colors"
        >
          <Info size={14} strokeWidth={2.5} />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-black text-white border-white/10 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest max-w-[250px] text-center shadow-2xl leading-relaxed"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

function NewInteractiveStoryForm({ pageName = "قصة تفاعلية جديدة", onSubmit }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    cover: null,
    lens: "",
    sceneCount: "",
    constitution: {
      settingTime: "",
      settingPlace: "",
      coreTheme: "",
      tone: "",
      philosophy: "",
      mainConflict: "",
      forbiddenElements: "",
      pacing: "",
    },
    artStyle: "",
  });
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      genre: "",
      cover: null,
      lens: "",
      sceneCount: "",
      constitution: {
        settingTime: "",
        settingPlace: "",
        coreTheme: "",
        tone: "",
        philosophy: "",
        mainConflict: "",
        forbiddenElements: "",
        pacing: "",
      },
      artStyle: "",
    });
    setErrors({});
    setCoverPreview(null);
  };

  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const processToSquare = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          // Standardize to 1024x1024 for high quality square
          const targetSize = 1024;
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext("2d");

          const minDim = Math.min(img.width, img.height);
          const offsetX = (img.width - minDim) / 2;
          const offsetY = (img.height - minDim) / 2;

          ctx.drawImage(
            img,
            offsetX,
            offsetY,
            minDim,
            minDim,
            0,
            0,
            targetSize,
            targetSize,
          );
          canvas.toBlob(
            (blob) => {
              // Create a new File object from the blob to maintain file properties
              const squareFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(squareFile);
            },
            file.type,
            0.9,
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name?.startsWith("constitution.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        constitution: {
          ...prev.constitution,
          [key]: value,
        },
      }));
      return;
    }
    if (name === "cover" && files?.[0]) {
      const file = files[0];
      setIsProcessingImage(true);
      try {
        const processedFile = await processToSquare(file);
        const previewUrl = URL.createObjectURL(processedFile);
        setCoverPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return previewUrl;
        });
        setForm((prev) => ({ ...prev, cover: processedFile }));
      } catch (err) {
        console.error("Image processing failed:", err);
        AlertToast("فشل معالجة الصورة", "error");
      } finally {
        setIsProcessingImage(false);
      }
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
      cover: "غلاف القصة",
      lens: "منظور القصة",
      sceneCount: "عدد المشاهد",
      "constitution.settingTime": "الزمن",
      "constitution.settingPlace": "المكان",
      "constitution.coreTheme": "الفكرة المحورية",
      "constitution.tone": "النبرة العامة",
      "constitution.philosophy": "الفلسفة",
      "constitution.mainConflict": "الصراع الأساسي",
      "constitution.forbiddenElements": "العناصر الممنوعة",
      "constitution.pacing": "إيقاع السرد",
      artStyle: "نمط الرسم",
    };

    if (!form.title.trim()) {
      newErrors.title = "عنوان القصة مطلوب";
      missingFields.push(fieldLabels.title);
    }

    if (!form.genre) {
      newErrors.genre = "يرجى اختيار نوع القصة";
      missingFields.push(fieldLabels.genre);
    }
    if (!form.cover) {
      newErrors.cover = "غلاف القصة مطلوب";
      missingFields.push(fieldLabels.cover);
    }
    if (!form.lens) {
      newErrors.lens = "يرجى اختيار منظور القصة";
      missingFields.push(fieldLabels.lens);
    }
    if (!form.sceneCount) {
      newErrors.sceneCount = "يرجى اختيار عدد المشاهد";
      missingFields.push(fieldLabels.sceneCount);
    }
    if (!form.artStyle) {
      newErrors.artStyle = "يرجى اختيار نمط الرسم";
      missingFields.push(fieldLabels.artStyle);
    }
    if (!form.description.trim()) {
      newErrors.description = "  ملاحظات الهوية البصرية  ";
      missingFields.push(fieldLabels.description);
    }

    const c = form.constitution || {};
    const constitutionFields = [
      "settingTime",
      "settingPlace",
      "coreTheme",
      "tone",
      "philosophy",
      "mainConflict",
      "forbiddenElements",
      "pacing",
    ];

    constitutionFields.forEach((key) => {
      if (!String(c[key] ?? "").trim()) {
        const errorKey = `constitution.${key}`;
        newErrors[errorKey] = "حقل مطلوب";
        missingFields.push(fieldLabels[errorKey]);
      }
    });

    setErrors(newErrors);
    return {
      valid: Object.keys(newErrors).length === 0,
      missingFields,
    };
  };

  const handleSubmit = async () => {
    const { valid, missingFields } = validateForm();
    if (!valid) {
      AlertToast(
        `يرجى إكمال الحقول المطلوبة: ${missingFields[0]}...`,
        "info",
        "بيانات ناقصة",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await onSubmit(form);
      if (success) {
        AlertToast("تم إطلاق قصتك بنجاح", "success", "مبروك!");
        resetForm();
      } else {
        AlertToast("فشل إنشاء القصة، يرجى المحاولة لاحقاً", "error", "خطأ");
      }
    } catch {
      AlertToast("حدث خطأ غير متوقع", "error", "خطأ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const genres = [
    {
      value: "مغامرة",
      label: "مغامرة",
      icon: Compass,
      color: "from-[#5ae0ff] to-[#00a8ff]",
    },
    {
      value: "غموض",
      label: "غموض",
      icon: Search,
      color: "from-indigo-600 to-purple-600",
    },
    {
      value: "خيال علمي",
      label: "خيال علمي",
      icon: Rocket,
      color: "from-cyan-500 to-blue-500",
    },
    {
      value: "فانتازيا",
      label: "فانتازيا",
      icon: Wand2,
      color: "from-[#5de3ba] to-[#76debf]",
    },
    {
      value: "رعب",
      label: "رعب",
      icon: Ghost,
      color: "from-slate-700 to-black",
    },
    {
      value: "تاريخي",
      label: "تاريخي",
      icon: Calendar,
      color: "from-amber-600 to-orange-700",
    },
    {
      value: "رومانسية",
      label: "رومانسية",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
    },
    {
      value: "ما بعد الكارثة",
      label: "ما بعد الكارثة",
      icon: Rocket,
      color: "from-gray-600 to-slate-800",
    },
    {
      value: "ديستوبيا",
      label: "ديستوبيا",
      icon: Monitor,
      color: "from-slate-600 to-slate-900",
    },
    {
      value: "بطل خارق",
      label: "بطل خارق",
      icon: Sparkles,
      color: "from-blue-600 to-red-600",
    },
    {
      value: "إثارة نفسية",
      label: "إثارة نفسية",
      icon: Eye,
      color: "from-purple-900 to-black",
    },
    {
      value: "تحقيق",
      label: "تحقيق",
      icon: Search,
      color: "from-blue-900 to-indigo-900",
    },
    {
      value: "شركات",
      label: "شركات",
      icon: Target,
      color: "from-gray-700 to-gray-900",
    },
    {
      value: "دراما طبية",
      label: "دراما طبية",
      icon: Heart,
      color: "from-red-400 to-red-600",
    },
    {
      value: "رحلة",
      label: "رحلة",
      icon: Compass,
      color: "from-emerald-500 to-green-700",
    },
    {
      value: "دراما سياسية",
      label: "دراما سياسية",
      icon: Target,
      color: "from-slate-800 to-blue-900",
    },
  ];

  const lenses = [
    {
      value: "POLITICAL",
      label: "سياسي",
      icon: Target,
      color: "from-slate-800 to-black",
    },
    {
      value: "PSYCHOLOGICAL",
      label: "نفسي",
      icon: Heart,
      color: "from-rose-600 to-pink-700",
    },
    {
      value: "SURVIVAL",
      label: "بقاء",
      icon: Rocket,
      color: "from-orange-600 to-amber-700",
    },
    {
      value: "MORAL",
      label: "أخلاقي",
      icon: Sparkles,
      color: "from-emerald-600 to-green-700",
    },
  ];

  const artStyles = [
    { value: "CINEMATIC_STORYBOOK", label: "قصصي سينمائي", icon: BookOpen },
    { value: "REALISTIC", label: "واقعي سينمائي", icon: Eye },
    { value: "ANIME", label: "أنمي سينمائي", icon: Wand2 },
    { value: "COMIC_BOOK", label: "قصص مصوّرة", icon: MessageSquare },
    { value: "WATERCOLOR", label: "ألوان مائية", icon: Palette },
    { value: "PIXAR_3D", label: "ثلاثي الأبعاد", icon: Monitor },
    { value: "NOIR", label: "نوار سينمائي", icon: Clapperboard },
  ];

  return (
    <div className="min-h-screen bg-white rtl" dir="rtl">
      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300 ${collapsed ? "md:mr-20" : "md:mr-64"}`}
      >
        <main className="flex-1 flex flex-col">
          <PageHeader mainTitle={pageName} />

          <div className="flex-1 p-8 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Story Title  */}
              <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                  <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-500 space-y-12">
                    <div className="space-y-6">
                      <label className="flex items-center gap-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 px-2 leading-tight">
                        <Sparkles className="w-4 h-4 text-[#5de3ba]" />
                        هوية القصة
                        <InfoTooltip content="عنوان القصة الذي سيظهر للقرّاء. يجب أن يكون واضحًا، معبّرًا، وغير فارغ." />
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="عنوان القصة الملحمي..."
                        className="w-full bg-black/[0.04] border border-black/10 rounded-[2rem] px-5 md:px-8 py-5 md:py-6 text-xl md:text-5xl font-black text-black placeholder:text-black/10 focus:bg-white focus:border-[#5de3ba] focus:ring-4 focus:ring-[#5de3ba]/5 outline-none transition-all tracking-tight"
                      />
                    </div>
                  </div>

                  {/* Genre Grid */}
                  <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
                    <label className="flex items-center gap-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 mb-6">
                      <Layers className="w-4 h-4 text-[#5de3ba]" />
                      النوع
                      <InfoTooltip content="تصنيف عام للقصة لمساعدة القارئ على اكتشاف نوع مغامرتك." />
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {genres.map((genre) => {
                        const Icon = genre.icon;
                        const isActive = form.genre === genre.value;
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
                            className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-500 group ${isActive ? "shadow-2xl scale-105 z-10" : "border border-black/5 hover:border-black/10"}`}
                          >
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${genre.color} transition-opacity duration-500 ${isActive ? "opacity-100" : hoveredGenre === genre.value ? "opacity-10" : "opacity-0"}`}
                            />
                            <div className="relative flex flex-col items-center gap-4">
                              <Icon
                                className={`w-7 h-7 transition-all duration-500 ${isActive ? "text-white rotate-12" : "text-black group-hover:scale-110"}`}
                              />
                              <span
                                className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-white" : "text-black/40"}`}
                              >
                                {genre.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Cover Image */}
                <div className="space-y-8">
                  <div className="bg-white rounded-[2.5rem] border border-black/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)] flex flex-col items-center">
                    <label className="w-full flex items-center gap-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 mb-6">
                      <ImageIcon className="w-4 h-4 text-[#5de3ba]" />
                      الغلاف المرئي (Square 1:1)
                      <InfoTooltip content="الصورة التي ستمثل القصة في المكتبة. يفضل أن تكون عالية الجودة وبنسبة مربعة." />
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
                        className={`w-full aspect-square rounded-[2rem] border-2 border-dashed border-black/5 cursor-pointer transition-all duration-500 overflow-hidden relative group ${coverPreview ? "bg-white shadow-lg shadow-[#5de3ba]/5 border-[#5de3ba]/30" : "bg-black/[0.04] hover:border-[#5de3ba]/50 hover:bg-white"}`}
                      >
                        {isProcessingImage ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-12 h-12 text-[#5de3ba] animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#5de3ba]">
                              جاري معالجة الصورة...
                            </span>
                          </div>
                        ) : coverPreview ? (
                          <img
                            src={coverPreview}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <ImageIcon className="w-12 h-12 text-black/10 group-hover:text-[#5de3ba] transition-colors duration-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/20">
                              رفع صورة الغلاف
                            </span>
                          </div>
                        )}
                      </label>
                  </div>

                  {/* Scene Count */}
                  <div className="bg-white rounded-[2.5rem] border border-black/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
                    <label className="flex items-center gap-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 mb-6">
                      <Calendar className="w-4 h-4 text-[#5de3ba]" />
                      طول الرحلة
                      <InfoTooltip content="عدد المشاهد التي تتكوّن منها القصة. كل مشهد يمثل دورًا واحدًا للقارئ." />
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() =>
                            handleChange({
                              target: { name: "sceneCount", value: n },
                            })
                          }
                          className={`h-11 md:h-12 rounded-xl text-[10px] md:text-xs font-black transition-all duration-300 ${form.sceneCount == n ? "bg-white border-[#5de3ba]/30 text-[#5de3ba] shadow-lg shadow-[#5de3ba]/5 scale-110" : "bg-black/[0.04] border border-black/5 text-black hover:bg-black/10"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lens Selection - Premium Grid */}
              <div className="bg-white rounded-[3rem] border border-black/5 p-12 shadow-[0_40px_100px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col items-center text-center mb-16">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-[#5de3ba]">
                      The Narrative Lens
                    </span>
                    <InfoTooltip content="يحدد نوع العواقب التي تتغير عند الاختيار. POLITICAL: سلطة ونفوذ، PSYCHOLOGICAL: مشاعر، SURVIVAL: بقاء، MORAL: أخلاق." />
                  </div>
                  <h3 className="text-2xl md:text-6xl font-black text-black tracking-tighter">
                    اختر منظور المغامرة
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {lenses.map((lens) => {
                    const Icon = lens.icon;
                    const isActive = form.lens === lens.value;
                    return (
                      <button
                        key={lens.value}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "lens", value: lens.value },
                          })
                        }
                         className={`relative group p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-700 bg-white border border-black/5 ${isActive ? "shadow-2xl shadow-[#5de3ba]/10 scale-105 border-[#5de3ba]/30" : "hover:border-[#5de3ba]/30 hover:shadow-xl"}`}
                      >
                        <div
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 mx-auto transition-all duration-700 ${isActive ? "bg-[#5de3ba] rotate-12" : "bg-black/[0.04] group-hover:bg-[#5de3ba]/10"}`}
                        >
                          <Icon
                            className={`w-6 h-6 md:w-8 md:h-8 ${isActive ? "text-white" : "text-black group-hover:text-[#5de3ba]"}`}
                          />
                        </div>
                        <span
                          className={`block text-base md:text-lg font-black tracking-tight mb-2 ${isActive ? "text-[#5de3ba]" : "text-black/40"}`}
                        >
                          {lens.label}
                        </span>
                        <div
                          className={`h-1 w-8 mx-auto rounded-full transition-all duration-700 ${isActive ? "bg-[#5de3ba]" : "bg-black/5"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Constitution - Glass Inputs */}
              <div className="bg-white rounded-[3rem] border border-black/5 p-12 shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-black/[0.04] text-[#5de3ba] flex items-center justify-center shadow-sm">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black tracking-tight">
                        دستور المغامرة
                      </h3>
                      <InfoTooltip content="قانون القصة الذي يلتزم به النظام والذكاء الاصطناعي." />
                    </div>
                    <p className="text-sm md:text-base font-black uppercase tracking-widest text-black/40">
                      قواعد السرد والقوانين الكونية
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                  {[
                    {
                      key: "settingTime",
                      label: "الزمن",
                      placeholder: "مثال: عصر السايبربانك العربي",
                    },
                    {
                      key: "settingPlace",
                      label: "المكان",
                      placeholder: "مثال: واحة ميكانيكية مدفونة",
                    },
                    {
                      key: "coreTheme",
                      label: "الفكرة المحورية",
                      placeholder: "مثال: التضحية مقابل المعرفة",
                    },
                    {
                      key: "tone",
                      label: "النبرة",
                      placeholder: "مثال: ملحمي، غامض، عاطفي",
                    },
                    {
                      key: "philosophy",
                      label: "الفلسفة",
                      placeholder: "مثال: المصير اختراع شخصي",
                    },
                    {
                      key: "mainConflict",
                      label: "الصراع",
                      placeholder: "مثال: البشرية ضد الذكاء المطلق",
                    },
                    {
                      key: "forbiddenElements",
                      label: "الممنوعات",
                      placeholder: "مثال: لا سحر، لا كوميديا مرتجلة",
                    },
                    {
                      key: "pacing",
                      label: "الإيقاع",
                      placeholder: "مثال: تسارع نبضي متزايد",
                    },
                  ].map((field) => (
                    <div key={field.key} className="space-y-4">
                      <label className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 px-2 transition-colors group-focus-within:text-[#5de3ba]">
                        {field.label}
                      </label>
                      <input
                        name={`constitution.${field.key}`}
                        value={form.constitution[field.key]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full bg-black/[0.04] border border-black/10 rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-base font-bold text-black placeholder:text-black/10 focus:bg-white focus:border-[#5de3ba] focus:ring-4 focus:ring-[#5de3ba]/5 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Art Style - Visual Grid */}
              <div className="bg-white rounded-[3rem] border border-black/5 p-12 shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
                <label className="flex items-center gap-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 mb-12">
                  <Palette className="w-4 h-4 text-[#5de3ba]" />
                  الهوية البصرية (AI Style)
                  <InfoTooltip content="النمط الفني الذي سيتبعه الذكاء الاصطناعي في توليد صور المشاهد." />
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {artStyles.map((style) => {
                    const Icon = style.icon;
                    const isActive = form.artStyle === style.value;
                    return (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "artStyle", value: style.value },
                          })
                        }
                        className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 text-center border bg-white ${isActive ? "shadow-2xl shadow-[#5de3ba]/10 border-[#5de3ba]/30 scale-105" : "border-black/5 hover:border-black/20 hover:shadow-lg"}`}
                      >
                        <Icon
                          className={`w-7 h-7 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 transition-colors ${isActive ? "text-[#5de3ba]" : "text-black/10"}`}
                        />
                        <div className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${isActive ? "text-[#5de3ba]" : "text-black/40"}`}>
                          {style.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 px-2">
                  <Eye className="w-4 h-4 text-[#5de3ba]" />
                  ملاحظات الهوية البصرية
                  <InfoTooltip content="شرح موجز لجوهر القصة لمساعدة الذكاء الاصطناعي في الفهم العام للدراما." />
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="اكتب وصفاً يحفز خيال الذكاء الاصطناعي لرسم هذا العالم..."
                  className="w-full min-h-[160px] md:min-h-[200px] bg-black/[0.04] border border-black/10 rounded-[2rem] px-6 md:px-8 py-6 md:py-8 text-black/80 text-lg md:text-xl font-bold font-arabic leading-relaxed placeholder:text-black/10 focus:bg-white focus:border-[#5de3ba] focus:ring-4 focus:ring-[#5de3ba]/5 outline-none transition-all resize-none"
                />
              </div>

              {/* Action */}
              <div className="flex justify-center pt-10 pb-20">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-premium px-20 py-6 rounded-[2.5rem] text-white font-black text-xs uppercase tracking-[0.3em] disabled:opacity-50"
                >
                  {isSubmitting
                    ? "جاري بناء العالم..."
                    : "إطلاق القصة التفاعلية"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-3xl flex items-center justify-center z-[200]">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default NewInteractiveStoryForm;
