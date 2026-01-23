import React, { useState } from "react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";

import SummaryPanel from "../../../components/myui/Users/AuthorPages/AITools/SummaryPanel";
import PdfInputCard from "../../../components/myui/Users/AuthorPages/AITools/PdfInputCard";

export default function AITools({ pageName = "مولّد الخاتمة الذكي" }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  // detect first SSE chunk
  const [hasStarted, setHasStarted] = useState(false);

  const onGenerate = async (values, errTitle, errMsg) => {
    if (errTitle) return AlertToast(errMsg, "error");

    const { wordCount, audience, file } = values;

    setLoading(true);
    setSummary("");
    setHasStarted(false);

    try {
      const formData = new FormData();
      formData.append("approxWordCountForEnding", wordCount);
      formData.append("file", file);
      formData.append("audienceProfile", audience);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/book-ending/upload`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: formData,
        },
      );

      //------------------------------
      // ⭐ NON-STREAM RESPONSE PARSING
      //------------------------------
      const data = await response.json();

      if (data?.messageStatus !== "SUCCESS") {
        AlertToast(data?.message, data?.messageStatus);
        setLoading(false);

        return;
      }

      const endingText = data?.data?.endingText;

      if (!endingText) {
        setLoading(false);
        return AlertToast("الخادم لم يرجع نص نهاية صالح", "error");
      }

      setSummary(endingText);

      AlertToast(
        data.message || "الخلاصة جاهزة الآن.",
        data.messageStatus || "success",
      );
    } catch (err) {
      AlertToast(err.message || "خطأ غير متوقع", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white rtl">
      {/* NAVBAR */}
      <Navbar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        pageName={pageName}
      />

      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300 
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex-1 flex flex-col">
          <PageHeader mainTitle={pageName} buttonTitle="" onPress={() => {}} />

          <div className="flex flex-col-reverse lg:flex-row flex-1 p-4 lg:p-8 gap-6 lg:gap-8">
            {/* LEFT — AI RESULT */}
            <SummaryPanel
              loading={loading}
              summary={summary}
              hasStarted={hasStarted}
            />

            {/* RIGHT — FORM */}
            <PdfInputCard onGenerate={onGenerate} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}
