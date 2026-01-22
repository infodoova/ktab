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
    <div className="border-t border-black/10 pt-16">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
          <Sparkles className="w-6 h-6 text-[var(--primary-button)]" />
        </div>
        <h3 className="text-3xl font-black text-[var(--primary-text)] tracking-tight">
           مساعد الذكاء الاصطناعي
        </h3>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left: Tools Menu */}
        <div className="lg:col-span-1 space-y-3">
            {tools.map((tool) => (
            <button
                key={tool.id}
                onClick={() => setSelectedAiTool(tool.id)}
                className={`
                w-full text-right px-6 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex justify-between items-center border
                ${selectedAiTool === tool.id 
                    ? "bg-black text-white border-black shadow-lg" 
                    : "bg-white text-[var(--primary-text)]/40 border-black/10 hover:border-black/20 hover:text-[var(--primary-text)]"}
                `}
            >
                {tool.label}
                {selectedAiTool === tool.id && <Wand2 className="w-4 h-4 text-[#5de3ba]" />}
            </button>
            ))}
        </div>

        {/* Right: Interaction Area */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-black/10 shadow-sm overflow-hidden flex flex-col">
            <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="أطلب من الذكاء الاصطناعي تحليل هذا الكتاب..."
                className="w-full h-56 p-8 bg-transparent text-[var(--primary-text)] font-black tracking-tight placeholder:text-black/10 focus:outline-none resize-none text-xl"
            />
            <div className="flex justify-between items-center px-8 py-6 border-t border-black/10 bg-gray-50/50">
                <span className="text-xs text-black/20 font-black tracking-widest uppercase">جاهز للتحليل</span>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setAiInput("")} className="text-[var(--primary-text)]/40 hover:text-red-500 font-black uppercase text-xs tracking-widest">
                        مسح
                    </Button>
                    <Button className="btn-premium text-white rounded-2xl h-14 px-10 font-black uppercase text-xs tracking-widest transition-all active:scale-95">
                        <Bot className="w-5 h-5 ml-2" strokeWidth={3} />
                        توليد النتائج
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}