import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import {
  ArrowRight,
  ArrowLeft,
  User,
  BookOpen,
  Clock,
  Layers,
  Loader2,
  Upload,
  Trash2,
  AlertCircle,
  Palette,
  Eye,
  Scissors,
  Glasses,
  Check,
  MapPin,
  Compass,
  Heart,
} from "lucide-react";
import { InputComponent as Input } from "@/components/myui/forms/Input/Input";
import { Select } from "@/components/myui/forms/Select/Select";
import { TextareaComponent as Textarea } from "@/components/myui/forms/Textarea/Textarea";
import { StoryBookStepper } from "../components/StoryBookStepper/StoryBookStepper";
import { useNewStoryBook } from "../hooks/useNewStoryBook";
import {
  AGE_BANDS,
  CHILD_GENDERS,
  SKIN_TONES,
  HAIR_COLORS,
  HAIR_STYLES,
  EYE_COLORS,
  STORY_SETTINGS,
  STORY_TONES,
  STORY_THEMES,
  INTERESTS,
  STORY_TIMES,
  PAGE_COUNTS,
  LANGUAGE_VARIETIES,
  TASHKEEL_LEVELS,
  COMPANION_TYPES,
  PET_COLORS,
} from "../constants/storyBooksConstants";
import "./NewStoryBookView.css";

/**
 * Editorial Studio View for Creating Children's Story Books.
 * Streamlined 4-step wizard:
 * 1. Child Data with all appearance selectors (Select inputs instead of radio/circles) + Secured Optional Image
 * 2. Story Idea (Text Input) + Interests (Text Input) + Setting & Time (Selects) + Optional Companion & Values
 * 3. Book Specs (Selects for pages, variety, tashkeel) + Dedication
 * 4. Review & Launch
 */
export function NewStoryBookView({ pageName = "ابتكار قصة أطفال جديدة" }) {
  const location = useLocation();

  const {
    currentStep,
    isSubmitting,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    handleSaveAndPublish,

    // Hero / Child Data
    children,
    selectedChildId,
    handleSelectChild,
    newChildData,
    handleNewChildChange,
    handleAppearanceChange,

    // Story Data
    storyData,
    handleStoryChange,
    handleCompanionChange,
    handleInterestToggle,

    // Backend Dynamic Filters
    filters,
  } = useNewStoryBook();

  // Local state for secured optional hero image
  const [heroImagePreview, setHeroImagePreview] = useState(
    newChildData?.image?.previewUrl || null
  );
  const [heroImageName, setHeroImageName] = useState(
    newChildData?.image?.name || ""
  );
  const [heroImageSize, setHeroImageSize] = useState(
    newChildData?.image?.size || ""
  );
  const [imageError, setImageError] = useState("");

  // Handle secured image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");

    // Strict formats: jpg, jpeg, png, webp
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = allowedExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !hasValidExt) {
      setImageError("الصيغ المقبولة: JPG, JPEG, PNG فقط.");
      return;
    }

    // Max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError("الحد الأقصى لحجم الملف هو 5 ميجابايت.");
      return;
    }

    // 4. File name sanitization
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت`
        : `${Math.round(file.size / 1024)} كيلوبايت`;

    const previewUrl = URL.createObjectURL(file);
    setHeroImagePreview(previewUrl);
    setHeroImageName(cleanName);
    setHeroImageSize(formattedSize);
    handleNewChildChange("image", {
      file,
      previewUrl,
      name: cleanName,
      size: formattedSize,
    });
  };

  const handleRemoveImage = () => {
    if (heroImagePreview && heroImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(heroImagePreview);
    }
    setHeroImagePreview(null);
    setHeroImageName("");
    setHeroImageSize("");
    setImageError("");
    handleNewChildChange("image", null);
  };

  // Dynamic filter options derived from backend API or constants
  const dynamicGenders = filters?.genders?.map((g) => ({ value: g.value, label: g.labelAr })) || CHILD_GENDERS;
  const dynamicAgeBands = filters?.ageBands?.map((a) => ({ value: a.value, label: a.labelAr })) || AGE_BANDS;
  const dynamicSkinTones = filters?.skinTones?.map((s) => ({ value: s.value, label: s.labelAr, color: s.color })) || SKIN_TONES;
  const dynamicEyeColors = filters?.eyeColors?.map((e) => ({ value: e.value, label: e.labelAr, color: e.color })) || EYE_COLORS;
  const dynamicHairColors = filters?.hairColors?.map((h) => ({ value: h.value, label: h.labelAr, color: h.color })) || HAIR_COLORS;
  const dynamicHairStyles = filters?.hairStyles?.map((s) => ({ value: s.value, label: s.labelAr })) || HAIR_STYLES;
  const dynamicSettings = filters?.settings?.map((s) => ({ value: s.value, label: s.labelAr })) || STORY_SETTINGS;
  const dynamicTimesOfDay = filters?.timesOfDay?.map((t) => ({ value: t.value, label: t.labelAr })) || STORY_TIMES;
  const dynamicPageCounts = filters?.pageCounts || PAGE_COUNTS;
  const dynamicVarieties = filters?.languageVarieties?.map((v) => ({ value: v.value, label: v.labelAr })) || LANGUAGE_VARIETIES;
  const dynamicTashkeel = filters?.tashkeelLevels?.map((t) => ({ value: t.value, label: t.labelAr })) || TASHKEEL_LEVELS;

  // Options mapped for Select dropdowns with color swatches
  const genderOptions = dynamicGenders.map((g) => ({ value: g.value, label: g.label }));
  const ageBandOptions = dynamicAgeBands.map((a) => ({ value: a.value, label: a.label }));
  const skinToneOptions = dynamicSkinTones.map((s) => ({ value: s.value, label: s.label, color: s.color }));
  const eyeColorOptions = dynamicEyeColors.map((e) => ({ value: e.value, label: e.label, color: e.color }));
  const hairColorOptions = dynamicHairColors.map((h) => ({ value: h.value, label: h.label, color: h.color }));
  const hairStyleOptions = dynamicHairStyles.map((s) => ({ value: s.value, label: s.label }));
  const pageCountOptions = dynamicPageCounts.map((cnt) => ({ value: cnt, label: `${cnt} صفحة` }));

  const hijabOptions = [
    { value: false, label: "بدون حجاب" },
    { value: true, label: "ترتدي الحجاب" },
  ];

  const glassesOptions = [
    { value: false, label: "بدون نظارات" },
    { value: true, label: "يرتدي نظارات طبية" },
  ];

  const breadcrumb = location.state?.from || {
    parentLabel: "قصص الأطفال",
    parentPath: "/reader/story-books",
  };

  const unwrapScalar = (val, fallback = "") => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === "object") {
      if ("value" in val && typeof val.value !== "object") return val.value;
      if ("target" in val && val.target && typeof val.target.value !== "object") return val.target.value;
      return fallback;
    }
    return val;
  };

  const safeGender = unwrapScalar(newChildData?.gender, "BOY");
  const safeAgeBand = unwrapScalar(newChildData?.ageBand, "AGE_3_5");
  const safeSkinTone = unwrapScalar(newChildData?.appearance?.skinTone, "LIGHT");

  const selectedGenderLabel = genderOptions.find((g) => g.value === safeGender)?.label || "ولد";
  const selectedAgeBandLabel = ageBandOptions.find((a) => a.value === safeAgeBand)?.label || "٣ - ٥ سنوات";
  const selectedSkinToneLabel = skinToneOptions.find((s) => s.value === safeSkinTone)?.label || "فاتحة";

  return (
    <AppLayout pageName={pageName} breadcrumb={breadcrumb} showSearch={false}>
      <div className="new-child-story-page" dir="rtl">
        {/* Sticky Stepper Bar */}
        <div className="new-child-story-stepper-bar">
          <div className="new-child-story-stepper-inner">
            <StoryBookStepper
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>
        </div>

        {/* Step Content Container */}
        <div className="new-child-story-container">
          {/* ================================================================
              STEP 1: Child Data (Clean Form, Select inputs, Optional Image)
              ================================================================ */}
          {currentStep === 1 && (
            <div className="new-child-story-step">
              <div className="new-child-story-card">
                <div className="new-child-story-section-header-row">
                  <span className="new-child-story-section-label">بيانات ومواصفات بطل القصة:</span>
                </div>

                <div className="new-child-story-form-grid">
                  {/* Saved Child Profiles Selector */}
                  {Array.isArray(children) && children.length > 0 && (
                    <div className="new-child-story-col--full">
                      <Select
                        label="اختيار بطل من الملفات المحفوظة"
                        placeholder="اختر طفلاً محفوظاً أو أنشئ بطلاً جديداً..."
                        options={[
                          { value: "NEW", label: "✨ إدخال بطل جديد (ملف فارغ)" },
                          ...children.map((c) => {
                            const genderText = c.gender === "BOY" ? "ولد" : "بنت";
                            const ageBandObj = dynamicAgeBands.find((a) => a.value === c.ageBand);
                            const ageText = ageBandObj?.label || (c.ageBand === "AGE_3_5" ? "٣ - ٥ سنوات" : c.ageBand === "AGE_6_8" ? "٦ - ٨ سنوات" : "٩ - ١٠ سنوات");
                            return {
                              value: c.id,
                              label: `${c.nameAr} (#${c.id} • ${genderText} • ${ageText})`,
                            };
                          }),
                        ]}
                        value={selectedChildId || "NEW"}
                        onChange={(e, val) => handleSelectChild(val !== undefined ? val : e?.target?.value ?? e)}
                        icon={<User size={16} />}
                      />
                    </div>
                  )}

                  {/* Hero Name (Text Input) */}
                  <div className="new-child-story-col--full">
                    <Input
                      label="اسم الطفل باللغة العربية"
                      placeholder="مثال: كريم، سارة، يوسف، ليلى..."
                      value={newChildData.nameAr}
                      onChange={(e) => handleNewChildChange("nameAr", e.target.value)}
                      icon={<User size={16} />}
                      required
                    />
                  </div>

                  {/* Gender (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="الجنس"
                      options={genderOptions}
                      value={newChildData.gender}
                      onChange={(e, val) => handleNewChildChange("gender", val !== undefined ? val : e?.target?.value ?? e)}
                    />
                  </div>

                  {/* Age Band (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="المرحلة العمرية"
                      options={ageBandOptions}
                      value={newChildData.ageBand}
                      onChange={(e, val) => handleNewChildChange("ageBand", val !== undefined ? val : e?.target?.value ?? e)}
                    />
                  </div>

                  {/* Skin Tone (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="درجة لون البشرة"
                      options={skinToneOptions}
                      value={newChildData.appearance.skinTone}
                      onChange={(e, val) => handleAppearanceChange("skinTone", val !== undefined ? val : e?.target?.value ?? e)}
                      icon={<Palette size={16} />}
                    />
                  </div>

                  {/* Eye Color (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="لون العينين"
                      options={eyeColorOptions}
                      value={newChildData.appearance.eyeColor}
                      onChange={(e, val) => handleAppearanceChange("eyeColor", val !== undefined ? val : e?.target?.value ?? e)}
                      icon={<Eye size={16} />}
                    />
                  </div>

                  {/* Hijab (if Girl) */}
                  {newChildData.gender === "GIRL" && (
                    <div className="new-child-story-col--half">
                      <Select
                        label="ارتداء الحجاب"
                        options={hijabOptions}
                        value={Boolean(newChildData.appearance.hijab)}
                        onChange={(e, val) => handleAppearanceChange("hijab", Boolean(val !== undefined ? val : e?.target?.value ?? e))}
                      />
                    </div>
                  )}

                  {/* Hair Color & Style (only if not Hijab) */}
                  {!newChildData.appearance.hijab && (
                    <>
                      <div className="new-child-story-col--half">
                        <Select
                          label="لون الشعر"
                          options={hairColorOptions}
                          value={newChildData.appearance.hairColor}
                          onChange={(e, val) => handleAppearanceChange("hairColor", val !== undefined ? val : e?.target?.value ?? e)}
                        />
                      </div>

                      <div className="new-child-story-col--half">
                        <Select
                          label="تسريحة الشعر"
                          options={hairStyleOptions}
                          value={newChildData.appearance.hairStyle}
                          onChange={(e, val) => handleAppearanceChange("hairStyle", val !== undefined ? val : e?.target?.value ?? e)}
                          icon={<Scissors size={16} />}
                        />
                      </div>
                    </>
                  )}

                  {/* Glasses (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="نظارات طبية"
                      options={glassesOptions}
                      value={Boolean(newChildData.appearance.glasses)}
                      onChange={(e, val) => handleAppearanceChange("glasses", Boolean(val !== undefined ? val : e?.target?.value ?? e))}
                      icon={<Glasses size={16} />}
                    />
                  </div>

                  {/* Optional Secured Image Input */}
                  <div className="new-child-story-col--full">
                    <label className="new-child-story-sublabel">
                      صورة البطل (اختياري):
                    </label>

                    <div className="new-child-image-uploader">
                      {!heroImagePreview ? (
                        <label className="new-child-image-dropzone">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            className="new-child-image-input-hidden"
                            onChange={handleImageUpload}
                          />
                          <div className="new-child-image-dropzone-content">
                            <div className="new-child-image-dropzone-icon">
                              <Upload size={18} />
                            </div>
                            <span className="new-child-image-dropzone-hint">
                              JPG, PNG, JPEG (حد أقصى 5MB)
                            </span>
                          </div>
                        </label>
                      ) : (
                        <div className="new-child-image-preview-card">
                          <div className="new-child-image-preview-thumb">
                            <img src={heroImagePreview} alt="صورة البطل" />
                          </div>
                          <div className="new-child-image-preview-info">
                            <span className="new-child-image-preview-name">
                              {heroImageName || "صورة البطل"}
                            </span>
                            <span className="new-child-image-preview-size">
                              {heroImageSize}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="new-child-image-remove-btn"
                            onClick={handleRemoveImage}
                            title="إزالة الصورة"
                          >
                            <Trash2 size={15} />
                            <span>إزالة</span>
                          </button>
                        </div>
                      )}

                      {heroImagePreview && (
                        <div
                          style={{
                            marginTop: "12px",
                            padding: "12px 14px",
                            backgroundColor: "var(--bg-secondary, #f8fafc)",
                            border: "1px solid var(--border-subtle, #e2e8f0)",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            lineHeight: "1.5",
                          }}
                        >
                          <p style={{ color: "#475569", marginBottom: "8px" }}>
                            🔒 <strong>الخصوصية وأمان البيانات:</strong> تُشفر الصورة فور رفعها وتُحذف نهائياً وتلقائياً من خوادمنا بمجرد اعتماد لوحة رسم الشخصية.
                          </p>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              color: "#0f172a",
                              fontWeight: "500",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(storyData.photoConsent)}
                              onChange={(e) => handleStoryChange("photoConsent", e.target.checked)}
                              style={{ width: "16px", height: "16px", accentColor: "#0f172a", cursor: "pointer" }}
                            />
                            <span>أؤكد أنني ولي أمر الطفل وأوافق على استخدام الصورة لرسم شخصية الحكاية.</span>
                          </label>
                        </div>
                      )}

                      {imageError && (
                        <div className="new-child-image-error">
                          <AlertCircle size={14} />
                          <span>{imageError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 2: Story Idea, Interests & Setting
              ================================================================ */}
          {currentStep === 2 && (
            <div className="new-child-story-step">
              <div className="new-child-story-card">
                <div className="new-child-story-section-header-row">
                  <span className="new-child-story-section-label">فكرة ومخطط الحكاية:</span>
                </div>

                <div className="new-child-story-form-grid">
                  {/* Story Idea (Text Input instead of Selection Cards) */}
                  <div className="new-child-story-col--full">
                    <Input
                      label="فكرة وموضوع الحكاية"
                      placeholder="مثال: يومي الأول في المدرسة، مغامرة في الفضاء، القطة الصغيرة التائهة..."
                      value={storyData.storyIdea}
                      onChange={(e) => handleStoryChange("storyIdea", e.target.value)}
                      icon={<BookOpen size={16} />}
                      required
                    />
                  </div>

                  {/* Child Interests (Select dropdown, not radio) */}
                  <div className="new-child-story-col--full">
                    <Select
                      label="اهتمامات وهوايات الطفل"
                      options={INTERESTS}
                      value={storyData.interests}
                      multiple={true}
                      maxSelected={3}
                      placeholder="اختر حتى ٣ اهتمامات..."
                      onChange={(e, updatedValues) => {
                        const arr = Array.isArray(updatedValues) ? updatedValues : Array.isArray(e) ? e : [updatedValues];
                        handleStoryChange("interests", arr.slice(0, 3));
                      }}
                      icon={<Heart size={16} />}
                    />
                  </div>

                  {/* Setting (Enum Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="بيئة وموقع القصة"
                      options={dynamicSettings}
                      value={storyData.setting || "GENERIC_CITY"}
                      onChange={(e, val) => handleStoryChange("setting", val !== undefined ? val : e?.target?.value ?? e)}
                      icon={<MapPin size={16} />}
                    />
                  </div>

                  {/* Place (Optional Text Input) */}
                  <div className="new-child-story-col--half">
                    <Input
                      label="المكان المحدد "
                      placeholder="مثال: حديقة الحي، المدرسة، شاطئ البحر، بيت الجدة..."
                      value={storyData.place || ""}
                      onChange={(e) => handleStoryChange("place", e.target.value)}
                      icon={<MapPin size={16} />}
                    />
                  </div>

                  {/* Story Tone */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="نبرة الحكاية"
                      options={STORY_TONES}
                      value={storyData.storyTone}
                      onChange={(e, val) => handleStoryChange("storyTone", val !== undefined ? val : e?.target?.value ?? e)}
                      icon={<Palette size={16} />}
                    />
                  </div>

                  {/* Theme */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="السمة والهدف التربوي"
                      options={STORY_THEMES}
                      value={storyData.theme}
                      onChange={(e, val) => handleStoryChange("theme", val !== undefined ? val : e?.target?.value ?? e)}
                      icon={<Compass size={16} />}
                    />
                  </div>

                  {/* Time of Day (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="وقت المشهد والقصة"
                      options={dynamicTimesOfDay}
                      value={storyData.timeOfDay}
                      onChange={(e, val) => handleStoryChange("timeOfDay", val !== undefined ? val : e?.target?.value ?? e)}
                      icon={<Clock size={16} />}
                    />
                  </div>

                  {/* Moral Lesson */}
                  <div className="new-child-story-col--half">
                    <Input
                      label="العبرة والقيمة الأخلاقية"
                      placeholder="مثال: التعاون، الشجاعة، الصدق، حب الطبيعة..."
                      value={storyData.lesson}
                      onChange={(e) => handleStoryChange("lesson", e.target.value)}
                    />
                  </div>

                  {/* Things to Avoid */}
                  <div className="new-child-story-col--half">
                    <Input
                      label="أمور يُفضل تجنبها "
                      placeholder="مثال: الوحوش المخيفة، الظلام الدامس..."
                      value={storyData.thingsToAvoidText}
                      onChange={(e) => handleStoryChange("thingsToAvoidText", e.target.value)}
                    />
                  </div>

                  {/* Companion (Pet or Sibling) */}
                  <div className="new-child-story-col--full">
                    <div
                      style={{
                        padding: "14px 16px",
                        backgroundColor: "var(--bg-secondary, #f8fafc)",
                        border: "1px solid var(--border-subtle, #e2e8f0)",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(storyData.hasCompanion)}
                          onChange={(e) => handleStoryChange("hasCompanion", e.target.checked)}
                          style={{ width: "16px", height: "16px", accentColor: "#0f172a", cursor: "pointer" }}
                        />
                        <span>إضافة مرافق للطفل في القصة (حيوان أليف أو أخ/أخت) - اختياري</span>
                      </label>

                      {storyData.hasCompanion && (
                        <div className="new-child-story-form-grid" style={{ marginTop: "4px" }}>
                          <div className="new-child-story-col--half">
                            <Select
                              label="نوع المرافق"
                              options={COMPANION_TYPES}
                              value={storyData.companion?.type || "CAT"}
                              onChange={(e, val) => handleCompanionChange("type", val !== undefined ? val : e?.target?.value ?? e)}
                            />
                          </div>

                          <div className="new-child-story-col--half">
                            <Input
                              label="اسم المرافق"
                              placeholder="مثال: مشمش، ريكو، سارة..."
                              value={storyData.companion?.nameAr || ""}
                              onChange={(e) => handleCompanionChange("nameAr", e.target.value)}
                            />
                          </div>

                          {["CAT", "DOG", "RABBIT", "PARROT"].includes(storyData.companion?.type) && (
                            <div className="new-child-story-col--half">
                              <Select
                                label="لون الحيوان الأليف"
                                options={PET_COLORS}
                                value={storyData.companion?.petColor || "ORANGE"}
                                onChange={(e, val) => handleCompanionChange("petColor", val !== undefined ? val : e?.target?.value ?? e)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 3: Book Specifications & Language
              ================================================================ */}
          {currentStep === 3 && (
            <div className="new-child-story-step">
              <div className="new-child-story-card">
                <div className="new-child-story-section-header-row">
                  <span className="new-child-story-section-label">مواصفات الكتاب ولغة القصة:</span>
                </div>

                <div className="new-child-story-form-grid">
                  {/* Page Count (Select Dropdown instead of button pills) */}
                  <div className="new-child-story-col--full">
                    <Select
                      label="عدد صفحات الكتاب المصور"
                      options={pageCountOptions}
                      value={storyData.pageCount}
                      onChange={(e, val) => handleStoryChange("pageCount", Number(val !== undefined ? val : e?.target?.value ?? e))}
                      icon={<Layers size={16} />}
                    />
                  </div>

                  {/* Language Variety (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="اللغة واللهجة"
                      options={dynamicVarieties}
                      value={storyData.variety}
                      onChange={(e, val) => handleStoryChange("variety", val !== undefined ? val : e?.target?.value ?? e)}
                    />
                  </div>

                  {/* Tashkeel Level (Select Dropdown) */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="مستوى التشكيل"
                      options={dynamicTashkeel}
                      value={storyData.tashkeelLevel}
                      onChange={(e, val) => handleStoryChange("tashkeelLevel", val !== undefined ? val : e?.target?.value ?? e)}
                    />
                  </div>

                  {/* Dedication (Textarea) */}
                  <div className="new-child-story-col--full">
                    <Textarea
                      label="إهداء القصة للطفل (اختياري - بحد أقصى ٣٠٠ حرف)"
                      placeholder="مثال: إلى بطلنا الغالي كريم، نهديك هذه الحكاية لتبحر في عالم المعرفة والمغامرة وتظل دائماً شجاعاً وفضولياً..."
                      value={storyData.dedication}
                      onChange={(e) => handleStoryChange("dedication", e.target.value.slice(0, 300))}
                      rows={3}
                      maxLength={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 4: Review & Launch
              ================================================================ */}
          {currentStep === 4 && (
            <div className="new-child-story-step">
              <div className="new-child-story-review-card" dir="rtl">
                <div className="new-child-story-review-details">
                  <div className="new-child-story-review-meta">
                    <span>{dynamicVarieties.find((v) => v.value === unwrapScalar(storyData.variety))?.label || "العربية الفصحى"}</span>
                    <span className="new-child-story-review-sep">•</span>
                    <span>{String(unwrapScalar(storyData.pageCount, 16))} صفحة</span>
                    <span className="new-child-story-review-sep">•</span>
                    <span>{selectedAgeBandLabel}</span>
                  </div>

                  <h3 className="new-child-story-review-title">
                    {unwrapScalar(storyData.storyIdea)?.trim() || "مغامرة البطل الصغير"}
                  </h3>

                  <div className="new-child-story-review-hero-row">
                    {heroImagePreview && (
                      <div className="new-child-story-review-avatar">
                        <img src={heroImagePreview} alt={unwrapScalar(newChildData.nameAr)} />
                      </div>
                    )}
                    <p className="new-child-story-review-hero">
                      بطل الحكاية: <strong>{unwrapScalar(newChildData.nameAr) || "البطل الصغير"}</strong> ({selectedGenderLabel} • {selectedSkinToneLabel})
                    </p>
                  </div>

                  <div className="new-child-story-review-summary-box">
                    <div className="new-child-story-review-row">
                      <span className="new-child-story-review-label">البيئة والمكان</span>
                      <span className="new-child-story-review-val">
                        {STORY_SETTINGS.find((s) => s.value === unwrapScalar(storyData.setting))?.label || unwrapScalar(storyData.setting, "عمّان")}
                        {unwrapScalar(storyData.place) ? ` (${unwrapScalar(storyData.place)})` : ""}
                        {" • "}
                        {dynamicTimesOfDay.find((t) => t.value === unwrapScalar(storyData.timeOfDay))?.label}
                      </span>
                    </div>

                    {storyData.interests && storyData.interests.length > 0 && (
                      <div className="new-child-story-review-row">
                        <span className="new-child-story-review-label">الاهتمامات</span>
                        <span className="new-child-story-review-val">
                          {storyData.interests.map((val) => {
                            const raw = unwrapScalar(val);
                            return INTERESTS.find((i) => i.value === raw)?.label || raw;
                          }).filter(Boolean).join("، ")}
                        </span>
                      </div>
                    )}

                    <div className="new-child-story-review-row">
                      <span className="new-child-story-review-label">نبرة الحكاية</span>
                      <span className="new-child-story-review-val">
                        {STORY_TONES.find((t) => t.value === unwrapScalar(storyData.storyTone))?.label || unwrapScalar(storyData.storyTone, "مغامرة وتشويق")}
                      </span>
                    </div>

                    <div className="new-child-story-review-row">
                      <span className="new-child-story-review-label">السمة والهدف</span>
                      <span className="new-child-story-review-val">
                        {STORY_THEMES.find((th) => th.value === unwrapScalar(storyData.theme))?.label || unwrapScalar(storyData.theme, "الصداقة والتعاون")}
                      </span>
                    </div>

                    <div className="new-child-story-review-row">
                      <span className="new-child-story-review-label">التشكيل</span>
                      <span className="new-child-story-review-val">
                        {dynamicTashkeel.find((t) => t.value === unwrapScalar(storyData.tashkeelLevel))?.label || "تشكيل جزئي"}
                      </span>
                    </div>

                    {unwrapScalar(storyData.dedication) && (
                      <div className="new-child-story-review-row">
                        <span className="new-child-story-review-label">الإهداء</span>
                        <span className="new-child-story-review-val" style={{ fontStyle: "italic" }}>
                          «{unwrapScalar(storyData.dedication)}»
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="new-child-story-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="new-child-story-btn-prev"
                onClick={goToPrevStep}
              >
                <ArrowRight size={16} />
                <span>السابق</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                className="new-child-story-btn-next"
                onClick={goToNextStep}
              >
                <span>المتابعة للخطوة التالية</span>
                <ArrowLeft size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="new-child-story-btn-submit"
                onClick={handleSaveAndPublish}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="new-child-story-spinner" />
                    <span>جاري إطلاق التوليد...</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={16} />
                    <span>إنشاء قصة الأطفال</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default NewStoryBookView;
