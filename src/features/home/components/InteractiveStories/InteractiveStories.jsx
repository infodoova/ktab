import React from "react";
import { GitBranch, ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { useInteractiveStories } from "../../hooks/useInteractiveStories";
import "./InteractiveStories.css";

/**
 * 3-Pillar Interactive Story Showcase (عالم كامل من القصص التفاعلية وصنّاعها).
 * Each card: Title → Description → Action button → App screenshot.
 * Pure Light Mode, Apple editorial aesthetic, zero clutter.
 */
export default function InteractiveStories() {
  const { pillars, handlePillarAction } = useInteractiveStories();

  return (
    <section id="interactive-stories" className="er-section" dir="rtl">
      <div className="er-container">
        {/* Editorial Section Header */}
        <SectionHeader
          icon={GitBranch}
          eyebrow="القصص التفاعلية"
          title="عالم كامل من القصص التفاعلية وصنّاعها"
          align="start"
          theme="light"
        />

        {/* ═══════════ 3 CLEAN PILLAR CARDS ═══════════ */}
        <div className="er-grid">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="er-card"
            >
              {/* Pillar Title */}
              <h3 className="er-card-title">{pillar.title}</h3>

              {/* Description */}
              <p className="er-card-desc">{pillar.description}</p>

              {/* Black Action Button Under Text */}
              <button
                type="button"
                className="er-card-action"
                onClick={() => handlePillarAction(pillar.route)}
                aria-label={pillar.actionLabel}
              >
                <span>{pillar.actionLabel}</span>
                <ArrowLeft size={13} strokeWidth={2.4} />
              </button>

              {/* App Screenshot */}
              <div className="er-card-preview">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="er-card-img"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
