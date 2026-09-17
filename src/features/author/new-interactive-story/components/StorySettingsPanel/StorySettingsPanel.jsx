import React from "react";
import { Sliders, Sparkles, Eye, Layers } from "lucide-react";
import { Select } from "@/components/myui/forms/Select";
import "./StorySettingsPanel.css";

/**
 * Story engine settings panel housing narrative perspective,
 * visual style, scene branch count, and stylistic notes.
 */
export function StorySettingsPanel({
  lens,
  artStyle,
  sceneCount,
  description,
  lensOptions = [],
  artStyleOptions = [],
  sceneCountConfig = { MIN: 3, MAX: 10, STEP: 1 },
  onInputChange,
  errors = {},
}) {
  return (
    <div className="new-story-settings-panel">
      <div className="new-story-settings-panel__header">
        <div className="new-story-settings-panel__title-wrap">
          <div className="new-story-settings-panel__title-icon">
            <Sliders size={16} />
          </div>
          <h3 className="new-story-settings-panel__title">إعدادات المحرك التفاعلي</h3>
        </div>
      </div>

      <div className="new-story-settings-panel__body">
        {/* Narrative Lens Selection */}
        <div className="new-story-settings-panel__field">
          <Select
            label="منظور السرد"
            options={lensOptions}
            value={lens}
            onChange={(e) => onInputChange("lens", e.target.value)}
            error={errors.lens}
            icon={<Eye size={15} />}
          />
        </div>

        {/* Visual Art Style Selection */}
        <div className="new-story-settings-panel__field">
          <Select
            label="النمط البصري للمشاهد"
            options={artStyleOptions}
            value={artStyle}
            onChange={(e) => onInputChange("artStyle", e.target.value)}
            error={errors.artStyle}
            icon={<Sparkles size={15} />}
          />
        </div>

        {/* Scene Count Range Slider */}
        <div className="new-story-settings-panel__field">
          <div className="new-story-settings-panel__slider-header">
            <label
              htmlFor="story-scene-count-slider"
              className="new-story-settings-panel__slider-label"
            >
              <Layers size={14} />
              <span>عدد المشاهد المقترحة</span>
            </label>
            <span className="new-story-settings-panel__slider-badge">
              {sceneCount} مشاهد
            </span>
          </div>

          <div className="new-story-settings-panel__slider-track-wrap">
            <input
              id="story-scene-count-slider"
              type="range"
              min={sceneCountConfig.MIN}
              max={sceneCountConfig.MAX}
              step={sceneCountConfig.STEP}
              value={sceneCount}
              onChange={(e) => onInputChange("sceneCount", Number(e.target.value))}
              className="new-story-settings-panel__slider"
              aria-valuemin={sceneCountConfig.MIN}
              aria-valuemax={sceneCountConfig.MAX}
              aria-valuenow={sceneCount}
              aria-label="عدد المشاهد المقترحة"
            />
            <div className="new-story-settings-panel__slider-ticks">
              <span>{sceneCountConfig.MIN} مشاهد</span>
              <span>{sceneCountConfig.MAX} مشاهد</span>
            </div>
          </div>
        </div>

        {/* Visual Style Notes (Optional) */}
        <div className="new-story-settings-panel__field">
          <label
            htmlFor="story-art-notes"
            className="new-story-settings-panel__field-label"
          >
            ملاحظات الرؤية البصرية (اختياري)
          </label>
          <textarea
            id="story-art-notes"
            rows={2}
            value={description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="مثال: إضاءة سينمائية داكنة، أجواء ضبابية مستوحاة من العصور الوسطى..."
            className="new-story-settings-panel__textarea"
          />
        </div>
      </div>
    </div>
  );
}

export default StorySettingsPanel;
