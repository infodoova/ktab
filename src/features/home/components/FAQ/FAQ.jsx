import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { useFAQ } from "../../hooks/useFAQ";
import "./FAQ.css";

/**
 * FAQ Section — Pure Custom React Accordion (Zero Radix UI).
 * Uses unified SectionHeader, full-width edge-to-edge accordion, in pure Light Mode.
 */
export default function FAQ() {
  const { faqs, openId, toggleItem } = useFAQ();

  return (
    <section id="FAQ" className="faq-section" dir="rtl">
      <div className="faq-container">
        {/* Section Title (Unified SectionHeader) */}
        <SectionHeader
          icon={HelpCircle}
          eyebrow="إجابات لكل استفساراتك"
          title="الأسئلة الشائعة"
          align="start"
          theme="light"
        />

        {/* Full-width Underline Accordion */}
        <div className="faq-accordion" role="region" aria-label="الأسئلة الشائعة">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="faq-item">
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  data-state={isOpen ? "open" : "closed"}
                >
                  <span className="faq-question">{faq.question}</span>
                  <ChevronDown
                    className={`faq-chevron ${isOpen ? "is-open" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="faq-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="faq-content">
                        <p className="faq-answer">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
