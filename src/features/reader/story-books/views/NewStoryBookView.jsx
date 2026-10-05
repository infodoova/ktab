import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Plus,
  BookOpen,
  MapPin,
  Clock,
  Layers,
  Check,
  CheckCircle2,
  Loader2,
  Info,
} from "lucide-react";
import { InputComponent as Input } from "@/components/myui/forms/Input/Input";
import { Select } from "@/components/myui/forms/Select/Select";
import { TextareaComponent as Textarea } from "@/components/myui/forms/Textarea/Textarea";
import { StoryBookStepper } from "../components/StoryBookStepper/StoryBookStepper";
import { useNewStoryBook } from "../hooks/useNewStoryBook";
import {
  AGE_BANDS,
  AGE_BAND_LABELS,
  CHILD_GENDERS,
  SKIN_TONES,
  HAIR_COLORS,
  HAIR_STYLES,
  EYE_COLORS,
  INTERESTS,
  STORY_SETTINGS,
  STORY_TIMES,
  PAGE_COUNTS,
  LANGUAGE_VARIETIES,
  TASHKEEL_LEVELS,
} from "../constants/storyBooksConstants";
import "./NewStoryBookView.css";

/**
 * Editorial Studio View for Creating Personalized Children's Story Books.
 * 100% connected to backend Storybook & ChildProfile APIs.
 */
export function NewStoryBookView({ pageName = "ابتكار قصة أطفال جديدة" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    currentStep,
    isSubmitting,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    handleSaveAndPublish,

    // Children
    children,
    loadingChildren,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    showNewChildForm,
    setShowNewChildForm,
    isSavingChild,
    newChildData,
    handleNewChildChange,
    handleAppearanceChange,
    handleSaveChild,

    // Blueprints & Story Data
    blueprints,
    loadingBlueprints,
    storyData,
    handleStoryChange,
    handleInterestToggle,

    // Backend Dynamic Filters
    filters,
  } = useNewStoryBook();

  // Dynamic filter options derived directly from backend API /api/v1/storybook/filters
  const dynamicSkinTones = filters?.skinTones?.map((s) => ({ value: s.value, label: s.labelAr, color: s.color })) || SKIN_TONES;
  const dynamicEyeColors = filters?.eyeColors?.map((e) => ({ value: e.value, label: e.labelAr, color: e.color })) || EYE_COLORS;
  const dynamicHairColors = filters?.hairColors?.map((h) => ({ value: h.value, label: h.labelAr, color: h.color })) || HAIR_COLORS;
  const dynamicHairStyles = filters?.hairStyles?.map((s) => ({ value: s.value, label: s.labelAr })) || HAIR_STYLES;
  const dynamicGenders = filters?.genders?.map((g) => ({ value: g.value, label: g.labelAr })) || CHILD_GENDERS;
  const dynamicAgeBands = filters?.ageBands?.map((a) => ({ value: a.value, label: a.labelAr })) || AGE_BANDS;
  const dynamicInterests = filters?.interests?.map((i) => ({ value: i.value, label: i.labelAr })) || INTERESTS;
  const dynamicSettings = filters?.settings?.map((s) => ({ value: s.value, label: s.labelAr, description: s.description })) || STORY_SETTINGS;
  const dynamicTimesOfDay = filters?.timesOfDay?.map((t) => ({ value: t.value, label: t.labelAr, description: t.description })) || STORY_TIMES;
  const dynamicPageCounts = filters?.pageCounts || PAGE_COUNTS;
  const dynamicVarieties = filters?.languageVarieties?.map((v) => ({ value: v.value, label: v.labelAr })) || LANGUAGE_VARIETIES;
  const dynamicTashkeel = filters?.tashkeelLevels?.map((t) => ({ value: t.value, label: t.labelAr })) || TASHKEEL_LEVELS;

  const breadcrumb = location.state?.from || {
    parentLabel: "قصص الأطفال",
    parentPath: "/reader/story-books",
  };

  const selectedBlueprint = blueprints.find((b) => b.key === storyData.blueprintKey);

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
              STEP 1: Hero Character Profile (Child Selection & Inline Creation)
              ================================================================ */}
          {currentStep === 1 && (
            <div className="new-child-story-step">

              {/* Existing Child Profiles */}
              {!showNewChildForm && (
                <div className="new-child-story-card">
                  <div className="new-child-story-section-header-row">
                    <span className="new-child-story-section-label">الأبطال المسجلون:</span>
                    <button
                      type="button"
                      className="new-child-story-btn-text"
                      onClick={() => setShowNewChildForm(true)}
                    >
                      <Plus size={14} />
                      <span>إضافة بطل جديد</span>
                    </button>
                  </div>

                  {loadingChildren ? (
                    <div className="new-child-story-loader">
                      <Loader2 size={20} className="new-child-story-spinner" />
                      <span>جاري جلب ملفات الأطفال...</span>
                    </div>
                  ) : children.length === 0 ? (
                    <div className="new-child-story-empty-hint">
                      <User size={32} className="new-child-story-empty-icon" />
                      <p>لم يتم تسجيل أي بطل بعد. ابدأ بإنشاء أول ملف تعريفي لطفلك أدناه.</p>
                      <button
                        type="button"
                        className="new-child-story-btn-primary-inline"
                        onClick={() => setShowNewChildForm(true)}
                      >
                        <Plus size={15} />
                        <span>إضافة ملف طفل</span>
                      </button>
                    </div>
                  ) : (
                    <div className="new-child-profiles-grid">
                      {children.map((child) => {
                        const isSelected = child.id === selectedChildId;
                        const ageLabel = AGE_BAND_LABELS[child.ageBand] || child.ageBand;
                        const genderLabel = child.gender === "BOY" ? "ولد" : "بنت";

                        return (
                          <div
                            key={child.id}
                            className={`new-child-profile-card ${
                              isSelected ? "new-child-profile-card--selected" : ""
                            }`}
                            onClick={() => setSelectedChildId(child.id)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="new-child-profile-card__avatar">
                              <User size={22} />
                            </div>
                            <div className="new-child-profile-card__info">
                              <h4 className="new-child-profile-card__name">{child.nameAr}</h4>
                              <span className="new-child-profile-card__meta">
                                {genderLabel} • {ageLabel}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="new-child-profile-card__check">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Inline New Child Profile Creation Form */}
              {showNewChildForm && (
                <div className="new-child-story-card">
                  <div className="new-child-story-section-header-row">
                    <span className="new-child-story-section-label">إضافة ملف بطل جديد:</span>
                    {children.length > 0 && (
                      <button
                        type="button"
                        className="new-child-story-btn-text"
                        onClick={() => setShowNewChildForm(false)}
                      >
                        <span>العودة لاختيار بطل سابق</span>
                      </button>
                    )}
                  </div>

                  {/* Live Avatar Preview Card */}
                  <div className="new-child-avatar-preview-banner">
                    <div
                      className="new-child-avatar-preview-circle"
                      style={{
                        backgroundColor: dynamicSkinTones.find(
                          (t) => t.value === newChildData.appearance.skinTone
                        )?.color || "#f6dec8",
                      }}
                    >
                      <User size={28} className="new-child-avatar-preview-icon" />
                      {newChildData.appearance.glasses && (
                        <span className="new-child-avatar-preview-glasses-badge" title="نظارات طبية">
                          👓
                        </span>
                      )}
                    </div>
                    <div className="new-child-avatar-preview-info">
                      <h4 className="new-child-avatar-preview-name">
                        {newChildData.nameAr.trim() || "اسم البطل الجديد"}
                      </h4>
                      <p className="new-child-avatar-preview-meta">
                        {newChildData.gender === "BOY" ? "ولد" : "بنت"} •{" "}
                        {dynamicAgeBands.find((a) => a.value === newChildData.ageBand)?.label.split("(")[0].trim()} •{" "}
                        {dynamicSkinTones.find((t) => t.value === newChildData.appearance.skinTone)?.label}
                        {newChildData.appearance.hijab ? " • بالحجاب" : ""}
                        {newChildData.appearance.glasses ? " • نظارات" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="new-child-story-form-grid">
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

                    {/* Gender Segmented Control */}
                    <div className="new-child-story-col--half">
                      <label className="new-child-story-sublabel">الجنس:</label>
                      <div className="new-child-segmented-group">
                        {dynamicGenders.map((g) => {
                          const isSelected = newChildData.gender === g.value;
                          return (
                            <button
                              key={g.value}
                              type="button"
                              className={`new-child-segmented-btn ${
                                isSelected ? "new-child-segmented-btn--active" : ""
                              }`}
                              onClick={() => handleNewChildChange("gender", g.value)}
                            >
                              <span>{g.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Age Band Segmented Control */}
                    <div className="new-child-story-col--half">
                      <label className="new-child-story-sublabel">المرحلة العمرية:</label>
                      <div className="new-child-segmented-group">
                        {dynamicAgeBands.map((a) => {
                          const isSelected = newChildData.ageBand === a.value;
                          const shortLabel = a.label.split("(")[0].trim();
                          return (
                            <button
                              key={a.value}
                              type="button"
                              className={`new-child-segmented-btn ${
                                isSelected ? "new-child-segmented-btn--active" : ""
                              }`}
                              onClick={() => handleNewChildChange("ageBand", a.value)}
                            >
                              <span>{shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skin Tone Palette */}
                    <div className="new-child-story-col--full">
                      <div className="new-child-swatch-header">
                        <label className="new-child-story-sublabel" style={{ marginBottom: 0 }}>
                          درجة لون البشرة:
                        </label>
                        <span className="new-child-swatch-selected-name">
                          {dynamicSkinTones.find((t) => t.value === newChildData.appearance.skinTone)?.label}
                        </span>
                      </div>
                      <div className="new-child-swatches-row">
                        {dynamicSkinTones.map((tone) => {
                          const isSelected = newChildData.appearance.skinTone === tone.value;
                          return (
                            <button
                              key={tone.value}
                              type="button"
                              title={tone.label}
                              className={`new-child-swatch-circle ${
                                isSelected ? "new-child-swatch-circle--active" : ""
                              }`}
                              style={{ backgroundColor: tone.color }}
                              onClick={() => handleAppearanceChange("skinTone", tone.value)}
                            >
                              {isSelected && <Check size={14} className="new-child-swatch-check" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Eye Color Palette */}
                    <div className="new-child-story-col--full">
                      <div className="new-child-swatch-header">
                        <label className="new-child-story-sublabel" style={{ marginBottom: 0 }}>
                          لون العينين:
                        </label>
                        <span className="new-child-swatch-selected-name">
                          {dynamicEyeColors.find((e) => e.value === newChildData.appearance.eyeColor)?.label}
                        </span>
                      </div>
                      <div className="new-child-swatches-row">
                        {dynamicEyeColors.map((eye) => {
                          const isSelected = newChildData.appearance.eyeColor === eye.value;
                          return (
                            <button
                              key={eye.value}
                              type="button"
                              title={eye.label}
                              className={`new-child-swatch-circle ${
                                isSelected ? "new-child-swatch-circle--active" : ""
                              }`}
                              style={{ backgroundColor: eye.color }}
                              onClick={() => handleAppearanceChange("eyeColor", eye.value)}
                            >
                              {isSelected && <Check size={14} className="new-child-swatch-check" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hair Color & Style (only if not hijab) */}
                    {!newChildData.appearance.hijab && (
                      <>
                        <div className="new-child-story-col--full">
                          <div className="new-child-swatch-header">
                            <label className="new-child-story-sublabel" style={{ marginBottom: 0 }}>
                              لون الشعر:
                            </label>
                            <span className="new-child-swatch-selected-name">
                              {dynamicHairColors.find((h) => h.value === newChildData.appearance.hairColor)?.label}
                            </span>
                          </div>
                          <div className="new-child-swatches-row">
                            {dynamicHairColors.map((hair) => {
                              const isSelected = newChildData.appearance.hairColor === hair.value;
                              return (
                                <button
                                  key={hair.value}
                                  type="button"
                                  title={hair.label}
                                  className={`new-child-swatch-circle ${
                                    isSelected ? "new-child-swatch-circle--active" : ""
                                  }`}
                                  style={{ backgroundColor: hair.color }}
                                  onClick={() => handleAppearanceChange("hairColor", hair.value)}
                                >
                                  {isSelected && <Check size={14} className="new-child-swatch-check" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="new-child-story-col--full">
                          <label className="new-child-story-sublabel">تسريحة الشعر:</label>
                          <div className="new-child-styles-grid">
                            {dynamicHairStyles.map((style) => {
                              const isSelected = newChildData.appearance.hairStyle === style.value;
                              return (
                                <button
                                  key={style.value}
                                  type="button"
                                  className={`new-child-style-chip ${
                                    isSelected ? "new-child-style-chip--active" : ""
                                  }`}
                                  onClick={() => handleAppearanceChange("hairStyle", style.value)}
                                >
                                  <span>{style.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Accessories & Features */}
                    <div className="new-child-story-col--full">
                      <label className="new-child-story-sublabel">ملحقات وميزات إضافية:</label>
                      <div className="new-child-accessories-row">
                        {newChildData.gender === "GIRL" && (
                          <button
                            type="button"
                            className={`new-child-accessory-toggle ${
                              newChildData.appearance.hijab ? "new-child-accessory-toggle--active" : ""
                            }`}
                            onClick={() => handleAppearanceChange("hijab", !newChildData.appearance.hijab)}
                          >
                            <span className="new-child-toggle-indicator" />
                            <span>ترتدي الحجاب</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className={`new-child-accessory-toggle ${
                            newChildData.appearance.glasses ? "new-child-accessory-toggle--active" : ""
                          }`}
                          onClick={() => handleAppearanceChange("glasses", !newChildData.appearance.glasses)}
                        >
                          <span className="new-child-toggle-indicator" />
                          <span>يرتدي نظارات طبية</span>
                        </button>
                      </div>
                    </div>

                    {/* Save Child Button */}
                    <div className="new-child-story-col--full" style={{ marginTop: "8px" }}>
                      <button
                        type="button"
                        className="new-child-story-btn-primary-inline"
                        onClick={handleSaveChild}
                        disabled={isSavingChild}
                      >
                        {isSavingChild ? (
                          <>
                            <Loader2 size={16} className="new-child-story-spinner" />
                            <span>جاري حفظ ملف الطفل...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} />
                            <span>حفظ ملف الطفل والمتابعة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              STEP 2: Blueprint, Interests & Setting
              ================================================================ */}
          {currentStep === 2 && (
            <div className="new-child-story-step">

              {/* Blueprints Selection */}
              <div className="new-child-story-card">
                <label className="new-child-story-section-label">
                  اختر فكرة ومخطط الحكاية:
                </label>

                {loadingBlueprints ? (
                  <div className="new-child-story-loader">
                    <Loader2 size={20} className="new-child-story-spinner" />
                    <span>جاري جلب مخططات القصص المعتمدة...</span>
                  </div>
                ) : (
                  <div className="new-child-blueprints-grid">
                    {blueprints.map((bp) => {
                      const isSelected = storyData.blueprintKey === bp.key;
                      return (
                        <div
                          key={bp.key}
                          className={`new-child-blueprint-card ${
                            isSelected ? "new-child-blueprint-card--selected" : ""
                          }`}
                          onClick={() => {
                            handleStoryChange("blueprintKey", bp.key);
                            if (bp.allowedSettings && bp.allowedSettings.length > 0) {
                              handleStoryChange("setting", bp.allowedSettings[0]);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="new-child-blueprint-card__header">
                            <BookOpen size={16} className="new-child-blueprint-icon" />
                            <h4 className="new-child-blueprint-card__title">{bp.titleAr}</h4>
                            {bp.religious && (
                              <span className="new-child-badge-religious">قيم تربوية</span>
                            )}
                          </div>
                          {bp.theme && (
                            <p className="new-child-blueprint-card__theme">{bp.theme}</p>
                          )}
                          {isSelected && (
                            <div className="new-child-blueprint-card__check">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Interests & Settings Card */}
              <div className="new-child-story-card">
                {/* Interests Selection (up to 3) */}
                <div style={{ marginBottom: "20px" }}>
                  <div className="new-child-story-section-header-row">
                    <label className="new-child-story-section-label">
                      اهتمامات الطفل (اختر حتى ٣ اهتمامات):
                    </label>
                    <span className="new-child-story-counter">
                      {storyData.interests.length} / 3
                    </span>
                  </div>

                  <div className="new-child-interests-grid">
                    {dynamicInterests.map((item) => {
                      const isSelected = storyData.interests.includes(item.value);
                      return (
                        <button
                          key={item.value}
                          type="button"
                          className={`new-child-interest-chip ${
                            isSelected ? "new-child-interest-chip--selected" : ""
                          }`}
                          onClick={() => handleInterestToggle(item.value)}
                        >
                          {isSelected && <Check size={12} strokeWidth={2.5} />}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="new-child-story-form-grid">
                  {/* Setting */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="بيئة ومكان المغامرة"
                      options={dynamicSettings.filter((s) => {
                        if (!selectedBlueprint?.allowedSettings || selectedBlueprint.allowedSettings.length === 0) {
                          return true;
                        }
                        return selectedBlueprint.allowedSettings.includes(s.value);
                      })}
                      value={storyData.setting}
                      onChange={(val) => handleStoryChange("setting", val)}
                      icon={<MapPin size={16} />}
                    />
                  </div>

                  {/* Time of Day */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="وقت المشهد والقصة"
                      options={dynamicTimesOfDay}
                      value={storyData.timeOfDay}
                      onChange={(val) => handleStoryChange("timeOfDay", val)}
                      icon={<Clock size={16} />}
                    />
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
                <div className="new-child-story-form-grid">
                  {/* Page Count */}
                  <div className="new-child-story-col--full">
                    <label className="new-child-story-section-label">عدد صفحات الكتاب المصور:</label>
                    <div className="new-child-page-counts-row">
                      {dynamicPageCounts.map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          className={`new-child-page-count-btn ${
                            Number(storyData.pageCount) === cnt
                              ? "new-child-page-count-btn--active"
                              : ""
                          }`}
                          onClick={() => handleStoryChange("pageCount", cnt)}
                        >
                          <span className="new-child-page-count-num">{cnt}</span>
                          <span className="new-child-page-count-unit">صفحة</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Variety */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="اللغة واللهجة"
                      options={dynamicVarieties}
                      value={storyData.variety}
                      onChange={(val) => handleStoryChange("variety", val)}
                    />
                  </div>

                  {/* Tashkeel Level */}
                  <div className="new-child-story-col--half">
                    <Select
                      label="مستوى التشكيل"
                      options={dynamicTashkeel}
                      value={storyData.tashkeelLevel}
                      onChange={(val) => handleStoryChange("tashkeelLevel", val)}
                    />
                  </div>

                  {/* Dedication */}
                  <div className="new-child-story-col--full">
                    <Textarea
                      label="إهداء القصة للطفل (اختياري - بحد أقصى ٣٠٠ حرف)"
                      placeholder="مثال: إلى بطلنا الغالي كريم، نهديك هذه الحكاية لتبحر في عالم المعرفة والمغامرة وتظل دائماً شجاعاً وفضولياً..."
                      value={storyData.dedication}
                      onChange={(e) => handleStoryChange("dedication", e.target.value.slice(0, 300))}
                      rows={3}
                    />
                    <div className="new-child-story-textarea-counter">
                      <span>{(storyData.dedication || "").length} / 300 حرف</span>
                    </div>
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

              <div className="new-child-story-review-card">
                <div className="new-child-story-review-details">
                  <div className="new-child-story-review-header">
                    <span className="new-child-story-review-category">
                      {dynamicVarieties.find((v) => v.value === storyData.variety)?.label} • {storyData.pageCount} صفحة
                    </span>
                    {selectedChild && (
                      <div className="new-child-story-review-badge">
                        <span>{dynamicAgeBands.find((a) => a.value === selectedChild?.ageBand)?.label || "قصة أطفال"}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="new-child-story-review-title">
                    {selectedBlueprint?.titleAr || "مغامرة البطل الصغير"}
                  </h3>

                  {selectedChild && (
                    <p className="new-child-story-review-hero">
                      بطل الحكاية: <strong>{selectedChild.nameAr}</strong> ({selectedChild.gender === "BOY" ? "ولد" : "بنت"})
                    </p>
                  )}

                  <div className="new-child-story-review-summary-box">
                    <div className="new-child-story-review-row">
                      <span className="new-child-story-review-label">البيئة والوقت:</span>
                      <span className="new-child-story-review-val">
                        {dynamicSettings.find((s) => s.value === storyData.setting)?.label?.split(" ")[0]} • {dynamicTimesOfDay.find((t) => t.value === storyData.timeOfDay)?.label}
                      </span>
                    </div>

                    {storyData.interests.length > 0 && (
                      <div className="new-child-story-review-row">
                        <span className="new-child-story-review-label">الاهتمامات:</span>
                        <div className="new-child-story-review-tags">
                          {storyData.interests.map((i) => (
                            <span key={i} className="new-child-story-review-tag">
                              {dynamicInterests.find((item) => item.value === i)?.label || i}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="new-child-story-review-row">
                      <span className="new-child-story-review-label">التشكيل:</span>
                      <span className="new-child-story-review-val">
                        {dynamicTashkeel.find((t) => t.value === storyData.tashkeelLevel)?.label}
                      </span>
                    </div>

                    {storyData.dedication && (
                      <div className="new-child-story-review-row">
                        <span className="new-child-story-review-label">الإهداء:</span>
                        <span className="new-child-story-review-val" style={{ fontStyle: "italic" }}>
                          «{storyData.dedication}»
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
