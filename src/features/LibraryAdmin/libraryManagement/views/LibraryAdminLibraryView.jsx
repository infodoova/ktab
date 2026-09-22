import React from "react";
import {
  BookOpen,
  Users,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Edit3,
  CheckCircle,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Search,
  X,
  UserCheck,
} from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { Input } from "@/components/myui/forms/Input";
import { Textarea } from "@/components/myui/forms/Textarea";
import { useOrganizationProfile } from "../hooks/useOrganizationProfile";
import "./LibraryAdminLibraryView.css";

/**
 * Library Administrator Organization Profile and Management View.
 * Displays organization metrics, branch information, and administrative credentials.
 * Implements editorial Apple & Eleven Reader standards with reactive topbar search.
 */
export default function LibraryAdminLibraryView() {
  const {
    organization,
    loading,
    isEditing,
    setIsEditing,
    formData,
    errors,
    saving,
    searchQuery,
    setSearchQuery,
    isSearchMatch,
    handleChange,
    handleAdminChange,
    handleCancel,
    handleSave,
  } = useOrganizationProfile();

  const headerActions = !isEditing ? (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="ktab-topbar__btn-action"
      title="تعديل بيانات المكتبة"
    >
      <Edit3 size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">تعديل البيانات</span>
    </button>
  ) : null;

  return (
    <AppLayout
      pageName="إدارة المكتبة"
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في بيانات وتفاصيل المكتبة..."
      headerActions={headerActions}
    >
      <div className="ktab-org-view" dir="rtl">
        {loading ? (
          <div className="ktab-org-skeleton-wrap">
            <div className="ktab-org-skeleton-stats">
              <div className="ktab-org-skeleton-box" />
              <div className="ktab-org-skeleton-box" />
              <div className="ktab-org-skeleton-box" />
            </div>
            <div className="ktab-org-skeleton-hero" />
            <div className="ktab-org-skeleton-card" />
          </div>
        ) : !organization && !isEditing ? (
          <div className="ktab-org-empty">
            <div className="ktab-org-empty-icon">
              <Building2 size={32} strokeWidth={1.8} />
            </div>
            <h3 className="ktab-org-empty-title">لم يتم العثور على بيانات المكتبة</h3>
            <p className="ktab-org-empty-desc">
              تعذر جلب ملف المؤسسة الحالي من الخادم. يرجى التحقق من اتصالك وإعادة المحاولة.
            </p>
          </div>
        ) : isEditing ? (
          /* ── EDIT MODE FORM ─────────────────────────────────────────────── */
          <form onSubmit={handleSave} className="ktab-org-edit-form" noValidate>
            <div className="ktab-org-edit-header">
              <div>
                <h2 className="ktab-org-edit-title">تحديث بيانات المكتبة</h2>
                <p className="ktab-org-edit-subtitle">
                  قم بتعديل بيانات المؤسسة ومعلومات الاتصال وحساب المشرف المسؤول
                </p>
              </div>
            </div>

            {/* Library Details Card */}
            <div className="ktab-org-card">
              <div className="ktab-org-card-header">
                <div className="ktab-org-card-icon-wrap">
                  <Building2 size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="ktab-org-card-title">معلومات المكتبة الأساسية</h3>
                  <p className="ktab-org-card-subtitle">الاسم، النطاق الجغرافي، ومعلومات التواصل</p>
                </div>
              </div>

              <div className="ktab-org-form-grid">
                <Input
                  label="اسم المكتبة"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  showCount={false}
                  required
                />

                <Input
                  label="المدينة"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  showCount={false}
                  required
                />

                <Input
                  label="الدولة"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  error={errors.country}
                  showCount={false}
                  required
                />

                <Input
                  label="العنوان التفصيلي"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  showCount={false}
                />

                <Input
                  label="البريد الإلكتروني للمكتبة"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  dir="ltr"
                  showCount={false}
                />

                <Input
                  label="رقم الهاتف"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  dir="ltr"
                  showCount={false}
                />

                <Input
                  label="الموقع الإلكتروني"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  dir="ltr"
                  showCount={false}
                />
              </div>

              <div className="ktab-org-form-full">
                <Textarea
                  label="نبذة عن المكتبة"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="اكتب نبذة تعريفية مختصرة عن أهداف وخدمات وتاريخ المكتبة..."
                  rows={4}
                  showCount={false}
                />
              </div>
            </div>

            {/* Admin Credentials Card */}
            <div className="ktab-org-card">
              <div className="ktab-org-card-header">
                <div className="ktab-org-card-icon-wrap">
                  <ShieldCheck size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="ktab-org-card-title">بيانات وحساب مشرف المكتبة المسؤول</h3>
                  <p className="ktab-org-card-subtitle">بيانات الاعتماد والدخول إلى لوحة إدارة المكتبة</p>
                </div>
              </div>

              <div className="ktab-org-form-grid">
                <Input
                  label="الاسم الأول للمشرف"
                  value={formData.admin.firstName}
                  onChange={(e) => handleAdminChange("firstName", e.target.value)}
                  showCount={false}
                />

                <Input
                  label="اسم الأب / الأوسط"
                  value={formData.admin.middleName}
                  onChange={(e) => handleAdminChange("middleName", e.target.value)}
                  showCount={false}
                />

                <Input
                  label="اسم العائلة"
                  value={formData.admin.lastName}
                  onChange={(e) => handleAdminChange("lastName", e.target.value)}
                  showCount={false}
                />

                <Input
                  label="البريد الإلكتروني للمشرف"
                  type="email"
                  value={formData.admin.email}
                  onChange={(e) => handleAdminChange("email", e.target.value)}
                  error={errors.admin_email}
                  dir="ltr"
                  showCount={false}
                />

                <Input
                  label="كلمة مرور جديدة للمشرف (اختياري)"
                  type="password"
                  value={formData.admin.password}
                  onChange={(e) => handleAdminChange("password", e.target.value)}
                  placeholder="اتركها فارغة للإبقاء على الحالية"
                  error={errors.admin_password}
                  dir="ltr"
                  showCount={false}
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="ktab-org-submit-bar">
              <Button
                variant="secondary"
                type="button"
                onClick={handleCancel}
                disabled={saving}
              >
                إلغاء
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={saving}
                icon={<CheckCircle size={17} />}
              >
                حفظ التحديثات
              </Button>
            </div>
          </form>
        ) : !isSearchMatch ? (
          /* ── NO SEARCH MATCH STATE ─────────────────────────────────────── */
          <div className="ktab-org-search-empty">
            <div className="ktab-org-search-empty-icon">
              <Search size={30} strokeWidth={1.8} />
            </div>
            <h3 className="ktab-org-search-empty-title">
              لم يتم العثور على نتائج مطابقة لـ «{searchQuery}»
            </h3>
            <p className="ktab-org-search-empty-desc">
              تأكد من كتابة اسم المكتبة، المدينة، أو البريد الإلكتروني بشكل صحيح.
            </p>
            <Button
              variant="secondary"
              icon={<X size={15} />}
              onClick={() => setSearchQuery("")}
            >
              مسح البحث
            </Button>
          </div>
        ) : (
          /* ── VIEW MODE ──────────────────────────────────────────────────── */
          <div className="ktab-org-content">
            {/* Top Summary Stats Cards (Matching Author & Reader Metric Standard) */}
            <section className="ktab-stats-grid" dir="rtl" aria-label="ملخص إحصائيات المكتبة">
              {/* Card 1: Books */}
              <article className="ktab-stat-card">
                <div className="ktab-stat-card__header">
                  <span className="ktab-stat-card__title">إجمالي الكتب المفهرسة</span>
                  <div className="ktab-stat-card__icon-badge">
                    <BookOpen size={16} strokeWidth={2.2} />
                  </div>
                </div>
                <div className="ktab-stat-card__body">
                  <div className="ktab-stat-card__value">{organization.totalBooks ?? 0}</div>
                </div>
                <div className="ktab-stat-card__footer">
                  <span className="ktab-stat-card__sublabel">كتاب مفهرس في المكتبة</span>
                </div>
              </article>

              {/* Card 2: Staff */}
              <article className="ktab-stat-card">
                <div className="ktab-stat-card__header">
                  <span className="ktab-stat-card__title">أعضاء فريق العمل</span>
                  <div className="ktab-stat-card__icon-badge">
                    <Users size={16} strokeWidth={2.2} />
                  </div>
                </div>
                <div className="ktab-stat-card__body">
                  <div className="ktab-stat-card__value">{organization.totalStaff ?? 0}</div>
                </div>
                <div className="ktab-stat-card__footer">
                  <span className="ktab-stat-card__sublabel">أعضاء الطاقم الإداري المسجلين</span>
                </div>
              </article>

              {/* Card 3: Status */}
              <article className="ktab-stat-card">
                <div className="ktab-stat-card__header">
                  <span className="ktab-stat-card__title">حالة المؤسسة</span>
                  <div className="ktab-stat-card__icon-badge">
                    <ShieldCheck size={16} strokeWidth={2.2} />
                  </div>
                </div>
                <div className="ktab-stat-card__body">
                  <div className="ktab-stat-card__value ktab-stat-card__value--status">
                    {organization.status === "0" ? "غير نشطة" : "نشطة ومعتمدة"}
                  </div>
                </div>
                <div className="ktab-stat-card__footer">
                  <span className="ktab-stat-card__sublabel">الاعتماد التشغيلي للمكتبة</span>
                </div>
              </article>
            </section>

            {/* Organization Main Hero Card */}
            <div className="ktab-org-card ktab-org-card--hero">
              <div className="ktab-org-hero-top">
                <div className="ktab-org-avatar">
                  <Building2 size={36} strokeWidth={1.8} />
                </div>

                <div className="ktab-org-hero-content">
                  <div className="ktab-org-hero-title-row">
                    <h2 className="ktab-org-name">{organization.name}</h2>
                  </div>

                  <div className="ktab-org-meta-row">
                    <span className="ktab-org-meta-item">
                      <MapPin size={14} strokeWidth={1.8} />
                      <span>
                        {organization.city}
                        {organization.country ? `، ${organization.country}` : ""}
                      </span>
                    </span>

                    {organization.slug && (
                      <span className="ktab-org-meta-item ktab-org-meta-item--mono" dir="ltr">
                        @{organization.slug}
                      </span>
                    )}

                    {organization.createdAt && (
                      <span className="ktab-org-meta-item">
                        <Calendar size={14} strokeWidth={1.8} />
                        <span>
                          انضمت في{" "}
                          {new Date(organization.createdAt).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* About Narrative */}
              {organization.description && (
                <div className="ktab-org-narrative-wrap">
                  <h4 className="ktab-org-narrative-title">نبذة تعريفية</h4>
                  <p className="ktab-org-narrative-text">{organization.description}</p>
                </div>
              )}

              {/* Structured Specifications & Contact Bento */}
              <div className="ktab-org-bento-grid">
                {/* Email Tile (Plain copyable text - No clickable link) */}
                <div className="ktab-org-bento-tile">
                  <div className="ktab-org-bento-icon">
                    <Mail size={16} strokeWidth={2} />
                  </div>
                  <div className="ktab-org-bento-body">
                    <span className="ktab-org-bento-label">البريد الإلكتروني</span>
                    <span className="ktab-org-bento-val" dir="ltr">
                      {organization.email || "—"}
                    </span>
                  </div>
                </div>

                {/* Phone Tile */}
                <div className="ktab-org-bento-tile">
                  <div className="ktab-org-bento-icon">
                    <Phone size={16} strokeWidth={2} />
                  </div>
                  <div className="ktab-org-bento-body">
                    <span className="ktab-org-bento-label">رقم الهاتف</span>
                    <span className="ktab-org-bento-val" dir="ltr">
                      {organization.phone || "—"}
                    </span>
                  </div>
                </div>

                {/* Website Tile */}
                <div className="ktab-org-bento-tile">
                  <div className="ktab-org-bento-icon">
                    <Globe size={16} strokeWidth={2} />
                  </div>
                  <div className="ktab-org-bento-body">
                    <span className="ktab-org-bento-label">الموقع الإلكتروني</span>
                    {organization.website ? (
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noreferrer"
                        className="ktab-org-bento-link ktab-org-bento-link--external"
                        dir="ltr"
                      >
                        <span>{organization.website}</span>
                        <ExternalLink size={13} strokeWidth={2} />
                      </a>
                    ) : (
                      <span className="ktab-org-bento-empty">—</span>
                    )}
                  </div>
                </div>

                {/* Address Tile */}
                <div className="ktab-org-bento-tile">
                  <div className="ktab-org-bento-icon">
                    <MapPin size={16} strokeWidth={2} />
                  </div>
                  <div className="ktab-org-bento-body">
                    <span className="ktab-org-bento-label">المقر والعنوان</span>
                    <span className="ktab-org-bento-val">
                      {organization.address ||
                        `${organization.city}${organization.country ? `، ${organization.country}` : ""}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Administrator Section (Clean, Badge-free, Plain Email) */}
            {organization.admin && (
              <div className="ktab-org-admin-card">
                <div className="ktab-org-admin-main">
                  <div className="ktab-org-admin-avatar">
                    <UserCheck size={22} strokeWidth={2} />
                  </div>
                  <div className="ktab-org-admin-info">
                    <span className="ktab-org-admin-label">مشرف المكتبة المسؤول</span>
                    <h3 className="ktab-org-admin-name">
                      {organization.admin.fullName ||
                        `${organization.admin.firstName || ""} ${organization.admin.lastName || ""}`.trim() ||
                        "مشرف المكتبة"}
                    </h3>
                  </div>
                </div>

                {organization.admin.email && (
                  <div className="ktab-org-admin-email-wrap">
                    <Mail size={14} strokeWidth={2} />
                    <span dir="ltr">{organization.admin.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
