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
function EarthToggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        w-16 h-8 rounded-full p-1 flex items-center
        transition-all duration-300 border
        ${
          checked
            ? "bg-[var(--earth-brown)] border-[var(--earth-brown)] justify-end"
            : "bg-[var(--earth-sand)]/60 border-[var(--earth-sand)] justify-start"
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
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: "var(--earth-cream)" }}
    >
      {/* BACKGROUND BLURS */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[var(--earth-sand)] blur-[160px] -top-56 -left-56 opacity-30" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[var(--earth-paper)] blur-[180px] top-40 right-0 opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center text-4xl font-bold text-[var(--earth-brown)]"
        >
          خطط بسيطة وواضحة
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center text-[var(--earth-brown)]/70 mt-4 text-xl"
        >
          اختر ما يناسبك بدون أي تعقيد.
        </motion.p>

        {/* BILLING TOGGLE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex justify-center mt-10"
        >
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-[var(--earth-brown)]/50">
            <Label
              className={
                !yearly ? "text-[var(--earth-brown)]" : "text-[var(--earth-brown)]/40"
              }
            >
              شهري
            </Label>

            <EarthToggle checked={yearly} onChange={setYearly} />

            <Label
              className={
                yearly ? "text-[var(--earth-brown)]" : "text-[var(--earth-brown)]/40"
              }
            >
              سنوي
            </Label>
          </div>
        </motion.div>

        {/* PRICING CARDS */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`
                relative rounded-3xl p-10
                bg-white/70 backdrop-blur-xl
                border border-[var(--earth-sand)]/40
                shadow-[0_20px_40px_rgba(0,0,0,0.06)]
                transition-all duration-300

                ${
                  plan.highlight
                    ? "scale-[1.06] shadow-[0_25px_60px_rgba(0,0,0,0.18)] border-[var(--earth-brown)]"
                    : "hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                }
              `}
            >
              {/* TITLE */}
              <h3 className="text-2xl font-bold text-[var(--earth-brown)]">
                {plan.name}
              </h3>
              <p className="text-[var(--earth-brown)]/60 mt-2">{plan.tagline}</p>

              {/* PRICE */}
              <div className="border-t border-[var(--earth-sand)]/50 pt-8 mt-8">
                {plan.priceMonthly === "مجاني" ? (
                  <div className="text-5xl font-extrabold text-[var(--earth-brown)]">
                    مجاني
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-5xl font-extrabold text-[var(--earth-brown)]">
                        {yearly ? plan.priceYearly : plan.priceMonthly}
                      </span>
                      <span className="text-lg text-[var(--earth-brown)]/60">$</span>
                    </div>
                    <span className="block text-right text-[var(--earth-brown)]/50 mt-1">
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
                    className="flex gap-3 text-[var(--earth-brown)]/75 items-center"
                  >
                    <Check className="h-5 w-5 text-[var(--earth-brown)]" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA BUTTON */}
              <button
                className="
                  w-full mt-10 py-3 rounded-2xl 
                  font-bold text-lg
                  bg-[var(--earth-brown)] text-white 
                  shadow-[0_4px_14px_rgba(0,0,0,0.12)]
                  hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)]
                  hover:bg-[#5a3f2d]
                  transition-all duration-300
                "
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
