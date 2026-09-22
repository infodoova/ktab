import React from "react";
import { CheckCircle, Users } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Input } from "@/components/myui/forms/Input";
import { Button } from "@/components/myui/forms/Button";
import { useStaffForm } from "../hooks/useStaffForm";
import "./LibraryAdminStaffCreateView.css";

/**
 * Library Admin Staff Provisioning View (Create).
 * Form allowing the organization administrator to invite or assign staff members.
 */
export default function LibraryAdminStaffCreateView() {
  const {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    navigate,
  } = useStaffForm();

  const breadcrumb = {
    parentLabel: "فريق العمل",
    parentPath: "/library-admin/staff",
  };

  return (
    <AppLayout pageName="إضافة موظف جديد" breadcrumb={breadcrumb} showSearch={false}>
      <div className="ktab-staff-create-view" dir="rtl">
        {/* Header */}
        <div className="ktab-staff-create-header">
          <div>
            <h1 className="ktab-staff-create-title">دعوة وتعيين موظف جديد</h1>
            <p className="ktab-staff-create-desc">
              أدخل البيانات الشخصية ومعلومات تسجيل الدخول لإضافة عضو جديد إلى طاقم إدارة المكتبة
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="ktab-staff-form" noValidate>
          <div className="ktab-staff-form-card">
            <div className="ktab-staff-form-grid">
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
                placeholder="staff@library.com"
                error={errors.email}
                dir="ltr"
                showCount={false}
                required
              />

              <Input
                label="كلمة المرور"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8 أحرف تشمل حروفاً كبيرة وصغيرة ورقماً ورمزاً"
                error={errors.password}
                dir="ltr"
                showCount={false}
                required
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="ktab-staff-form-submit-bar">
            <Button
              variant="secondary"
              onClick={() => navigate("/library-admin/staff")}
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
              حفظ وتعيين الموظف
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
