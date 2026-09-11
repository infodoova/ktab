import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ArrowLeft } from "lucide-react";
import { useRoles } from "../../hooks/useRoles";
import SectionHeader from "@/components/common/SectionHeader";
import "./Roles.css";

/**
 * Modern Architectural 4-Card Bento Grid (Light Mode).
 * Fluid spring scroll reveal, dynamic grid hover transitions,
 * and expanding capabilities list ("ما يمكنك فعله") on hover.
 * Zero business logic inside JSX; all animation variants and navigation reside in useRoles.
 */
export default function Roles() {
  const {
    reader,
    author,
    educator,
    student,
    hoveredRoleId,
    handleCardMouseEnter,
    handleCardMouseLeave,
    containerVariants,
    cardVariants,
    headerVariants,
    featureListVariants,
    featureItemVariants,
    handleStartNow,
  } = useRoles();

  return (
    <section id="roles" className="arch-roles-section" dir="rtl">
      {/* Editorial Section Header (Global Component with Scroll Reveal) */}
      <motion.div
        className="arch-roles-header-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={headerVariants}
      >
        <SectionHeader
          icon={Users}
          eyebrow="تجربة مخصصة لكل مستخدم"
          title="أدوار تتناغم معـاً"
          align="start"
        />
      </motion.div>

      {/* Modern 4-Card Architectural Bento Grid with Dynamic Hover Grid Adaptation */}
      <div className="arch-bento-wrapper">
        <motion.div
          className="arch-bento-grid"
          data-hovered={hoveredRoleId || "idle"}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* 1. Reader: Tall Commanding Hero Canvas (Spans 2 Rows) */}
          {reader && (
            <motion.div
              className="arch-card arch-card-hero"
              data-active={hoveredRoleId === "reader"}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              onMouseEnter={() => handleCardMouseEnter("reader")}
              onMouseLeave={handleCardMouseLeave}
            >
              <img
                src={reader.image}
                alt={reader.title}
                className="arch-card-img"
                loading="lazy"
                decoding="async"
              />
              <div className="arch-card-gradient arch-hero-gradient" />
              <div className="arch-card-content arch-hero-content">
                <h3 className="arch-card-title arch-hero-title">{reader.title}</h3>
                <p className="arch-card-text arch-hero-text">{reader.headline}</p>

                {/* Expanding Capabilities List on Hover */}
                <AnimatePresence>
                  {hoveredRoleId === "reader" && reader.features && (
                    <motion.ul
                      className="arch-features-list"
                      variants={featureListVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {reader.features.map((feat, idx) => (
                        <motion.li
                          key={`reader-feat-${idx}`}
                          className="arch-feature-item"
                          variants={featureItemVariants}
                        >
                          <span className="arch-feature-dot" aria-hidden="true" />
                          <span>{feat}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  className="arch-card-btn arch-hero-btn"
                  onClick={() => handleStartNow(reader.roleKey)}
                  aria-label={`ابدأ الآن كـ ${reader.title}`}
                >
                  <span>ابدأ الآن</span>
                  <ArrowLeft size={16} className="arch-btn-icon" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. Author: Wide Panoramic Feature Canvas (Spans 2 Columns) */}
          {author && (
            <motion.div
              className="arch-card arch-card-wide"
              data-active={hoveredRoleId === "author"}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              onMouseEnter={() => handleCardMouseEnter("author")}
              onMouseLeave={handleCardMouseLeave}
            >
              <img
                src={author.image}
                alt={author.title}
                className="arch-card-img"
                loading="lazy"
                decoding="async"
              />
              <div className="arch-card-gradient" />
              <div className="arch-card-content">
                <h3 className="arch-card-title">{author.title}</h3>
                <p className="arch-card-text">{author.headline}</p>

                {/* Expanding Capabilities List on Hover */}
                <AnimatePresence>
                  {hoveredRoleId === "author" && author.features && (
                    <motion.ul
                      className="arch-features-list"
                      variants={featureListVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {author.features.map((feat, idx) => (
                        <motion.li
                          key={`author-feat-${idx}`}
                          className="arch-feature-item"
                          variants={featureItemVariants}
                        >
                          <span className="arch-feature-dot" aria-hidden="true" />
                          <span>{feat}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  className="arch-card-btn"
                  onClick={() => handleStartNow(author.roleKey)}
                  aria-label={`ابدأ الآن كـ ${author.title}`}
                >
                  <span>ابدأ الآن</span>
                  <ArrowLeft size={15} className="arch-btn-icon" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. Educator: Architectural Square Companion Canvas */}
          {educator && (
            <motion.div
              className="arch-card arch-card-educator"
              data-active={hoveredRoleId === "educator"}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              onMouseEnter={() => handleCardMouseEnter("educator")}
              onMouseLeave={handleCardMouseLeave}
            >
              <img
                src={educator.image}
                alt={educator.title}
                className="arch-card-img"
                loading="lazy"
                decoding="async"
              />
              <div className="arch-card-gradient" />
              <div className="arch-card-content">
                <h3 className="arch-card-title">{educator.title}</h3>
                <p className="arch-card-text">{educator.headline}</p>

                {/* Expanding Capabilities List on Hover */}
                <AnimatePresence>
                  {hoveredRoleId === "educator" && educator.features && (
                    <motion.ul
                      className="arch-features-list"
                      variants={featureListVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {educator.features.map((feat, idx) => (
                        <motion.li
                          key={`educator-feat-${idx}`}
                          className="arch-feature-item"
                          variants={featureItemVariants}
                        >
                          <span className="arch-feature-dot" aria-hidden="true" />
                          <span>{feat}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  className="arch-card-btn"
                  onClick={() => handleStartNow(educator.roleKey)}
                  aria-label={`ابدأ الآن كـ ${educator.title}`}
                >
                  <span>ابدأ الآن</span>
                  <ArrowLeft size={15} className="arch-btn-icon" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. Student: Architectural Square Companion Canvas */}
          {student && (
            <motion.div
              className="arch-card arch-card-student"
              data-active={hoveredRoleId === "student"}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              onMouseEnter={() => handleCardMouseEnter("student")}
              onMouseLeave={handleCardMouseLeave}
            >
              <img
                src={student.image}
                alt={student.title}
                className="arch-card-img"
                loading="lazy"
                decoding="async"
              />
              <div className="arch-card-gradient" />
              <div className="arch-card-content">
                <h3 className="arch-card-title">{student.title}</h3>
                <p className="arch-card-text">{student.headline}</p>

                {/* Expanding Capabilities List on Hover */}
                <AnimatePresence>
                  {hoveredRoleId === "student" && student.features && (
                    <motion.ul
                      className="arch-features-list"
                      variants={featureListVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {student.features.map((feat, idx) => (
                        <motion.li
                          key={`student-feat-${idx}`}
                          className="arch-feature-item"
                          variants={featureItemVariants}
                        >
                          <span className="arch-feature-dot" aria-hidden="true" />
                          <span>{feat}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  className="arch-card-btn"
                  onClick={() => handleStartNow(student.roleKey)}
                  aria-label={`ابدأ الآن كـ ${student.title}`}
                >
                  <span>ابدأ الآن</span>
                  <ArrowLeft size={15} className="arch-btn-icon" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
