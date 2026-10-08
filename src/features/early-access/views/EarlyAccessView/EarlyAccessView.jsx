import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button, Radio } from "@/components/myui/forms";
import logo from "@/assets/logo/logo.png";
import { useEarlyAccess } from "../../hooks/useEarlyAccess";
import EarlyAccessField from "../../components/EarlyAccessField/EarlyAccessField";
import "./EarlyAccessView.css";

export default function EarlyAccessView() {
  const {
    roleInfo, values, errors, message, result, isSubmitting, submitDisabled,
    personFields, organizationFields, generalErrors, retrySeconds, handleChange, handleSubmit,
    selectedRole, roleOptions, handleRoleChange,
  } = useEarlyAccess();

  return (
    <main className="early-access-page" dir="rtl">
      <header className="early-access-brand">
        <Link to="/" aria-label="كتاب — الرئيسية"><img src={logo} alt="كتاب" /></Link>
      </header>
      <section className="early-access-card" aria-labelledby="early-access-title">
        {result ? (
          <div className="early-access-confirmation" role="status">
            <div className="early-access-check"><Check size={32} aria-hidden="true" /></div>
            <h1 id="early-access-title">أنت الآن على القائمة</h1>
            <p>{message}</p>
            <p className="early-access-note">هذا طلب للوصول المبكر. سنتواصل معك عند إتاحة الوصول.</p>
            <Link className="early-access-home-link" to="/">العودة إلى الرئيسية</Link>
          </div>
        ) : (
          <>
            <div className="early-access-heading">
              <h1 id="early-access-title">{roleInfo?.title}</h1>
              <p>{roleInfo?.subtitle || "سجّل بيانات مؤسستك المكتبية، وكن من أوائل الشركاء في إتاحة المعرفة عبر كتاب."}</p>
            </div>
            <form className="early-access-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
              {roleOptions.length > 1 && (
                <fieldset className="early-access-roles" disabled={isSubmitting}>
                  <legend>أود الانضمام بصفتي</legend>
                  <div className="early-access-role-options">
                    {roleOptions.map((option) => (
                      <Radio key={option.value} label={option.label} name="earlyAccessRole" value={option.value} checked={selectedRole === option.value} onChange={handleRoleChange} disabled={isSubmitting} className={`early-access-role-option ${selectedRole === option.value ? "is-selected" : ""}`} />
                    ))}
                  </div>
                </fieldset>
              )}
              <fieldset className="early-access-section-group">
                <legend className="early-access-section-legend">بيانات مسؤول المكتبة</legend>
                <div className="early-access-grid">
                  {personFields.map((field) => (
                    <EarlyAccessField key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={handleChange} disabled={isSubmitting} />
                  ))}
                </div>
              </fieldset>
              {organizationFields.length > 0 && (
                <fieldset className="early-access-organization early-access-section-group">
                  <legend className="early-access-section-legend">بيانات المؤسسة المكتبية</legend>
                  <div className="early-access-grid">
                    {organizationFields.map((field) => (
                      <EarlyAccessField key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={handleChange} disabled={isSubmitting} />
                    ))}
                  </div>
                </fieldset>
              )}
              {(generalErrors.length > 0 || (message && Object.keys(errors).length === 0)) && (
                <div className="early-access-form-error" role="alert">
                  {message && Object.keys(errors).length === 0 && <p>{message}</p>}
                  {generalErrors.map((error, index) => <p key={index}>{error}</p>)}
                </div>
              )}
              <Button className="early-access-submit" type="submit" size="lg" loading={isSubmitting} disabled={submitDisabled}>
                {isSubmitting ? "جارٍ إرسال الطلب…" : retrySeconds > 0 ? `انتظر ${retrySeconds} ثانية` : "انضم بمكتبتك إلى قائمة الوصول المبكر"}
              </Button>
              <p className="early-access-note">هذا طلب للوصول المبكر للمكتبات، وسيُفعّل حساب المؤسسة لاحقًا بعد المراجعة والموافقة.</p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
