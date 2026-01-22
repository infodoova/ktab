/* eslint-disable no-unused-vars */
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";
import { motion } from "framer-motion";

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="
        text-sm
        text-[var(--secondary-text)]/70
        hover:text-[var(--secondary-text)]
        transition-all duration-300
        hover:translate-x-1
      "
    >
      {children}
    </a>
  </li>
);

const SocialLink = ({ href, icon, label }) => (
  <motion.a
    whileHover={{ scale: 1.12 }}
    transition={{ type: "spring", stiffness: 200 }}
    href={href}
    aria-label={label}
    className="text-white/60 hover:text-[var(--primary-button)] transition-colors duration-300"
  >
    {icon}
  </motion.a>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      dir="rtl"
      className="relative pt-28 pb-12 overflow-hidden bg-[var(--bg-dark)]"
    >
      {/* SOFT BACKGROUND BLOBS */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        className="
          absolute top-[-140px] right-[-140px]
          w-[500px] h-[500px]
          rounded-full
          bg-[var(--primary-button)]/10
          blur-[140px]
        "
      />

      <motion.div
        animate={{ y: [0, 25, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "reverse" }}
        className="
          absolute bottom-[-180px] left-[-180px]
          w-[600px] h-[600px]
          rounded-full
          bg-white/10
          blur-[160px]
        "
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* TOP GRID */}
        <div className="grid md:grid-cols-3 gap-16">
          {/* BRAND */}
          <div className="space-y-6">
            <div className="text-[2.3rem] font-black text-[var(--secondary-text)]">
              كتاب
            </div>

            <p className="text-[var(--secondary-text)]/70 leading-relaxed max-w-xs text-sm">
              منصّة قراءة عربية تجمع القرّاء، الأطفال، المعلّمين، والأهالي في
              مكان واحد. نصنع تجربة قراءة ممتعة، آمنة، وتفاعلية.
            </p>

            <div className="flex gap-4 mt-4">
              <SocialLink
                href="#"
                icon={<Instagram className="h-5 w-5" />}
                label="Instagram"
              />
              <SocialLink
                href="#"
                icon={<Facebook className="h-5 w-5" />}
                label="Facebook"
              />
              <SocialLink
                href="#"
                icon={<Youtube className="h-5 w-5" />}
                label="Youtube"
              />
              <SocialLink
                href="mailto:hello@kuttab.com"
                icon={<Mail className="h-5 w-5" />}
                label="Mail"
              />
            </div>
          </div>

          {/* LINKS 1 */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-[var(--secondary-text)]">
                المنصّة
              </h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="#">كيف يعمل كتّاب؟</FooterLink>
                <FooterLink href="#">التجربة التفاعلية</FooterLink>
                <FooterLink href="#">المكتبة العربية</FooterLink>
                <FooterLink href="#">المدونة</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--secondary-text)]">
                لمن؟
              </h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="#">للأهل</FooterLink>
                <FooterLink href="#">للمعلّمين</FooterLink>
                <FooterLink href="#">للمدارس</FooterLink>
                <FooterLink href="#">للكتّاب والرسامين</FooterLink>
              </ul>
            </div>
          </div>

          {/* LINKS 2 */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-[var(--secondary-text)]">
                الدعم
              </h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="#">الأسئلة الشائعة</FooterLink>
                <FooterLink href="#">مركز المساعدة</FooterLink>
                <FooterLink href="#">تواصل معنا</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--secondary-text)]">
                قانوني
              </h3>
              <ul className="mt-4 space-y-2">
                <FooterLink href="#">الشروط والأحكام</FooterLink>
                <FooterLink href="#">سياسة الخصوصية</FooterLink>
                <FooterLink href="#">ملفات الارتباط (Cookies)</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-20 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-[var(--secondary-text)]/40">
            © {year} كُتّاب — جميع الحقوق محفوظة.
          </p>

          <p className="text-sm text-[var(--secondary-text)]/40 flex items-center gap-2">
            صُنع بحُب في الوطن العربي <span className="text-red-500/80 animate-pulse">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
