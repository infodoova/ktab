import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { BottomSheet } from "@/components/myui";
import { ErrorBoundary } from "@/components/common";
import { PdfInputCard, SummaryPanel } from "../components";
import { useAiTools } from "../hooks/useAiTools";
import "./AiToolsView.css";

/**
 * Pure presentation view for AI tools (book ending analysis & generation).
 * Orchestrated by useAiTools hook.
 * On desktop: 2-column studio layout (stationary inspector + scrollable story).
 * On mobile: Full-width story canvas with a sleek BottomSheet for inputs.
 */
export function AiToolsView({ pageName = "أدوات الذكاء الاصطناعي" }) {
  const {
    loading,
    summary,
    isFormSheetOpen,
    openFormSheet,
    closeFormSheet,
    handleGenerate,
  } = useAiTools();

  return (
    <AppLayout
      pageName={pageName}
      showSearch={false}
      className="ktab-ai-tools-layout-wrapper"
    >
      <div className="ktab-ai-tools-view" dir="rtl">
        <div className="ktab-ai-tools-layout">
          {/* Desktop Input Column (Hidden on mobile < 1024px) */}
          <div className="ktab-ai-tools-input-col">
            <ErrorBoundary variant="card" title="تعذر عرض نموذج رفع الكتاب">
              <PdfInputCard onGenerate={handleGenerate} loading={loading} />
            </ErrorBoundary>
          </div>

          {/* Results Summary Panel (Full width on mobile) */}
          <div className="ktab-ai-tools-result-col">
            <ErrorBoundary variant="card" title="تعذر عرض نتائج التلخيص">
              <SummaryPanel
                loading={loading}
                summary={summary}
                onOpenMobileForm={openFormSheet}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Mobile Action Bar: Floating Trigger to Open Form BottomSheet */}
        <div className="ktab-ai-mobile-action-bar">
          <button
            type="button"
            onClick={openFormSheet}
            className="ktab-ai-mobile-open-btn"
            aria-label="فتح إعدادات التحليل والتوليد"
          >
            <SlidersHorizontal size={17} strokeWidth={2.2} />
            <span>إعدادات التحليل وتوليد خاتمة</span>
          </button>
        </div>

        {/* Mobile Form BottomSheet */}
        <BottomSheet
          isOpen={isFormSheetOpen}
          onClose={closeFormSheet}
          title="إعدادات التحليل والتوليد"
          description="ارفع مسودة الكتاب وحدد الخصائص لصياغة خاتمة احترافية"
          maxHeight="92vh"
        >
          <div className="ktab-ai-sheet-content">
            <ErrorBoundary variant="card" title="تعذر عرض نموذج رفع الكتاب">
              <PdfInputCard onGenerate={handleGenerate} loading={loading} />
            </ErrorBoundary>
          </div>
        </BottomSheet>
      </div>
    </AppLayout>
  );
}

export default AiToolsView;

