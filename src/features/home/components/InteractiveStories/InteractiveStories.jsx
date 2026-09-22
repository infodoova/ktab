import React from "react";
import { GitBranch, ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import {
  useInteractiveStories,
  HERO_STORY,
  SUB_STORIES,
} from "../../hooks/useInteractiveStories";
import "./InteractiveStories.css";

/**
 * Modern Apple Books-inspired Interactive Stories showcase.
 * Architecture:
 * 1. Section Header (Editorial typography with naked icon).
 * 2. Full-width Hero Card featuring the live interactive story experience in an Apple device frame.
 * 3. Two-column companion subgrid for Story Creation Studio & Catalog Discovery.
 */
export default function InteractiveStories() {
  const hookResult = useInteractiveStories() || {};
  const heroStory = hookResult.heroStory || HERO_STORY;
  const subStories = Array.isArray(hookResult.subStories) && hookResult.subStories.length > 0
    ? hookResult.subStories
    : Array.isArray(hookResult.pillars) && hookResult.pillars.length > 0
    ? hookResult.pillars
    : SUB_STORIES;
  const handlePillarAction = hookResult.handlePillarAction || (() => {});

  return (
    <section id="interactive-stories" className="apple-stories-section" dir="rtl">
      <div className="apple-stories-container">
        {/* Editorial Section Header */}
        <div className="apple-stories-header">
          <SectionHeader
            icon={GitBranch}
            eyebrow="القصص التفاعلية"
            title="عالم كامل من القصص التفاعلية وصنّاعها"
            align="start"
            theme="light"
          />
        </div>

        {/* ═══════════ APPLE BENTO SHOWCASE ═══════════ */}
        <div className="apple-bento-layout">
          {/* Top Hero Card: Experience the Story in Device Frame */}
          {heroStory && (
            <div className="apple-bento-hero">
              <div className="apple-hero-text-content">
                <h3 className="apple-card-title">{heroStory.title}</h3>
                <p className="apple-card-desc">{heroStory.description}</p>
                <button
                  type="button"
                  className="apple-pill-btn"
                  onClick={() => handlePillarAction(heroStory.route)}
                  aria-label={heroStory.actionLabel}
                >
                  <span>{heroStory.actionLabel}</span>
                  <ArrowLeft size={15} className="apple-btn-icon" />
                </button>
              </div>

              {/* Centered Device Showcase */}
              <div className="apple-hero-device-wrapper">
                <div className="apple-phone-frame">
                  {/* Dynamic Island / Bezel Top Accent */}
                  <div className="apple-phone-notch" />
                  <div className="apple-phone-screen">
                    <img
                      src={heroStory.image}
                      alt={heroStory.title}
                      className="apple-screen-img"
                      loading="lazy"
                    />
                  </div>
                  {/* Home Indicator Bar */}
                  <div className="apple-phone-home-indicator" />
                </div>
              </div>
            </div>
          )}

          {/* Bottom 2-Column Companion Subgrid */}
          <div className="apple-bento-subgrid">
            {subStories.map((story) => (
              <div key={story.id} className="apple-subcard">
                <div className="apple-subcard-text-content">
                  <h3 className="apple-card-title apple-subcard-title">
                    {story.title}
                  </h3>
                  <p className="apple-card-desc apple-subcard-desc">
                    {story.description}
                  </p>
                  <button
                    type="button"
                    className="apple-pill-btn apple-subcard-btn"
                    onClick={() => handlePillarAction(story.route)}
                    aria-label={story.actionLabel}
                  >
                    <span>{story.actionLabel}</span>
                    <ArrowLeft size={14} className="apple-btn-icon" />
                  </button>
                </div>

                {/* Framed Application Screenshot */}
                <div className="apple-subcard-preview-wrapper">
                  <div className="apple-subcard-preview-frame">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="apple-subcard-img"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
