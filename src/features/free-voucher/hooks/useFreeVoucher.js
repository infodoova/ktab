import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FREE_VOUCHER_ROLES, PERSON_FIELDS } from "../constants/freeVoucherFields";
import { prepareFreeVoucherRequest } from "../utils/freeVoucherValidation";
import { submitFreeVoucher } from "../services/freeVoucherService";

const newForm = (slug) => ({
  slug,
  values: {},
  errors: {},
  message: "",
  result: null,
  submittedData: null,
  isSubmitting: false,
  retryUntil: 0,
});

export function useFreeVoucher() {
  const { role: paramRole } = useParams();
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get("role");

  const [slug, setSlug] = useState(() => {
    const candidate = (paramRole || queryRole || "").toLowerCase();
    return Object.prototype.hasOwnProperty.call(FREE_VOUCHER_ROLES, candidate) ? candidate : "reader";
  });

  // Only sync from URL if a specific role is explicitly provided in the route/query
  useEffect(() => {
    const explicitRole = (paramRole || queryRole || "").toLowerCase();
    if (explicitRole && Object.prototype.hasOwnProperty.call(FREE_VOUCHER_ROLES, explicitRole)) {
      setSlug((current) => {
        if (current !== explicitRole) {
          setForm((previous) => ({
            ...newForm(explicitRole),
            values: previous.values,
          }));
          return explicitRole;
        }
        return current;
      });
    }
  }, [paramRole, queryRole]);

  const roleInfo = Object.prototype.hasOwnProperty.call(FREE_VOUCHER_ROLES, slug) ? FREE_VOUCHER_ROLES[slug] : null;
  const [storedForm, setForm] = useState(() => newForm(slug));
  const form = storedForm.slug === slug ? storedForm : newForm(slug);
  const [now, setNow] = useState(Date.now);
  const requestRef = useRef(null);
  const retrySeconds = Math.max(0, Math.ceil((form.retryUntil - now) / 1000));

  const handleRoleChange = useCallback((selection, event) => {
    const nextSlug = typeof selection === "string"
      ? selection
      : event?.target?.value ?? selection?.target?.value ?? selection;
    if (!Object.prototype.hasOwnProperty.call(FREE_VOUCHER_ROLES, nextSlug) || requestRef.current) return;
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
    const { payload, errors } = prepareFreeVoucherRequest(form.values, roleInfo.role);
    if (Object.keys(errors).length) {
      setForm({ ...form, errors, message: "يرجى مراجعة الحقول لتأكيد استلام القسيمة." });
      event.currentTarget.elements.namedItem(Object.keys(errors)[0])?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setForm({ ...form, isSubmitting: true, errors: {}, message: "" });
    try {
      const { status, body, retryAfter } = await submitFreeVoucher(payload, controller.signal);
      if (controller.signal.aborted) return;
      if (status === 201 && body?.success !== false) {
        const isAuthor = slug === "author";
        setForm({
          ...form,
          isSubmitting: false,
          errors: {},
          result: "created",
          submittedData: {
            ...payload,
            voucherCode: isAuthor ? "KTAB-AUTHOR-50OFF" : `KTAB-${slug.toUpperCase()}-FREE30`,
          },
          message:
            body?.message ||
            (isAuthor
              ? "تهانينا! تم تسجيلك وحجز قسيمة خصم 50% على أول 10 كتب بنجاح."
              : "تهانينا! تم تسجيلك وحجز قسيمة الشهر المجاني بنجاح."),
        });
      } else if (status === 409) {
        const errorMsg = body?.message || "هذا البريد الإلكتروني مسجّل بالفعل في المنصة.";
        setForm({
          ...form,
          isSubmitting: false,
          result: null,
          submittedData: null,
          errors: { email: errorMsg },
          message: "",
        });
      } else if (status === 429) {
        const timestamp = Date.now();
        setNow(timestamp);
        setForm({
          ...form,
          isSubmitting: false,
          errors: {},
          retryUntil: timestamp + retryAfter * 1000,
          message: "طلبات كثيرة خلال فترة قصيرة. يرجى الانتظار قليلًا قبل المحاولة مجددًا.",
        });
      } else {
        const errors = status === 400 && body?.errors && typeof body.errors === "object"
          ? Object.fromEntries(Object.entries(body.errors).filter(([, value]) => typeof value === "string")) : {};
        setForm({
          ...form,
          isSubmitting: false,
          errors,
          message: status === 400 && typeof body?.message === "string" ? body.message : "تعذر إرسال طلب القسيمة الآن. حاول مرة أخرى لاحقًا.",
        });
      }
    } catch (err) {
      if (err.name !== "AbortError" && !controller.signal.aborted) {
        setForm({ ...form, isSubmitting: false, message: "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مجددًا." });
      }
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  }, [form, roleInfo, slug]);

  const fieldNames = PERSON_FIELDS.map((field) => field.name);
  const generalErrors = Object.entries(form.errors).filter(([name]) => !fieldNames.includes(name)).map(([, message]) => message);

  return {
    roleInfo,
    ...form,
    personFields: PERSON_FIELDS,
    retrySeconds,
    generalErrors,
    handleChange,
    handleSubmit,
    handleRoleChange,
    selectedRole: slug,
    roleOptions: Object.entries(FREE_VOUCHER_ROLES).map(([value, info]) => ({
      value,
      label: info.optionLabel,
      role: info.role,
      badge: info.badge,
    })),
    submitDisabled: form.isSubmitting || retrySeconds > 0,
  };
}
