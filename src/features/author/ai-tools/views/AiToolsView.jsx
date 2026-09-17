import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { ErrorBoundary } from "@/components/common";
import { PdfInputCard, SummaryPanel } from "../components";
import { useAiTools } from "../hooks/useAiTools";
import "./AiToolsView.css";

/**
 * Pure presentation view for AI tools (book ending analysis & generation).
 * Orchestrated by useAiTools hook.
 */
export function AiToolsView({ pageName = "أدوات الذكاء الاصطناعي" }) {
  const { loading, summary, handleGenerate } = useAiTools();

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="ktab-ai-tools-view" dir="rtl">
        <div className="ktab-ai-tools-layout">
          {/* Input Configuration Card */}
          <div className="ktab-ai-tools-input-col">
            <ErrorBoundary variant="card" title="تعذر عرض نموذج رفع الكتاب">
              <PdfInputCard onGenerate={handleGenerate} loading={loading} />
            </ErrorBoundary>
          </div>

          {/* Results Summary Panel */}
          <div className="ktab-ai-tools-result-col">
            <ErrorBoundary variant="card" title="تعذر عرض نتائج التلخيص">
              <SummaryPanel loading={loading} summary={summary} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default AiToolsView;
