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
    <div className="border-t border-[#D7CCC8] pt-12">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#606C38] rounded-full"></div>
        <h3 className="text-2xl font-bold text-[#3E2723] flex items-center gap-2">
           مساعد الذكاء الاصطناعي <Sparkles className="w-5 h-5 text-[#DEC59E]" />
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
                w-full text-right px-5 py-4 rounded-xl text-sm font-bold transition-all flex justify-between items-center
                ${selectedAiTool === tool.id 
                    ? "bg-[#606C38] text-white shadow-lg shadow-[#606C38]/20" 
                    : "bg-[#FEFCF8] text-[#5D4037] border border-[#D7CCC8] hover:bg-white hover:border-[#606C38]"}
                `}
            >
                {tool.label}
                {selectedAiTool === tool.id && <Wand2 className="w-4 h-4 text-white" />}
            </button>
            ))}
        </div>

        {/* Right: Interaction Area */}
        <div className="lg:col-span-3 bg-[#FEFCF8] rounded-2xl p-2 border border-[#D7CCC8] shadow-sm">
            <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="أطلب من الذكاء الاصطناعي تحليل هذا الكتاب..."
                className="w-full h-40 p-6 bg-transparent text-[#3E2723] placeholder:text-[#D7CCC8] focus:outline-none resize-none text-lg"
            />
            <div className="flex justify-between items-center px-6 pb-4 pt-4 border-t border-[#D7CCC8]/50">
                <span className="text-xs text-[#D7CCC8] font-semibold tracking-wider"> </span>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setAiInput("")} className="text-[#5D4037] hover:text-[#3E2723] hover:bg-[#F4EFE9]">
                        مسح
                    </Button>
                    <Button className="bg-[#3E2723] text-white hover:bg-[#5D4037] rounded-lg px-8 font-bold">
                        <Bot className="w-4 h-4 ml-2" />
                        توليد
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}