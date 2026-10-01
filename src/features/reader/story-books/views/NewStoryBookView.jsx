import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { ArrowRight, ArrowLeft, BookOpen, User, Layers, Palette, CheckCircle2, GitFork, Save } from "lucide-react";
import { InputComponent as Input } from "@/components/myui/forms/Input/Input";
import { Select } from "@/components/myui/forms/Select/Select";
import { TextareaComponent as Textarea } from "@/components/myui/forms/Textarea/Textarea";
import { StoryBookStepper } from "../components/StoryBookStepper/StoryBookStepper";
import { useNewStoryBook } from "../hooks/useNewStoryBook";
import {
  AGE_FILTERS,
  CATEGORY_FILTERS,
  STORY_THEMES,
  STORY_ART_STYLES,
} from "../constants/storyBooksConstants";
import bunnyCover from "@/assets/images/children-stories/bunny.jpg";
import "./NewStoryBookView.css";

/**
 * Editorial Studio View for Creating Interactive Children's Story Books.
 * Multi-step interactive flow with steps: Identity, World, Decision Branches, and Review.
 */
export function NewStoryBookView({ pageName = "ابتكار قصة أطفال جديدة" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    isSubmitting,
    handleFieldChange,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    handleSaveAndPublish,
  } = useNewStoryBook();

  const breadcrumb = location.state?.from || {
    parentLabel: "قصص الأطفال",
    parentPath: "/reader/story-books",
  };

  const ageOptions = AGE_FILTERS.filter((a) => a.id !== "ALL").map((a) => ({
    value: a.id,
    label: a.label,
  }));

  const categoryOptions = CATEGORY_FILTERS.filter((c) => c.id !== "ALL").map((c) => ({
    value: c.id,
    label: c.label,
  }));

  const artStyleOptions = STORY_ART_STYLES.map((s) => ({
    value: s.id,
    label: s.label,
  }));

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
          {/* STEP 1: Story Identity & Characters */}
          {currentStep === 1 && (
            <div className="new-child-story-step">
              <div className="new-child-story-step__header">
                <h2 className="new-child-story-step__title">هوية الحكاية والشخصيات</h2>
                <p className="new-child-story-step__desc">
                  حدد عنوان القصة واسم البطل الصغير والفئة العمرية المناسبة
                </p>
              </div>

              <div className="new-child-story-card">
                <div className="new-child-story-form-grid">
                  <div className="new-child-story-col--full">
                    <Input
                      label="عنوان الحكاية"
                      placeholder="مثال: مغامرة الأرنب الصغير في الغابة المضيئة"
                      value={formData.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      icon={<BookOpen size={16} />}
                      required
                    />
                  </div>

                  <div className="new-child-story-col--half">
                    <Input
                      label="اسم البطل أو البطلة الصغيرة"
                      placeholder="مثال: سوسو، كريم، ليلى..."
                      value={formData.heroName}
                      onChange={(e) => handleFieldChange("heroName", e.target.value)}
                      icon={<User size={16} />}
                    />
                  </div>

                  <div className="new-child-story-col--half">
                    <Select
                      label="الفئة العمرية المستهدفة"
                      options={ageOptions}
                      value={formData.ageGroup}
                      onChange={(val) => handleFieldChange("ageGroup", val)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: World, Theme & Art Style */}
          {currentStep === 2 && (
            <div className="new-child-story-step">
              <div className="new-child-story-step__header">
                <h2 className="new-child-story-step__title">عالم المغامرة والنمط البصري</h2>
                <p className="new-child-story-step__desc">
                  اختر بيئة المغامرة السحرية ونمط الرسوم التوضيحية
                </p>
              </div>

              <div className="new-child-story-card">
                <div className="new-child-story-form-grid">
                  <div className="new-child-story-col--half">
                    <Select
                      label="نوع وقسم الحكاية"
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(val) => handleFieldChange("category", val)}
                      icon={<Layers size={16} />}
                    />
                  </div>

                  <div className="new-child-story-col--half">
                    <Select
                      label="نمط الرسوم التوضيحية"
                      options={artStyleOptions}
                      value={formData.artStyle}
                      onChange={(val) => handleFieldChange("artStyle", val)}
                      icon={<Palette size={16} />}
                    />
                  </div>

                  <div className="new-child-story-col--full">
                    <label className="new-child-story-section-label">
                      اختر بيئة الحكاية:
                    </label>
                    <div className="new-child-story-theme-grid">
                      {STORY_THEMES.map((theme) => {
                        const isSelected = formData.theme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            className={`new-child-story-theme-btn ${
                              isSelected ? "new-child-story-theme-btn--active" : ""
                            }`}
                            onClick={() => handleFieldChange("theme", theme.id)}
                          >
                            <span className="new-child-story-theme-name">{theme.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interactive Decision Branches */}
          {currentStep === 3 && (
            <div className="new-child-story-step">
              <div className="new-child-story-step__header">
                <h2 className="new-child-story-step__title">القرارات والمسارات التفاعلية</h2>
                <p className="new-child-story-step__desc">
                  صمم المشهد الأول والخيارات التفاعلية التي يحدد الطفل مسارها
                </p>
              </div>

              <div className="new-child-story-card">
                <div className="new-child-story-form-grid">
                  <div className="new-child-story-col--full">
                    <Textarea
                      label="افتتاحية المشهد التفاعلي الأول"
                      placeholder="استيقظ الأرنب الصغير في صباح مشرق، ووجد مساراً متلألئاً بين الأشجار العالية المؤدية إلى الغابة السحرية..."
                      value={formData.firstSceneIntro}
                      onChange={(e) => handleFieldChange("firstSceneIntro", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="new-child-story-col--full">
                    <div className="new-child-story-branch-header">
                      <GitFork size={15} />
                      <span>المسار التفاعلي (القرار الأول للطفل)</span>
                    </div>
                  </div>

                  <div className="new-child-story-col--half">
                    <Input
                      label="الخيار الأول (المسار أ)"
                      value={formData.choiceA}
                      onChange={(e) => handleFieldChange("choiceA", e.target.value)}
                    />
                  </div>

                  <div className="new-child-story-col--half">
                    <Input
                      label="الخيار الثاني (المسار ب)"
                      value={formData.choiceB}
                      onChange={(e) => handleFieldChange("choiceB", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Publish */}
          {currentStep === 4 && (
            <div className="new-child-story-step">
              <div className="new-child-story-step__header">
                <h2 className="new-child-story-step__title">معاينة الحكاية والإطلاق</h2>
                <p className="new-child-story-step__desc">
                  راجع بطاقة القصة ومساراتها التفاعلية قبل الحفظ والنشر
                </p>
              </div>

              <div className="new-child-story-review-card">
                <div className="new-child-story-review-cover-wrap">
                  <img
                    src={bunnyCover}
                    alt={formData.title || "غلاف القصة"}
                    className="new-child-story-review-img"
                  />
                  <div className="new-child-story-review-badge">
                    <span>{formData.ageGroup === "3-6" ? "٣ - ٦ سنوات" : formData.ageGroup === "6-9" ? "٦ - ٩ سنوات" : "٩ - ١٢ سنة"}</span>
                  </div>
                </div>

                <div className="new-child-story-review-details">
                  <span className="new-child-story-review-category">{formData.category}</span>
                  <h3 className="new-child-story-review-title">
                    {formData.title || "عنوان الحكاية"}
                  </h3>
                  {formData.heroName && (
                    <p className="new-child-story-review-hero">
                      البطل الصغير: <strong>{formData.heroName}</strong>
                    </p>
                  )}

                  <div className="new-child-story-review-branches">
                    <div className="new-child-story-review-branch-item">
                      <span className="new-child-story-review-dot">أ</span>
                      <span>{formData.choiceA}</span>
                    </div>
                    <div className="new-child-story-review-branch-item">
                      <span className="new-child-story-review-dot">ب</span>
                      <span>{formData.choiceB}</span>
                    </div>
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
                <Save size={16} />
                <span>{isSubmitting ? "جاري الحفظ..." : "حفظ ونشر قصة الأطفال"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default NewStoryBookView;
