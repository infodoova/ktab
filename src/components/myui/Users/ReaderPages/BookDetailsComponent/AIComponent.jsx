import React from "react";
import { Sparkles, Bot, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIComponents({ selectedAiTool, setSelectedAiTool, aiInput, setAiInput }) {
  const tools = [
    { id: "summary", label: "تلخيص ذكي" },
    { id: "title", label: "اقتراح عناوين" },
    { id: "age", label: "تحليل العمر" },
    { id: "keywords", label: "كلمات مفتاحية" },
  ];

  return (
    <div className="border-t border-white/5 pt-16">
      
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="p-4 rounded-[1.5rem] bg-gradient-to-br from-[#5de3ba] to-[#76debf] shadow-[0_10px_30px_rgba(93,227,186,0.3)]">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white tracking-tight">
             مساعد الذكاء الاصطناعي
          </h3>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">مدعوم بأحدث تقنيات التحليل الرقمي</p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 md:gap-10">
        
        {/* Tools Menu (Vertical stack on mobile, Sidebar on desktop) */}
        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 md:gap-4">
            {tools.map((tool) => (
            <button
                key={tool.id}
                onClick={() => setSelectedAiTool(tool.id)}
                className={`
                w-full text-right px-6 py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-all duration-300 flex justify-between items-center border-2
                ${selectedAiTool === tool.id 
                    ? "bg-gradient-to-r from-[#5de3ba] to-[#76debf] text-white border-transparent shadow-lg" 
                    : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"}
                `}
            >
                {tool.label}
                <Wand2 size={16} className={`mr-4 transition-transform ${selectedAiTool === tool.id ? "scale-100 opacity-100" : "scale-0 opacity-0 lg:scale-100 lg:opacity-20"}`} />
            </button>
            ))}
        </div>

        {/* Right: Interaction Area */}
        <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col group focus-within:ring-2 focus-within:ring-[var(--primary-button)]/30 transition-all duration-500">
            <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="أطلب من الذكاء الاصطناعي تحليل هذا الكتاب..."
                className="w-full h-48 md:h-64 p-6 md:p-10 bg-transparent text-white font-bold tracking-tight placeholder:text-white/10 focus:outline-none resize-none text-lg md:text-xl"
            />
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-10 py-6 md:py-8 border-t border-white/5 bg-black/20">
                <span className="text-[10px] text-white/20 font-bold tracking-[0.2em] uppercase hidden md:block">نظام التحليل جاهز للاستخدام</span>
                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
                    <Button variant="ghost" onClick={() => setAiInput("")} className="text-white/30 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest px-0">
                        إعادة تعيين
                    </Button>
                    <Button className="btn-premium text-white rounded-xl md:rounded-2xl h-14 md:h-16 px-8 md:px-12 font-bold uppercase text-[10px] md:text-xs tracking-[0.1em] transition-all active:scale-95 shadow-xl shrink-0">
                        <Bot className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3" strokeWidth={3} />
                        توليد التحليل
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}