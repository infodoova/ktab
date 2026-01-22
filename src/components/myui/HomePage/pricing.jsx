/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";

const plans = [
  {
    id: "reader",
    name: "قارئ فردي",
    tagline: "مكتبة رقمية شخصية بكل بساطة.",
    priceMonthly: "مجاني",
    priceYearly: "مجاني",
    highlight: false,
    features: [
      "وصول لمكتبة عربية مختارة",
      "وضع قراءة مريح وتظليل المقتطفات",
      "حفظ التقدّم والمفضّلة",
      "إحصاءات بسيطة عن القراءة",
    ],
  },
  {
    id: "family",
    name: "عائلة",
    tagline: "حتى ٤ ملفات قراءة للأطفال والأهل.",
    priceMonthly: "9",
    priceYearly: "90",
    highlight: true,
    features: [
      "٤ ملفات قراءة",
      "تقارير تقدم للأطفال",
      "مهام قراءة للأهل",
      "شارات وجوائز تشجيعية",
    ],
  },
  {
    id: "educator",
    name: "معلّم / صف",
    tagline: "لمن يريد إدارة صف واحد.",
    priceMonthly: "19",
    priceYearly: "190",
    highlight: false,
    features: [
      "إدارة صف كامل",
      "تعيين مهام وواجبات",
      "لوحة تحكم للطلاب",
      "تقارير جاهزة للأهل",
      "دعم القصص التفاعلية",
    ],
  },
];

/* Toggle component */
function BillingToggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        w-16 h-8 rounded-full p-1 flex items-center
        transition-all duration-300 border-2
        ${
          checked
            ? "bg-[var(--primary-button)] border-[var(--primary-button)] justify-end shadow-[0_0_15px_rgba(93,227,186,0.5)]"
            : "bg-white/5 border-white/20 justify-start"
        }
      `}
    >
      <div className="w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300" />
    </button>
  );
}

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      dir="rtl"
      className="relative py-32 overflow-hidden bg-[var(--bg-dark)]"
    >
      {/* BACKGROUND BLURS */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[var(--primary-button)]/15 blur-[160px] -top-56 -left-56" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-white blur-[180px] top-40 right-0 opacity-70" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER SECTION - Unified Design */}
        <div className="text-center mb-16 relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-5 py-2 rounded-full border border-[var(--primary-button)]/30 bg-[var(--primary-button)]/5 text-[var(--primary-button)] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6"
          >
            باقات الاشتراك
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-[var(--secondary-text)] tracking-tight mb-6"
          >
            خطط بسيطة <span className="text-[var(--primary-button)]">وواضحة</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--secondary-text)]/60 font-medium leading-relaxed"
          >
            اختر ما يناسبك من باقاتنا المرنة المصممة لتلبية احتياجاتك التعليمية والمعرفية بدون أي تعقيد.
          </motion.p>
        </div>

        {/* BILLING TOGGLE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-4 bg-[var(--bg-surface)]/80 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-white/10">
            <Label
              className={
                !yearly
                  ? "text-white"
                  : "text-white/40"
              }
            >
              شهري
            </Label>

            <BillingToggle checked={yearly} onChange={setYearly} />

            <Label
              className={
                yearly
                  ? "text-white"
                  : "text-white/40"
              }
            >
              سنوي
            </Label>
          </div>
        </motion.div>

        {/* PRICING CARDS */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`
                relative rounded-[2.5rem] p-10
                bg-[var(--bg-card)]/95 backdrop-blur-xl
                border border-white/5
                shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                transition-all duration-500
                overflow-hidden
                ${
                  plan.highlight
                    ? "scale-[1.06] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-[var(--primary-button)]/50"
                    : "hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:border-white/10"
                }
              `}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 left-0 h-2 bg-[var(--gradient)]" />
              )}
              {/* TITLE */}
              <h3 className="text-2xl font-bold text-white">
                {plan.name}
              </h3>
              <p className="text-white/60 mt-2">
                {plan.tagline}
              </p>

              {/* PRICE */}
              <div className="border-t border-white/10 pt-8 mt-8">
                {plan.priceMonthly === "مجاني" ? (
                  <div className="text-5xl font-extrabold text-white">
                    مجاني
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-5xl font-extrabold text-white">
                        {yearly ? plan.priceYearly : plan.priceMonthly}
                      </span>
                      <span className="text-lg text-white/50">
                        $
                      </span>
                    </div>
                    <span className="block text-right text-white/40 mt-1">
                      / {yearly ? "سنة" : "شهر"}
                    </span>
                  </>
                )}
              </div>

              {/* FEATURES */}
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-white/70 items-center"
                  >
                    <Check className="h-5 w-5 text-[var(--primary-button)]" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className="
                  w-full mt-10 py-4 rounded-2xl
                  font-black text-lg
                  text-[var(--bg-dark)]
                  shadow-xl shadow-[var(--primary-button)]/30
                  hover:scale-[1.02]
                  transition-all duration-300
                "
                style={{ background: "var(--gradient)" }}
              >
                ابدأ الآن
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
