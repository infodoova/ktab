"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section
      id="FAQ"
      className="w-full py-12 bg-white rtl text-right px-6 md:px-20"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--earth-brown)] mb-10">
        الأسئلة الشائعة
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
       <AccordionItem value="q5" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    هل يمكنني استخدام التطبيق على أكثر من جهاز؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    نعم، يمكنك تسجيل الدخول والوصول لكل كتبك وتقدّمك من أي جهاز: الهاتف، التابلت،
    أو الكمبيوتر.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="q6" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    هل تطبيق كُتّاب مجاني بالكامل؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    يمكنك استخدام الميزات الأساسية مجانًا. كما يمكنك الاشتراك في الخطط المدفوعة
    للوصول إلى مكتبة أكبر ومزايا تعليمية إضافية.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="q7" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    هل المحتوى داخل التطبيق مُراجع وآمن؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    نعم، كل المحتوى يخضع للمراجعة والتدقيق لضمان الجودة والملاءمة لكل الفئات
    العمرية.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="q8" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    هل يمكن للمدارس والمؤسسات استخدام كُتّاب؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    نعم، نوفر باقات خاصة للمدارس والمؤسسات التعليمية مع لوحات متابعة جماعية
    وإدارة صفوف وطلاب.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="q9" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    هل يمكنني تحميل الكتب للقراءة بدون إنترنت؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    نعم، بعض الكتب يمكن تحميلها للقراءة بلا إنترنت بحسب نوع الاشتراك.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="q10" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    كيف يمكنني نشر كتابي على كُتّاب؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    يمكنك إرسال كتابك عبر حساب الكاتب داخل التطبيق، ليتم مراجعته ونشره ضمن
    أقسام المنصة.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="q11" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    هل التطبيق مناسب للمستخدمين الكبار أيضاً؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    طبعًا—التطبيق مخصص لكل الأعمار ويحتوي على كتب للكبار، روايات، وتطوير ذات
    ومجالات مختلفة.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="q12" className="border-b border-[var(--earth-brown)]/20">
  <AccordionTrigger className="text-lg font-semibold text-[var(--earth-brown)]">
    هل يوجد دعم فني عند وجود مشكلة؟
  </AccordionTrigger>
  <AccordionContent className="text-[15px] text-[var(--earth-olive-dark)] leading-relaxed">
    نعم، يمكنك التواصل مع فريق الدعم عبر التطبيق، وسيتم الرد خلال وقت قصير.
  </AccordionContent>
</AccordionItem>

      </Accordion>
    </section>
  );
}
