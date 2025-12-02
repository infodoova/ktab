import React, { useState, useCallback } from "react";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import BooksGrid from "../../../components/myui/Users/ReaderPages/MainPage/BooksCardComponent";
// Import the new Modal component
import BookSearchModal from "../../../components/myui/Users/ReaderPages/MainPage/BookSearchComponent"; 

import { getHelper } from "../../../../apis/apiHelpers";
import { getUserData } from "../../../../store/authToken";

export default function MyBooks({ pageName = "المكتبة" }) {
  const [collapsed, setCollapsed] = useState(false);
  
  // State for Search/Filter Modal (Lifted State)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    query: "",
    genres: [],
    features: [],
    rating: 1,
    age: ""
  });

  const [alert, setAlert] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const handleSearchClick = () => setIsSearchOpen(true);

  /* FETCH BOOKS - Now accepts filters as second arg */
  const fetchBooks = useCallback(async (page = 0) => {


    const dummy = [
     {
    id: "fb1",
    title: "الغابة المفقودة",
    genre: "فانتازيا",
    pageCount: 142,
    ageRangeMin: 7,
    ageRangeMax: 12,
    language: "عربي",
    hasAudio: true,
    totalReviews: 85,
    averageRating: 4.5,
    pdfDownloadUrl: "#",
    description:
      "رحلة سحرية داخل غابة قديمة تختبئ بين أشجارها أسرار عمرها آلاف السنين. يكتشف الأبطال ممرات غامضة وكائنات أسطورية تساعدهم أحياناً وتختبر شجاعتهم أحياناً أخرى. قصة مشوقة تمزج المغامرة بالخيال وتفتح الباب أمام عالم لا حدود له.",
    coverImageUrl:
      "https://images.pexels.com/photos/34875154/pexels-photo-34875154.jpeg",
  },
  {
    id: "fb2",
    title: "عدّاء الفضاء",
    genre: "خيال علمي",
    pageCount: 198,
    ageRangeMin: 10,
    ageRangeMax: 16,
    language: "عربي",
    hasAudio: false,
    totalReviews: 64,
    averageRating: 4.2,
    pdfDownloadUrl: "#",
    description:
      "قصة مراهق شجاع يجد نفسه في مهمة إنقاذ تمتد عبر المجرّات. يتنقّل بين الكواكب، يواجه مخاطر مجهولة، ويتعلم أسرار التكنولوجيا الفضائية. رواية سريعة الإيقاع تحمل القارئ إلى عالم من المغامرات الكونية والتحديات الملحمية.",
    coverImageUrl:
      "https://images.pexels.com/photos/34800109/pexels-photo-34800109.jpeg",
  },
  {
    id: "fb3",
    title: "حكايات البحر",
    genre: "مغامرات",
    pageCount: 90,
    ageRangeMin: 5,
    ageRangeMax: 10,
    language: "عربي",
    hasAudio: true,
    totalReviews: 45,
    averageRating: 4.7,
    pdfDownloadUrl: "#",
    description:
      "مجموعة قصصية تستكشف عالم الأعماق حيث تعيش مخلوقات بحرية مذهلة وتدور مغامرات مليئة بالاكتشاف. يتعرف الأطفال على أسرار البحار، الصداقة، والشجاعة من خلال حكايات ممتعة وسهلة القراءة تجعل الخيال يسبح بحرّية.",
    coverImageUrl:
      "https://images.pexels.com/photos/34733313/pexels-photo-34733313.jpeg",
  },
  {
    id: "fb4",
    title: "الغابة المفقودة",
    genre: "فانتازيا",
    pageCount: 142,
    ageRangeMin: 7,
    ageRangeMax: 12,
    language: "عربي",
    hasAudio: true,
    totalReviews: 85,
    averageRating: 4.5,
    pdfDownloadUrl: "#",
    description:
      "رحلة خيالية إلى غابة مليئة بالأسرار والعجائب. يكتشف الأبطال فيها مخلوقات غريبة، أطلال حضارات قديمة، وقوة سحرية تغيّر مسار حياتهم. قصة تشعل الفضول وتدفع القارئ للغوص في عالم ساحر ومشوّق.",
    coverImageUrl:
      "https://images.pexels.com/photos/34874933/pexels-photo-34874933.jpeg",
  },
  {
    id: "fb5",
    title: "الغابة المفقودة",
    genre: "فانتازيا",
    pageCount: 142,
    ageRangeMin: 7,
    ageRangeMax: 12,
    language: "عربي",
    hasAudio: true,
    totalReviews: 85,
    averageRating: 4.5,
    pdfDownloadUrl: "#",
    description:
      "مغامرة حالمة داخل غابة غامضة تتغير ملامحها مع كل خطوة. تتشابك الحكايات بين الأشجار العملاقة والممرات السرية، حيث يخوض الأبطال تحديات تبني شخصيتهم وتعلّمهم معنى الشجاعة والإصرار.",
    coverImageUrl:
      "https://images.pexels.com/photos/17510046/pexels-photo-17510046.jpeg",
  },
  {
    id: "fb6",
    title: "الغابة المفقودة",
    genre: "فانتازيا",
    pageCount: 142,
    ageRangeMin: 7,
    ageRangeMax: 12,
    language: "عربي",
    hasAudio: true,
    totalReviews: 85,
    averageRating: 4.5,
    pdfDownloadUrl: "#",
    description:
      "حكاية خيالية تدور أحداثها في غابة أسطورية تختبئ خلفها عوالم صغيرة ومخلوقات ذات قوى سحرية. يواجه الأبطال اختبارات صعبة تكشف عن قدراتهم الحقيقية وتدفعهم لاكتشاف ما هو أبعد من الخيال.",
    coverImageUrl:
      "https://images.pexels.com/photos/30206439/pexels-photo-30206439.jpeg",
  },
     
    ];

    try {
      const user = getUserData();
      if (!user?.userId) return { content: dummy, totalPages: 1 };

      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/books/author/${user.userId}`,
        pagination: true,
        page,
        size: 8,
      });

      const data = res?.data;

      if (!data?.content) return { content: dummy, totalPages: 1 };

      return {
        content: data.content,
        totalPages: data.totalPages || 1,
      };
    } catch {
      return { content: dummy, totalPages: 1 };
    }
  }, []);

  return (
    <div dir="rtl" className="bg-[var(--earth-cream)] min-h-screen">
      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onSearchClick={handleSearchClick} 
        />
      </div>

      <div
        className={`flex min-h-screen transition-all duration-300 md:flex-row-reverse ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1">
          
          {/* DESKTOP HEADER with Search Trigger */}
          <PageHeader 
            mainTitle={pageName} 
            onSearchClick={handleSearchClick} 
          />
          
          {/* GRID - receives filters */}
          <BooksGrid 
            fetchFunction={fetchBooks} 
            activeFilters={activeFilters}
          />

          {/* SEARCH MODAL */}
          <BookSearchModal 
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onApply={(newFilters) => {
              setActiveFilters(newFilters);
              setIsSearchOpen(false); // Close on apply
            }}
          />
        </main>
      </div>

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