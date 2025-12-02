import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AIComponents({
  selectedAiTool,
  setSelectedAiTool,
  aiInput,
  setAiInput,
}) {
  const tools = [
    { id: "summary", label: "تحسين الملخص" },
    { id: "title", label: "عنوان جديد" },
    { id: "age", label: "تحليل العمر" },
    { id: "cover", label: "تحسين الغلاف" },
    { id: "keywords", label: "كلمات مفتاحية" },
  ];

  return (
    <div
      className="
        rounded-3xl shadow-xl p-6 md:p-10 border border-[#d3c8b8]
        bg-gradient-to-br from-[#faf7f1] to-[#f0ebe3]
      "
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#2a2d28]">أدوات الذكاء الاصطناعي</h3>
        <Badge className="bg-[#6e8b50] text-white px-3">Beta</Badge>
      </div>

      {/* Tool Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedAiTool(tool.id)}
            className={`
              px-5 py-2 rounded-xl text-sm font-medium transition border
              ${
                selectedAiTool === tool.id
                  ? "bg-[#6e8b50] text-white border-[#6e8b50]"
                  : "bg-white border-[#d3c8b8] text-[#645c45] hover:bg-[#f3eee6]"
              }
            `}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <textarea
        value={aiInput}
        onChange={(e) => setAiInput(e.target.value)}
        placeholder="اكتب طلبك..."
        className="
          w-full h-32 p-4 mt-5 rounded-2xl
          border border-[#d3c8b8] bg-white text-[#3d4a43]
          focus:ring-2 focus:ring-[#6e8b50] shadow-sm
        "
      />

      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => setAiInput("")}
          className="border-[#d3c8b8] text-[#645c45]"
        >
          مسح
        </Button>

        <Button className="bg-[#6e8b50] hover:bg-[#5f6748] text-white rounded-xl">
          تنفيذ
        </Button>
      </div>
    </div>
  );
}
