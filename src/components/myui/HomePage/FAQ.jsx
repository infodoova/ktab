"use client";
/* eslint-disable no-unused-vars */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function FAQ() {
  return (
    <section
      id="FAQ"
      dir="rtl"
      className="
        w-full py-28
bg-[var(--bg-dark)]        px-6 md:px-20
        text-right
        relative
        overflow-hidden
      "
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-button)]/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      {/* HEADER SECTION - Unified Design */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
          الأسئلة <span className="text-[var(--primary-button)]">الشائعة</span>
        </h2>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-medium leading-relaxed">
          كل ما تحتاج معرفته عن منصة كتاب وكيفية الاستفادة من ميزاتها المختلفة
          في مكان واحد.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="q5" className="border-b border-white/10 py-2">
          <AccordionTrigger className="text-xl font-bold text-white hover:text-[var(--primary-button)] transition-colors text-right no-underline hover:no-underline">
            هل يمكنني استخدام التطبيق على أكثر من جهاز؟
          </AccordionTrigger>
          <AccordionContent className="text-lg text-white/60 leading-relaxed text-right pt-4 pb-6">
            نعم، يمكنك تسجيل الدخول والوصول لكل كتبك وتقدّمك من أي جهاز: الهاتف،
            التابلت، أو الكمبيوتر.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q6" className="border-b border-white/10 py-2">
          <AccordionTrigger className="text-xl font-bold text-white hover:text-[var(--primary-button)] transition-colors text-right no-underline hover:no-underline">
            هل تطبيق كتاب مجاني بالكامل؟
          </AccordionTrigger>
          <AccordionContent className="text-lg text-white/60 leading-relaxed text-right pt-4 pb-6">
            يمكنك استخدام الميزات الأساسية مجانًا. كما يمكنك الاشتراك في الخطط
            المدفوعة للوصول إلى مكتبة أكبر ومزايا تعليمية إضافية.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q7" className="border-b border-white/10 py-2">
          <AccordionTrigger className="text-xl font-bold text-white hover:text-[var(--primary-button)] transition-colors text-right no-underline hover:no-underline">
            هل المحتوى داخل التطبيق مُراجع وآمن؟
          </AccordionTrigger>
          <AccordionContent className="text-lg text-white/60 leading-relaxed text-right pt-4 pb-6">
            نعم، كل المحتوى يخضع للمراجعة والتدقيق لضمان الجودة والملاءمة لكل
            الفئات العمرية.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q8" className="border-b border-white/10 py-2">
          <AccordionTrigger className="text-xl font-bold text-white hover:text-[var(--primary-button)] transition-colors text-right no-underline hover:no-underline">
            هل يمكن للمدارس والمؤسسات استخدام كُتّاب؟
          </AccordionTrigger>
          <AccordionContent className="text-lg text-white/60 leading-relaxed text-right pt-4 pb-6">
            نعم، نوفر باقات خاصة للمدارس والمؤسسات التعليمية مع لوحات متابعة
            جماعية وإدارة صفوف وطلاب.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q10" className="border-b border-white/10 py-2">
          <AccordionTrigger className="text-xl font-bold text-white hover:text-[var(--primary-button)] transition-colors text-right no-underline hover:no-underline">
            كيف يمكنني نشر كتابي على كتاب؟
          </AccordionTrigger>
          <AccordionContent className="text-lg text-white/60 leading-relaxed text-right pt-4 pb-6">
            يمكنك إرسال كتابك عبر حساب المؤلف داخل التطبيق، ليتم مراجعته ونشره
            ضمن أقسام المنصة.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q11" className="border-b border-white/10 py-2">
          <AccordionTrigger className="text-xl font-bold text-white hover:text-[var(--primary-button)] transition-colors text-right no-underline hover:no-underline">
            هل التطبيق مناسب للمستخدمين الكبار أيضاً؟
          </AccordionTrigger>
          <AccordionContent className="text-lg text-white/60 leading-relaxed text-right pt-4 pb-6">
            طبعًا—التطبيق مخصص لكل الأعمار ويحتوي على كتب للكبار، روايات، وتطوير
            ذات ومجالات مختلفة.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q12" className="border-b border-white/10 py-2">
          <AccordionTrigger className="text-xl font-bold text-white hover:text-[var(--primary-button)] transition-colors text-right no-underline hover:no-underline">
            هل يوجد دعم فني عند وجود مشكلة؟
          </AccordionTrigger>
          <AccordionContent className="text-lg text-white/60 leading-relaxed text-right pt-4 pb-6">
            نعم، يمكنك التواصل مع فريق الدعم عبر التطبيق، وسيتم الرد خلال وقت
            قصير.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
