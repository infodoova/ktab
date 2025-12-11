/* eslint-disable */
import { motion } from "framer-motion";
import imgAI from "../../../assets/images/ai.png";
import imgListen from "../../../assets/images/listen.png";
import imgInteractive from "../../../assets/images/interactive.png";
import imgProgress from "../../../assets/images/progress.png";

const FEATURES = [
  {
    id: "ai",
    title: "مساعد ذكي لتبسيط المعرفة",
    desc: "القارئ لم يعد مضطرًا للبحث خارج الكتاب عن تفسير أو شرح أو تلخيص. مساعد كُتّاب الذكي يتفاعل معك داخل التجربة نفسها—يفهم الفقرة التي تقرأها، يبسّط المعاني الصعبة، يقدّم أمثلة توضيحية، ويولّد أسئلة اختبار لفهمك. ليس مجرد روبوت؛ بل مدرس خاص يعمل بالذكاء الاصطناعي، حاضر معك في كل صفحة، يصنع لك تجربة تعلم سلسة، شخصية، وسريعة.",
    image: imgAI,
  },
  {
    id: "interactive",
    title: "مسارات قصصية تفاعلية",
    desc: "القراءة هنا ليست مجرد تقليب صفحات… بل مغامرة تتغيّر وفق قراراتك. اختر مسارك، واجه المواقف، واتخذ الخيارات التي تغيّر النهاية كليًا. كل قصة تحتوي على نقاط تفرّع تجعل كل إعادة قراءة مختلفة عن السابقة، مما يخلق تجربة غامرة تشبه اللعب، ويحوّل القارئ من متلقٍ سلبي إلى مشارك أساسي في بناء الأحداث.",
    image: imgInteractive,
  },
  {
    id: "audio",
    title: "استماع غامر أثناء التنقل",
    desc: "لا حاجة للتوقّف عن القراءة بسبب الانشغال. اضغط زرًا واحدًا، وسيتحوّل أي كتاب إلى تجربة صوتية طبيعية بفضل محرّك القراءة البشرية. يمكنك متابعة رحلتك المعرفية في السيارة، في النادي، أو أثناء ترتيب المنزل—بجودة صوت نقية ووتيرة تراعي راحتك. صُمّم هذا الأسلوب ليجعل المعرفة مرافقة لك طوال اليوم دون أي مجهود بصري.",
    image: imgListen,
  },
  {
    id: "progress",
    title: "لوحة إنجازات متطورة",
    desc: "لكل قارئ رحلة، ولكل رحلة إنجازات. كُتّاب يقدم لوحة متابعة ذكية تعرض تقدّمك بأسلوب بصري جميل—الصفحات التي قرأتها، الساعات التي قضيتها، الكتب التي أنهيتها، والمستويات التي حققتها. تتلقى شارات تحفيزية، تحديات أسبوعية، وتنبيهات ذكية تساعدك على بناء عادة قراءة مستمرة. هنا، لا تحفظ المعلومات فقط… بل ترى أثرها ينبض أمامك.",
    image: imgProgress,
  },
];

export default function WhatAbout() {
  return (
    <section className="py-24 bg-white relative" dir="rtl" id="what-about">
      {/* thin vertical timeline */}
      <div
        className="hidden md:block absolute top-32 bottom-32 left-1/2 w-[2px] bg-gradient-to-b
          from-transparent via-[var(--earth-olive)]/40 to-transparent"
      />

      {/* HEADER */}
      <div className="text-center mb-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-black text-[var(--earth-brown-dark)]"
        >
          كيف تبدو التجربة؟
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto mt-4 text-lg md:text-2xl text-[var(--earth-brown)]/80"
        >
          نسرد لك رحلة القارئ مع كل ميزة بشكلٍ قصصي تصاعدي.
        </motion.p>
      </div>

      {/* TIMELINE LIST */}
      <div className="max-w-6xl mx-auto space-y-28 px-6">
        {FEATURES.map((f, i) => {
          const right = i % 2 === 0;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative md:flex md:items-center gap-12"
            >
              {/* connector dot */}
              <div
                className="absolute hidden md:block left-1/2 -translate-x-1/2 
                              w-8 h-8 rounded-full bg-[var(--earth-paper)]
                              border-[3px] border-[var(--earth-olive)] shadow-md"
              />

              {/* image bubble */}
              <div
                className={`
                mx-auto md:mx-0 w-40 h-40 md:w-56 md:h-56
                rounded-full overflow-hidden shadow-xl border-4
                bg-white flex-shrink-0 z-10
                ${right ? "md:order-2" : ""}
              `}
              >
                <img
                  src={f.image}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* text bubble */}
              <div
                className={`
                bg-[var(--earth-paper)]/95 border border-[var(--earth-sand)]/60
                rounded-3xl shadow-sm p-6 md:p-10 text-center md:text-right
                max-w-xl mx-auto md:mx-0 md:my-0 backdrop-blur-sm
                ${right ? "md:mr-auto" : "md:ml-auto"}
              `}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--earth-brown-dark)] mb-3">
                  {f.title}
                </h3>
                <p className="text-[var(--earth-brown)]/85 text-lg leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
