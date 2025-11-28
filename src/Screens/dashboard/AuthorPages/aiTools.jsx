import React, { useState } from "react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";

import SummaryPanel from "../../../components/myui/Users/AuthorPages/AITools/SummaryPanel";
import PdfInputCard from "../../../components/myui/Users/AuthorPages/AITools/PdfInputCard";

export default function AITools({ pageName = "مولّد الخلاصات الذكي" }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  // ⭐ NEW — detect first SSE chunk
  const [hasStarted, setHasStarted] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const notify = (variant, title, description) => {
    setAlert({ open: true, variant, title, description });
  };

 const onGenerate = async (values, errTitle, errMsg) => {
  if (errTitle) return notify("error", errTitle, errMsg);

  const { type, wordCount, audience, file } = values;

  setLoading(true);
  setSummary("");
  setHasStarted(false);

  try {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("wordCount", wordCount);
    formData.append("audience", audience);
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/conclusion/generate`,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        body: formData,
      }
    );

    if (!response.ok) {
      setLoading(false);
      return notify("error", "فشل التوليد", "حدث خطأ أثناء الاتصال بالخادم");
    }

    //------------------------------
    // ⭐ NON-STREAM RESPONSE PARSING
    //------------------------------
    const data = await response.json();

   if (!data || !data.data || !data.data.content) {
  setLoading(false);
  return notify("error", "استجابة غير صالحة", "الخادم لم يرجع نص الخلاصة");
}

setSummary(data.data.content);

    notify("success", "تم التوليد", "الخلاصة جاهزة الآن.");
  } catch (error) {
    notify("error", "خطأ غير متوقع", error.message);
  }

  setLoading(false);
};


  return (
    <div className="min-h-screen bg-[var(--earth-cream)] rtl">
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

      {/* TOAST */}
      <AlertToast
        open={alert.open}
        variant={alert.variant}
        title={alert.title}
        description={alert.description}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  );
}
