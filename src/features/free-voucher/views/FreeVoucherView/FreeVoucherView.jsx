import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button, Radio } from "@/components/myui/forms";
import logo from "@/assets/logo/logo.png";
import { useFreeVoucher } from "../../hooks/useFreeVoucher";
import FreeVoucherField from "../../components/FreeVoucherField/FreeVoucherField";
import "./FreeVoucherView.css";

export default function FreeVoucherView() {
  const {
    values, errors, message, result, isSubmitting, submitDisabled,
    personFields, generalErrors, retrySeconds, handleChange, handleSubmit,
    selectedRole, roleOptions, handleRoleChange,
  } = useFreeVoucher();

  return (
    <main className="voucher-page" dir="rtl">
      <header className="voucher-brand">
        <Link to="/" aria-label="كُتّاب — الرئيسية">
          <img src={logo} alt="كُتّاب" />
        </Link>
      </header>

      <section className="voucher-card" aria-labelledby="voucher-title">
        {result ? (
          <div className="voucher-confirmation" role="status">
            <div className="voucher-check">
              <Check size={32} aria-hidden="true" />
            </div>
            <h1 id="voucher-title">تم حجز قسيمتك بنجاح</h1>
            <p>{message}</p>
            <p className="voucher-note">
              ستصلك تفاصيل تفعيل شهرك المجاني عبر البريد الإلكتروني فور إطلاق التطبيق.
            </p>
            <Link className="voucher-home-link" to="/">
              العودة إلى الرئيسية
            </Link>
          </div>
        ) : (
          <>
            <div className="voucher-heading">
              <h1 id="voucher-title">احصل على شهر مجاني عند الانضمام إلى كُتّاب</h1>
              <p>سجّل الآن كقارئ أو كمؤلف، واحصل على قسيمة اشتراك لشهر كامل مجانًا فور إطلاق المنصة.</p>
            </div>

            <form className="voucher-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
              {roleOptions.length > 1 && (
                <fieldset className="voucher-roles" disabled={isSubmitting}>
                  <legend>أود الانضمام بصفتي</legend>
                  <div className="voucher-role-options">
                    {roleOptions.map((option) => (
                      <Radio
                        key={option.value}
                        id={`voucher-role-${option.value}`}
                        label={option.label}
                        name="voucherRole"
                        value={option.value}
                        checked={selectedRole === option.value}
                        onChange={(val) => handleRoleChange(val)}
                        disabled={isSubmitting}
                        className={`voucher-role-option ${selectedRole === option.value ? "is-selected" : ""}`}
                      />
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="voucher-grid">
                {personFields.map((field) => (
                  <FreeVoucherField
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    error={errors[field.name]}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {(generalErrors.length > 0 || (message && Object.keys(errors).length === 0)) && (
                <div className="voucher-form-error" role="alert">
                  {message && Object.keys(errors).length === 0 && <p>{message}</p>}
                  {generalErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              <Button
                className="voucher-submit"
                type="submit"
                size="lg"
                loading={isSubmitting}
                disabled={submitDisabled}
              >
                {isSubmitting
                  ? "جارٍ إرسال الطلب…"
                  : retrySeconds > 0
                  ? `انتظر ${retrySeconds} ثانية`
                  : "احصل على قسيمة الشهر المجاني"}
              </Button>

              <p className="voucher-note">
                هذا طلب للحصول على قسيمة شهر مجاني، وسيُفعّل حسابك وتصلك بيانات القسيمة عند الإطلاق.
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
