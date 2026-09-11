import React from "react";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";
import { motion } from "framer-motion";
import "./Footer.css";

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="ktab-footer__link">
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
    className="ktab-footer__social-btn"
  >
    {icon}
  </motion.a>
);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer dir="rtl" className="ktab-footer">
      {/* SOFT BACKGROUND BLOBS */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        className="ktab-footer__blob-1"
      />

      <motion.div
        animate={{ y: [0, 25, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "reverse" }}
        className="ktab-footer__blob-2"
      />

      <div className="ktab-footer__container">
        {/* TOP GRID */}
        <div className="ktab-footer__grid">
          {/* BRAND */}
          <div className="ktab-footer__brand">
            <div className="ktab-footer__brand-title">كتاب</div>

            <p className="ktab-footer__brand-desc">
              منصّة قراءة عربية تجمع القرّاء، الأطفال، المعلّمين، والأهالي في مكان واحد. نصنع تجربة قراءة ممتعة، آمنة، وتفاعلية.
            </p>

            <div className="ktab-footer__socials">
              <SocialLink href="#" icon={<Instagram size={20} />} label="Instagram" />
              <SocialLink href="#" icon={<Facebook size={20} />} label="Facebook" />
              <SocialLink href="#" icon={<Youtube size={20} />} label="Youtube" />
              <SocialLink href="mailto:hello@kuttab.com" icon={<Mail size={20} />} label="Mail" />
            </div>
          </div>

          {/* LINKS GROUP 1 */}
          <div className="ktab-footer__columns-group">
            <div>
              <h3 className="ktab-footer__col-title">المنصّة</h3>
              <ul className="ktab-footer__links-list">
                <FooterLink href="#">كيف يعمل كتّاب؟</FooterLink>
                <FooterLink href="#">التجربة التفاعلية</FooterLink>
                <FooterLink href="#">المكتبة العربية</FooterLink>
                <FooterLink href="#">المدونة</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="ktab-footer__col-title">لمن؟</h3>
              <ul className="ktab-footer__links-list">
                <FooterLink href="#">للأهل</FooterLink>
                <FooterLink href="#">للمعلّمين</FooterLink>
                <FooterLink href="#">للمدارس</FooterLink>
                <FooterLink href="#">للكتّاب والرسامين</FooterLink>
              </ul>
            </div>
          </div>

          {/* LINKS GROUP 2 */}
          <div className="ktab-footer__columns-group">
            <div>
              <h3 className="ktab-footer__col-title">الدعم</h3>
              <ul className="ktab-footer__links-list">
                <FooterLink href="#">الأسئلة الشائعة</FooterLink>
                <FooterLink href="#">مركز المساعدة</FooterLink>
                <FooterLink href="#">تواصل معنا</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="ktab-footer__col-title">قانوني</h3>
              <ul className="ktab-footer__links-list">
                <FooterLink href="#">الشروط والأحكام</FooterLink>
                <FooterLink href="#">سياسة الخصوصية</FooterLink>
                <FooterLink href="#">ملفات الارتباط (Cookies)</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="ktab-footer__bottom">
          <p className="ktab-footer__bottom-text">
            © {year} كُتّاب — جميع الحقوق محفوظة.
          </p>

          <p className="ktab-footer__bottom-love">
            صُنع بحُب في الوطن العربي <span className="ktab-footer__heart">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
