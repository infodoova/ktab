import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import { getHelper, deleteHelper } from "../../../../apis/apiHelpers";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Story Components
import StorySkeletonLoader from "../../../components/myui/Users/AuthorPages/mystories/skeletonloader";
import SearchStoryComponent from "../../../components/myui/Users/AuthorPages/mystories/searchStoryComponent";
import StoryCardsComponent from "../../../components/myui/Users/AuthorPages/mystories/storyCardsComponent";
import StoryModal from "../../../components/myui/Users/AuthorPages/mystories/storymodal";
import DeleteStoryModal from "../../../components/myui/Users/AuthorPages/mystories/deletemodal";

function MyStories({ pageName = "قصصي التفاعلية" }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // Data State
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selection State
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const lastRef = useRef(null);

  // Fetch Logic
  const fetchStories = useCallback(async (pageNum) => {
    pageNum === 0 ? setLoading(true) : setLoadingMore(true);
    
    try {
      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/stories/me`,
        pagination: true,
        page: pageNum,
        size: 8
      });

      if (res.messageStatus === "SUCCESS") {
        const data = res.data || {};
        const content = Array.isArray(data.content) ? data.content : [];
        const total = data.totalPages || 1;
        
        setStories(prev => pageNum === 0 ? content : [...prev, ...content]);
        setTotalPages(total);
      } else {
        AlertToast(res?.message || "فشل تحميل القصص", res?.messageStatus || "error");
      }
    } catch (error) {
       console.error("Fetch stories failed:", error);
       AlertToast("حدث خطأ أثناء جلب القصص", "error");
    } finally {
      pageNum === 0 ? setLoading(false) : setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchStories(page);
  }, [page, fetchStories]);

  // Infinite Scroll Observer
  useEffect(() => {
    const currentLastRef = lastRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page + 1 < totalPages && !loadingMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.15 }
    );

    if (currentLastRef) observer.observe(currentLastRef);
    return () => {
      if (currentLastRef) observer.unobserve(currentLastRef);
    };
  }, [page, totalPages, loadingMore, loading]);

  // Actions
  const openDeleteModal = (story) => {
    setStoryToDelete(story);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (id) => {
      try {
         const res = await deleteHelper({ 
           url: `${import.meta.env.VITE_API_URL}/stories/${id}` 
         });
         
         if (res.messageStatus === "SUCCESS") {
            setStories(prev => prev.filter(s => s.id !== id));
            AlertToast("تم حذف القصة بنجاح", "success");
         } else {
            AlertToast(res?.message || "فشل في الحذف", "error");
         }
      } catch {
         AlertToast("حدث خطأ أثناء الحذف", "error");
      }
  };

  const handleEditStory = () => {
     // Placeholder for edit
     AlertToast("ميزة التعديل ستتوفر قريباً", "info");
  };

  const filteredStories = stories.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white rtl font-arabic" dir="rtl">
      {/* NAVBAR */}
      <div dir="ltr">
        <Navbar
            pageName={pageName}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileButtonTitle="قصة جديدة"
            onMobileButtonPress={() => navigate("/author/interactive-story")}
        />
      </div>

      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex-1 flex flex-col">
          <PageHeader 
            mainTitle={pageName} 
            buttonTitle="إنشاء قصة جديدة" 
            onPress={() => navigate("/author/interactive-story")}
          />

          {/* Scrollable Header Tools */}
          <div className="bg-white border-b border-black/5 p-6 md:p-8">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse gap-6 items-center justify-between">
                <div className="space-y-1 text-right">
                   <h2 className="text-2xl font-black text-black">رحلاتك <span className="text-[#5de3ba]">التفاعلية</span></h2>
                   <p className="text-xs font-bold text-black/30 uppercase tracking-widest">إدارة العوالم التي صنعتها</p>
                </div>
                <SearchStoryComponent value={searchQuery} onChange={setSearchQuery} />
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <StorySkeletonLoader count={8} />
              ) : filteredStories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                   <div className="w-24 h-24 rounded-[3rem] bg-[#5de3ba]/10 flex items-center justify-center text-[#5de3ba]">
                      <BookOpen size={48} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-black">لا توجد قصص بعد</h3>
                      <p className="text-black/40 font-bold">ابدأ بصناعة عالمك الخاص الآن واجذب القراء</p>
                   </div>
                   <button 
                    onClick={() => navigate("/author/interactive-story")}
                    className="btn-premium px-10 py-4 rounded-3xl flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest"
                   >
                     <Plus size={18} />
                     ابدأ القصة الأولى
                   </button>
                </div>
              ) : (
                <>
                  <StoryCardsComponent 
                    stories={filteredStories} 
                    onStoryClick={setSelectedStory}
                    onDeleteStory={openDeleteModal}
                    onEditStory={handleEditStory}
                  />
                  
                  {/* Load More Trigger */}
                  <div ref={lastRef} className="h-32 flex items-center justify-center w-full">
                    {loadingMore && (
                      <div className="flex items-center gap-3 text-[#5de3ba] animate-pulse">
                         <Loader2 size={24} className="animate-spin" />
                         <span className="text-sm font-black uppercase tracking-widest">جاري التحميل...</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODALS */}
      <StoryModal 
        story={selectedStory} 
        onClose={() => setSelectedStory(null)} 
      />

      <DeleteStoryModal
        story={storyToDelete}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default MyStories;
