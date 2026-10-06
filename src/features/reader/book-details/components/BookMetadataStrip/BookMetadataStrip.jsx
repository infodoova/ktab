import React from "react";
import { Tag, User, Globe, FileText, Calendar, Building, Sparkles } from "lucide-react";
import "./BookMetadataStrip.css";

/**
 * Apple Books metadata metrics strip component.
 * Displays key book specifications in an editorial horizontal row with vertical dividers.
 */
export function BookMetadataStrip({ book }) {
  if (!book) return null;

  const {
    mainGenreName,
    subGenreName,
    authorName,
    language = "ar",
    pageCount,
    ageRangeMin,
    ageRangeMax,
    publishDate,
    bookSource,
    libraryOrganizationName,
  } = book;

  // Format localized language details
  const isArabic = !language || language.toLowerCase().startsWith("ar");
  const langCode = isArabic ? "AR" : language.toUpperCase().slice(0, 2);
  const langLabel = isArabic ? "العربية" : "الإنجليزية";

  // Format publication date into year & month
  let releaseYear = "—";
  let releaseMonthDay = "—";
  if (publishDate) {
    try {
      const d = new Date(publishDate);
      if (!isNaN(d.getTime())) {
        releaseYear = d.getFullYear().toString();
        releaseMonthDay = d.toLocaleDateString("ar-EG", { month: "long", day: "numeric" });
      }
    } catch {
      // Ignored fallback
    }
  }

  // Format age range
  const ageDisplay =
    ageRangeMin && ageRangeMax
      ? `${ageRangeMin} - ${ageRangeMax}`
      : ageRangeMin
      ? `${ageRangeMin}+`
      : "الجميع";

  // Format publisher
  const publisherDisplay =
    bookSource === "AUTHOR"
      ? "مؤلف مستقل"
      : libraryOrganizationName || "منصة كِتَاب";

  const metrics = [
    {
      id: "genre",
      label: "التصنيف",
      icon: <Tag size={18} strokeWidth={2} />,
      primaryText: mainGenreName || "عام",
      secondaryText: subGenreName || "",
    },
    {
      id: "author",
      label: "المؤلف",
      icon: <User size={18} strokeWidth={2} />,
      primaryText: authorName || "كاتب كِتَاب",
      secondaryText: "المؤلف الرئيسي",
    },
    {
      id: "language",
      label: "اللغة",
      badge: langCode,
      primaryText: langLabel,
      secondaryText: "اللغة الأصلية",
    },
    {
      id: "pages",
      label: "عدد الصفحات",
      badge: pageCount ? String(pageCount) : "—",
      primaryText: pageCount ? "صفحة" : "غير محدد",
      secondaryText: "نسخة كاملة",
    },
    {
      id: "age",
      label: "الفئة العمرية",
      badge: ageDisplay,
      primaryText: "سنة",
      secondaryText: "المستوى الموصى به",
    },
    {
      id: "released",
      label: "تاريخ النشر",
      badge: releaseYear,
      primaryText: releaseMonthDay,
      secondaryText: "تاريخ الإصدار",
    },
    {
      id: "publisher",
      label: "الناشر",
      icon: <Building size={18} strokeWidth={2} />,
      primaryText: publisherDisplay,
      secondaryText: "مصدر العمل",
    },
  ];

  return (
    <section className="apple-meta-strip" dir="rtl" aria-label="مواصفات وتفاصيل العمل">
      <div className="apple-meta-strip__container">
        {metrics.map((m, index) => (
          <div key={m.id} className="apple-meta-strip__item">
            <span className="apple-meta-strip__label">{m.label}</span>
            <div className="apple-meta-strip__mid">
              {m.badge ? (
                <span className="apple-meta-strip__badge">{m.badge}</span>
              ) : (
                <span className="apple-meta-strip__icon">{m.icon}</span>
              )}
            </div>
            <span className="apple-meta-strip__primary">{m.primaryText}</span>
            {m.secondaryText && (
              <span className="apple-meta-strip__secondary">{m.secondaryText}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default BookMetadataStrip;
