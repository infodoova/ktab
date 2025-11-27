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

  const [alert, setAlert] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const notify = (variant, title, description) => {
    setAlert({ open: true, variant, title, description });
  };

  const onGenerate = (title, pdfFile, errTitle, errMsg) => {
    if (errTitle) {
      return notify("error", errTitle, errMsg);
    }

    // Start loading
    setLoading(true);
    setSummary("");

    // Fake AI processing delay
    setTimeout(() => {
      setLoading(false);
      setSummary("هذا مثال خلاصة يتم عرضها بعد اكتمال التوليد...");
      notify("success", "تم التوليد", "الخلاصة جاهزة الآن.");
    }, 2800);
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

          {/* ✅ PAGE HEADER IS BACK HERE */}
          <PageHeader
            mainTitle={pageName}
            buttonTitle=""
            onPress={() => {}}
          />

          {/* MAIN CONTENT */}
    {/* MAIN CONTENT */}
<div className="flex flex-col-reverse lg:flex-row flex-1 p-4 lg:p-8 gap-6 lg:gap-8">

  {/* LEFT — AI RESULT / LOADER */}
  <SummaryPanel loading={loading} summary={summary} />

  {/* RIGHT — FORM */}
  <PdfInputCard onGenerate={onGenerate} loading={loading} />

</div>


        </main>
      </div>

      {/* ALERT TOAST */}
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
