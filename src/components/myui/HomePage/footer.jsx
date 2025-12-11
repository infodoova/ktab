/* eslint-disable no-unused-vars */
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";
import { motion } from "framer-motion";

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-sm text-[var(--earth-brown)]/70 hover:text-[var(--earth-brown)] transition-all duration-300 hover:translate-x-1"
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
    className="text-[var(--earth-brown)]/70 hover:text-[var(--earth-brown)]"
  >
    {icon}
  </motion.a>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      dir="rtl"
      className="
        relative pt-24 pb-12 
     
        overflow-hidden
      "
            style={{ backgroundColor: "var(--earth-cream)" }}

    >
      {/* FLOATING BACKGROUND BLOBS */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="
          absolute top-[-120px] right-[-120px]
          w-[420px] h-[420px]
          rounded-full bg-[var(--earth-sand)] blur-[120px] opacity-30
        "
      />

      <motion.div
        animate={{ y: [0, 25, 0], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        className="
          absolute bottom-[-160px] left-[-160px]
          w-[480px] h-[480px]
          rounded-full bg-[var(--earth-paper)] blur-[150px] opacity-40
        "
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* TOP GRID */}
        <div className="grid md:grid-cols-3 gap-16">

          {/* Branding Section */}
          <div className="space-y-6">
            <div className="text-[2.3rem] font-bold text-[var(--earth-brown)]">
              كتاب
            </div>

            <p className="text-[var(--earth-brown)]/70 leading-relaxed max-w-xs text-sm">
              منصّة قراءة عربية تجمع القرّاء، الأطفال، المعلّمين، والأهالي في مكان واحد.
              نصنع تجربة قراءة ممتعة، آمنة، وتفاعلية.
            </p>

            <div className="flex gap-4 mt-4">
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} label="Instagram" />
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} label="Facebook" />
              <SocialLink href="#" icon={<Youtube className="h-5 w-5" />} label="Youtube" />
              <SocialLink href="mailto:hello@kuttab.com" icon={<Mail className="h-5 w-5" />} label="Mail" />
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-[var(--earth-brown)]">المنصّة</h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="#">كيف يعمل كتّاب؟</FooterLink>
                <FooterLink href="#">التجربة التفاعلية</FooterLink>
                <FooterLink href="#">المكتبة العربية</FooterLink>
                <FooterLink href="#">المدونة</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--earth-brown)]">لمن؟</h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="#">للأهل</FooterLink>
                <FooterLink href="#">للمعلّمين</FooterLink>
                <FooterLink href="#">للمدارس</FooterLink>
                <FooterLink href="#">للكتّاب والرسامين</FooterLink>
              </ul>
            </div>
          </div>

          {/* Links Column 2 */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-[var(--earth-brown)]">الدعم</h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="#">الأسئلة الشائعة</FooterLink>
                <FooterLink href="#">مركز المساعدة</FooterLink>
                <FooterLink href="#">تواصل معنا</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--earth-brown)]">قانوني</h3>
              <ul className="mt-4 space-y-2">
                <FooterLink href="#">الشروط والأحكام</FooterLink>
                <FooterLink href="#">سياسة الخصوصية</FooterLink>
                <FooterLink href="#">ملفات الارتباط (Cookies)</FooterLink>
              </ul>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 border-t border-[var(--earth-sand)]/40 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--earth-brown)]/60">
            © {year} كتاب — جميع الحقوق محفوظة.
          </p>

          <p className="text-xs text-[var(--earth-brown)]/60">
            صُنع بحُب في الوطن العربي ❤️
          </p>
        </div>

      </div>
    </footer>
  );
}
