import React from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { Input } from "@/components/myui/forms/Input";
import { usePublisherForm } from "../hooks/usePublisherForm";
import "./AdminPublisherCreateView.css";

/**
 * Dedicated Page to provision or update a Publisher user account.
 * Pure declarative JSX; all state & submission handled in usePublisherForm.
 */
export default function AdminPublisherCreateView() {
  const location = useLocation();

  const {
    isEditing,
    publisherToEdit,
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    navigate,
  } = usePublisherForm();

  const breadcrumb = location.state?.from || {
    parentLabel: "إدارة الناشرين",
    parentPath: "/admin/publishers",
  };

  const pageTitle = isEditing ? "تعديل حساب الناشر" : "إضافة ناشر جديد";

  return (
    <AppLayout
      pageName={pageTitle}
      breadcrumb={breadcrumb}
      showSearch={false}
    >
      <div className="ktab-admin-pub-create-view" dir="rtl">
        {/* Header */}
        <div className="ktab-admin-pub-create-header">
          <div>
            <h1 className="ktab-admin-pub-create-title">
              {isEditing
                ? `تعديل حساب: ${publisherToEdit?.fullName || publisherToEdit?.email}`
                : "تسجيل وتعيين حساب ناشر"}
            </h1>
            <p className="ktab-admin-pub-create-desc">
              {isEditing
                ? "تحديث بيانات الناشر ومعلومات تسجيل الدخول الخاصة بالحساب"
                : "أدخل بيانات الناشر ومعلومات الحساب للوصول إلى لوحة ناشري الكتب"}
            </p>
          </div>
        </div>

        {/* Simple Unified Form Container */}
        <form onSubmit={handleSubmit} className="ktab-admin-pub-form" noValidate>
          <div className="ktab-admin-pub-form-card">
            <div className="ktab-admin-pub-form-grid">
              <Input
                label="الاسم الأول"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="مثال: أحمد"
                error={errors.firstName}
                showCount={false}
                required
              />

              <Input
                label="اسم الأب / الأوسط"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="اسم الأب أو اللقب"
                showCount={false}
              />

              <Input
                label="اسم العائلة"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="مثال: خليل"
                error={errors.lastName}
                showCount={false}
                required
              />

              <Input
                label="البريد الإلكتروني"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="publisher@example.com"
                error={errors.email}
                dir="ltr"
                showCount={false}
                required
              />

              <Input
                label={isEditing ? "كلمة المرور الجديدة" : "كلمة المرور"}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEditing
                    ? "اتركها فارغة للإبقاء على الحالية"
                    : "8 أحرف تشمل حروفاً كبيرة وصغيرة ورقماً ورمزاً"
                }
                error={errors.password}
                dir="ltr"
                showCount={false}
                required={!isEditing}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="ktab-admin-pub-form-submit-bar">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/publishers")}
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
              {isEditing ? "حفظ وتحديث بيانات الناشر" : "تسجيل وإنشاء حساب الناشر"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
