import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { PdfInputCard } from "../components/PdfInputCard";
import { SummaryPanel } from "../components/SummaryPanel";
import { useAiTools } from "../hooks/useAiTools";
import { ErrorBoundary } from "@/components/common";

/**
 * Pure presentation view for AI tools.
 */
export function AiToolsView({ pageName = "أدوات الذكاء الاصطناعي" }) {
  const { loading, summary, handleGenerate } = useAiTools();

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="flex flex-col-reverse lg:flex-row gap-8 max-w-7xl mx-auto" dir="rtl">
        {/* Left / Result */}
        <ErrorBoundary variant="card" title="تعذر عرض نتائج التلخيص" className="flex-1">
          <SummaryPanel loading={loading} summary={summary} />
        </ErrorBoundary>

        {/* Right / Input Form */}
        <ErrorBoundary variant="card" title="تعذر عرض نموذج رفع الكتاب" className="w-full lg:w-96">
          <PdfInputCard onGenerate={handleGenerate} loading={loading} />
        </ErrorBoundary>
      </div>
    </AppLayout>
  );
}


export default AiToolsView;
