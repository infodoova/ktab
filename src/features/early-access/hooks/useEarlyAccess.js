import { useCallback, useEffect, useRef, useState } from "react";
import { EARLY_ACCESS_ROLES, PERSON_FIELDS, ORGANIZATION_FIELDS } from "../constants/earlyAccessFields";
import { prepareEarlyAccessRequest } from "../utils/earlyAccessValidation";
import { submitEarlyAccess } from "../services/earlyAccessService";

const newForm = (slug) => ({ slug, values: {}, errors: {}, message: "", result: null, isSubmitting: false, retryUntil: 0 });

export function useEarlyAccess() {
  const [slug, setSlug] = useState("admin-librarian");
  const roleInfo = Object.prototype.hasOwnProperty.call(EARLY_ACCESS_ROLES, slug) ? EARLY_ACCESS_ROLES[slug] : null;
  const [storedForm, setForm] = useState(() => newForm(slug));
  const form = storedForm.slug === slug ? storedForm : newForm(slug);
  const [now, setNow] = useState(Date.now);
  const requestRef = useRef(null);
  const retrySeconds = Math.max(0, Math.ceil((form.retryUntil - now) / 1000));

  const handleRoleChange = useCallback((selection, event) => {
    const nextSlug = event?.target.value ?? selection?.target?.value ?? selection;
    if (!Object.prototype.hasOwnProperty.call(EARLY_ACCESS_ROLES, nextSlug) || requestRef.current) return;
    setSlug(nextSlug);
    setForm((previous) => ({
      ...newForm(nextSlug),
      values: Object.fromEntries(PERSON_FIELDS.map((field) => [field.name, previous.values[field.name] || ""])),
      retryUntil: previous.retryUntil,
      message: previous.retryUntil > Date.now() ? previous.message : "",
    }));
  }, []);

  useEffect(() => () => {
    requestRef.current?.abort();
    requestRef.current = null;
    setForm((previous) => previous.slug === slug && previous.isSubmitting
      ? { ...previous, isSubmitting: false } : previous);
  }, [slug]);

  useEffect(() => {
    if (form.retryUntil <= Date.now()) return;
    const timer = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= form.retryUntil) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [form.retryUntil]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    const isPhone = name.toLowerCase().includes("phone");
    const cleanValue = isPhone ? value.replace(/\D/g, "") : value;
    setForm((previous) => {
      const current = previous.slug === slug ? previous : newForm(slug);
      const errors = { ...current.errors };
      delete errors[name];
      return { ...current, values: { ...current.values, [name]: cleanValue }, errors, message: "" };
    });
  }, [slug]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!roleInfo || requestRef.current || form.retryUntil > Date.now()) return;
    const { payload, errors } = prepareEarlyAccessRequest(form.values, roleInfo.role);
    if (Object.keys(errors).length) {
      setForm({ ...form, errors, message: "راجع الحقول أدناه لإكمال طلبك." });
      event.currentTarget.elements.namedItem(Object.keys(errors)[0])?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setForm({ ...form, isSubmitting: true, errors: {}, message: "" });
    try {
      const { status, body, retryAfter } = await submitEarlyAccess(payload, controller.signal);
      if (controller.signal.aborted) return;
      if (status === 201 && body?.success !== false) {
        setForm({ ...form, isSubmitting: false, errors: {}, result: "created", message: body?.message || "تم تسجيلك في قائمة الوصول المبكر. سنتواصل معك قريبًا." });
      } else if (status === 409) {
        const errorMsg = body?.message || "هذا البريد الإلكتروني مسجّل بالفعل.";
        setForm({
          ...form,
          isSubmitting: false,
          result: null,
          errors: { email: errorMsg },
          message: "",
        });
      } else if (status === 429) {
        const timestamp = Date.now();
        setNow(timestamp);
        setForm({ ...form, isSubmitting: false, errors: {}, retryUntil: timestamp + retryAfter * 1000, message: "طلبات كثيرة. انتظر قليلًا قبل المحاولة مجددًا." });
      } else {
        const errors = status === 400 && body?.errors && typeof body.errors === "object"
          ? Object.fromEntries(Object.entries(body.errors).filter(([, value]) => typeof value === "string")) : {};
        setForm({ ...form, isSubmitting: false, errors, message: status === 400 && typeof body?.message === "string" ? body.message : "تعذر إرسال طلبك الآن. حاول مرة أخرى لاحقًا." });
      }
    } catch (err) {
      if (err.name !== "AbortError" && !controller.signal.aborted) {
        setForm({ ...form, isSubmitting: false, message: "تعذر الاتصال. تحقق من اتصالك وحاول مجددًا." });
      }
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  }, [form, roleInfo]);

  const fieldNames = [...PERSON_FIELDS, ...ORGANIZATION_FIELDS].map((field) => field.name);
  const generalErrors = Object.entries(form.errors).filter(([name]) => !fieldNames.includes(name)).map(([, message]) => message);
  return {
    roleInfo, ...form, personFields: PERSON_FIELDS,
    organizationFields: roleInfo?.role === "ADMIN_LIBRARIAN" ? ORGANIZATION_FIELDS : [],
    retrySeconds, generalErrors, handleChange, handleSubmit, handleRoleChange,
    selectedRole: slug,
    roleOptions: Object.entries(EARLY_ACCESS_ROLES).map(([value, info]) => ({ value, label: info.optionLabel })),
    submitDisabled: form.isSubmitting || retrySeconds > 0,
  };
}
