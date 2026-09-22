import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, UserPlus, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { Input } from "@/components/myui/forms/Input";
import { Textarea } from "@/components/myui/forms/Textarea";
import { useLibraryForm } from "../hooks/useLibraryForm";
import "./AdminLibraryCreateView.css";

/**
 * Dedicated Page to register a new Library Organization and assign its Admin.
 * Pure declarative JSX; all state & submission handled in useLibraryForm.
 * Utilizes topbar breadcrumb (< ChevronLeft / > library) for clean navigation back.
 */
export default function AdminLibraryCreateView() {
  const navigate = useNavigate();
  const location = useLocation();

  const libraryToEdit = location.state?.library || null;
  const isEditing = Boolean(libraryToEdit);

  // Dynamic breadcrumb pointing back to library management
  const breadcrumb = location.state?.from || {
    parentLabel: "إدارة المكتبات",
    parentPath: "/admin/library",
  };

  const pageTitle = isEditing ? "تعديل بيانات المكتبة" : "إضافة مكتبة جديدة";

  const {
    formData,
    errors,
    submitting,
    handleFieldChange,
    handleAdminFieldChange,
    handleSubmit,
  } = useLibraryForm({
    initialData: libraryToEdit,
    onSuccess: () => {
      navigate("/admin/library");
    },
  });

  return (
    <AppLayout
      pageName={pageTitle}
      breadcrumb={breadcrumb}
      showSearch={false}
    >
      <div className="ktab-admin-create-view" dir="rtl">
        {/* Header */}
        <div className="ktab-admin-create-header">
          <div>
            <h1 className="ktab-admin-create-title">
              {isEditing ? `تعديل مكتبة: ${libraryToEdit.name}` : "تسجيل مكتبة جديدة"}
            </h1>
            <p className="ktab-admin-create-desc">
              {isEditing
                ? "تعديل بيانات المكتبة وحساب المشرف المسؤول"
                : "أدخل بيانات المكتبة وأنشئ حساب المشرف المسؤول عنها (Library Admin)"}
            </p>
          </div>
        </div>

        {/* Create Form */}
        <form onSubmit={handleSubmit} className="ktab-admin-create-form">
          {/* Section 1: Library Details */}
          <section className="ktab-admin-form-section">
            <div className="ktab-admin-form-section__header">
              <div className="ktab-admin-form-section__icon">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="ktab-admin-form-section__title">1. بيانات المكتبة</h2>
                <p className="ktab-admin-form-section__desc">المعلومات الأساسية وموقع المكتبة</p>
              </div>
            </div>

            <div className="ktab-admin-form-fields">
              <Input
                label="اسم المكتبة"
                placeholder="مثال: مكتبة الملك فهد الوطنية"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                error={errors.name}
                required
              />

              <Textarea
                label="نبذة عن المكتبة"
                placeholder="اكتب وصفاً موجزاً عن نشاط المكتبة وخدماتها..."
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                rows={3}
              />

              <div className="ktab-admin-form-grid-2">
                <Input
                  label="المدينة"
                  placeholder="مثال: الرياض"
                  value={formData.city}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  error={errors.city}
                  required
                />
                <Input
                  label="الدولة"
                  placeholder="مثال: المملكة العربية السعودية"
                  value={formData.country}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                  error={errors.country}
                  required
                />
              </div>

              <div className="ktab-admin-form-grid-2">
                <Input
                  label="العنوان التفصيلي"
                  placeholder="الشارع، الحي..."
                  value={formData.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                />
                <Input
                  label="الموقع الإلكتروني"
                  placeholder="https://example-library.com"
                  value={formData.website}
                  onChange={(e) => handleFieldChange("website", e.target.value)}
                />
              </div>

              <div className="ktab-admin-form-grid-2">
                <Input
                  label="البريد الإلكتروني الرسمي للمكتبة"
                  type="email"
                  placeholder="info@library.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
                <Input
                  label="رقم هاتف التواصل"
                  placeholder="+966 50 000 0000"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Library Admin User */}
          <section className="ktab-admin-form-section">
            <div className="ktab-admin-form-section__header">
              <div className="ktab-admin-form-section__icon">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="ktab-admin-form-section__title">2. إنشاء حساب المشرف المسؤول (Library Admin)</h2>
                <p className="ktab-admin-form-section__desc">
                  حساب المشرف الذي سيمتلك صلاحية إدارة هذه المكتبة وطاقمها ومحتواها
                </p>
              </div>
            </div>

            <div className="ktab-admin-form-fields">
              <div className="ktab-admin-form-grid-3">
                <Input
                  label="الاسم الأول"
                  placeholder="مثال: علي"
                  value={formData.admin.firstName}
                  onChange={(e) => handleAdminFieldChange("firstName", e.target.value)}
                  error={errors.admin_firstName}
                  required
                />
                <Input
                  label="اسم الأب (اختياري)"
                  placeholder="مثال: عبد الله"
                  value={formData.admin.middleName}
                  onChange={(e) => handleAdminFieldChange("middleName", e.target.value)}
                />
                <Input
                  label="اسم العائلة"
                  placeholder="مثال: الهاشمي"
                  value={formData.admin.lastName}
                  onChange={(e) => handleAdminFieldChange("lastName", e.target.value)}
                  error={errors.admin_lastName}
                  required
                />
              </div>

              <div className="ktab-admin-form-grid-2">
                <Input
                  label="البريد الإلكتروني للمسؤول"
                  type="email"
                  placeholder="admin@library.com"
                  value={formData.admin.email}
                  onChange={(e) => handleAdminFieldChange("email", e.target.value)}
                  error={errors.admin_email}
                  required
                />
                <Input
                  label={isEditing ? "كلمة مرور جديدة للمشرف (اختياري)" : "كلمة مرور المشرف"}
                  type="password"
                  placeholder={
                    isEditing
                      ? "اتركها فارغة إذا كنت لا ترغب في التغيير"
                      : "8 أحرف تشمل حروفاً كبيرة وصغيرة ورقماً ورمزاً"
                  }
                  value={formData.admin.password}
                  onChange={(e) => handleAdminFieldChange("password", e.target.value)}
                  error={errors.admin_password}
                  required={!isEditing}
                />
              </div>
            </div>
          </section>

          {/* Action Bar */}
          <div className="ktab-admin-form-submit-bar">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/library")}
              disabled={submitting}
              type="button"
            >
              إلغاء التراجع
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={submitting}
              icon={<CheckCircle size={17} />}
            >
              {isEditing ? "حفظ وتحديث بيانات المكتبة" : "تسجيل وإنشاء المكتبة الآن"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
