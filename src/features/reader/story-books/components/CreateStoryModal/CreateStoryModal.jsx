import React, { memo } from "react";
import { X, BookOpen, User, Palette, Layers, Loader2, Plus } from "lucide-react";
import { InputComponent as Input } from "@/components/myui/forms/Input/Input";
import { Select } from "@/components/myui/forms/Select/Select";
import {
  AGE_FILTERS,
  STORY_THEMES,
  STORY_ART_STYLES,
  CATEGORY_FILTERS,
} from "../../constants/storyBooksConstants";
import "./CreateStoryModal.css";

/**
 * Interactive Creation Modal for Children's Story Books.
 * Provides testing inputs for title, hero character name, age tier, theme, and art style.
 */
export const CreateStoryModal = memo(function CreateStoryModal({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  isCreating,
}) {
  if (!isOpen) return null;

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
    <div
      className="child-create-modal__backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="child-create-modal-title"
    >
      <div
        className="child-create-modal__card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="child-create-modal__header">
          <div className="child-create-modal__header-info">
            <div className="child-create-modal__icon-badge">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 id="child-create-modal-title" className="child-create-modal__title">
                ابتكار قصة أطفال تفاعلية
              </h2>
              <p className="child-create-modal__desc">
                أنشئ قصة ساحرة 1:1 مخصصة لطفلك برسومات وقيم ممتعة
              </p>
            </div>
          </div>
          <button
            type="button"
            className="child-create-modal__close-btn"
            onClick={onClose}
            aria-label="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="child-create-modal__form">
          <div className="child-create-modal__fields-grid">
            {/* Story Title */}
            <div className="child-create-modal__col--full">
              <Input
                label="عنوان الحكاية"
                placeholder="مثال: مغامرة الأرنب الصغير في الغابة المضيئة"
                value={formData.title}
                onChange={(e) => onFormChange("title", e.target.value)}
                icon={<BookOpen size={16} />}
                required
              />
            </div>

            {/* Child / Hero Name */}
            <div className="child-create-modal__col--half">
              <Input
                label="اسم البطل أو البطلة الصغيرة"
                placeholder="مثال: سوسو، كريم، ليلى..."
                value={formData.heroName}
                onChange={(e) => onFormChange("heroName", e.target.value)}
                icon={<User size={16} />}
              />
            </div>

            {/* Age Group */}
            <div className="child-create-modal__col--half">
              <Select
                label="الفئة العمرية"
                options={ageOptions}
                value={formData.ageGroup}
                onChange={(val) => onFormChange("ageGroup", val)}
              />
            </div>

            {/* Category */}
            <div className="child-create-modal__col--half">
              <Select
                label="نوع المغامرة والقسم"
                options={categoryOptions}
                value={formData.category}
                onChange={(val) => onFormChange("category", val)}
                icon={<Layers size={16} />}
              />
            </div>

            {/* Art Style */}
            <div className="child-create-modal__col--half">
              <Select
                label="نمط الرسوم التوضيحية"
                options={artStyleOptions}
                value={formData.artStyle}
                onChange={(val) => onFormChange("artStyle", val)}
                icon={<Palette size={16} />}
              />
            </div>

            {/* Interactive Theme Selection */}
            <div className="child-create-modal__col--full">
              <label className="child-create-modal__theme-label">
                اختر بيئة المغامرة السحرية:
              </label>
              <div className="child-create-modal__theme-grid">
                {STORY_THEMES.map((theme) => {
                  const isSelected = formData.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      className={`child-create-modal__theme-card ${
                        isSelected ? "child-create-modal__theme-card--selected" : ""
                      }`}
                      onClick={() => onFormChange("theme", theme.id)}
                    >
                      <span className="child-create-modal__theme-title">{theme.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="child-create-modal__footer">
            <button
              type="submit"
              className="child-create-modal__btn-submit"
              disabled={isCreating || !formData.title.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 size={16} className="child-create-modal__spinner" />
                  <span>جاري إنشاء القصة...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>إنشاء القصة</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CreateStoryModal;
