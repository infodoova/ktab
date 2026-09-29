import { useState, useEffect, useRef } from "react";

// Module-level flag so Google SDK is only initialized once per page load,
// surviving React StrictMode double-invocations and component remounts.
let _googleInitialized = false;
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/core/store/authStore";
import { tokenManager } from "@/core/services/tokenManager";
import { loginApi, googleLoginApi, completeGoogleRegistrationApi } from "@/core/api/authApi";
import { AlertToast } from "@/components/myui/AlertToast";
import { getRoleDefaultRoute } from "@/core/constants/roles";
import { sanitizeEmail } from "@/lib/sanitize";
import { validateEmail, validateLoginPassword } from "@/utils/validation";
import logger from "@/lib/logger";

/**
 * Custom hook handling all login business logic, state, validation, navigation,
 * and Google OAuth2 Identity Services integration.
 */
export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const googleBtnRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // Google OAuth pending registration state
  const [googleRoleOpen, setGoogleRoleOpen] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState(null);
  const [selectedGoogleRole, setSelectedGoogleRole] = useState("READER");
  const [googleCompleteLoading, setGoogleCompleteLoading] = useState(false);

  // Prevent scroll leakage on auth pages
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const navigateAfterAuth = (user) => {
    const params = new URLSearchParams(location.search || window.location.search);
    const redirectParam = params.get("redirect");
    const stateTarget = location?.state?.from;
    const target = redirectParam || stateTarget;

    // Validate that target is a safe relative internal route and not an auth loop
    if (
      target &&
      typeof target === "string" &&
      target.startsWith("/") &&
      !target.startsWith("/login") &&
      !target.startsWith("/signup")
    ) {
      navigate(target, { replace: true });
      return;
    }

    const destination = getRoleDefaultRoute(user?.role);
    navigate(destination, { replace: true });
  };

  /**
   * Dispatches the Google ID token to the backend auth endpoint.
   */
  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      AlertToast("فشل استلام رمز التحقق من Google.", "ERROR");
      return;
    }

    setGoogleLoading(true);

    try {
      const res = await googleLoginApi({ idToken: response.credential });

      if (!res.ok || (res.messageStatus && res.messageStatus !== "SUCCESS")) {
        AlertToast(res?.message || "فشل تسجيل الدخول عبر Google", res?.messageStatus || "ERROR");
        return;
      }

      // Check if user is new and must select a role to complete registration
      const pendingToken =
        res.data?.pendingToken ||
        res.pendingToken ||
        (typeof res.data === "string" ? res.data : null);

      const hasValidSession =
        res.data &&
        typeof res.data === "object" &&
        (res.data.id || res.data.email) &&
        res.data.role;

      if (pendingToken && !hasValidSession) {
        setPendingGoogleToken(pendingToken);
        setGoogleRoleOpen(true);
        return;
      }

      if (res.data) {
        setAuth(res.data);
      } else {
        await tokenManager.callRefreshAPI();
      }

      AlertToast(res?.message || "تم تسجيل الدخول بنجاح", "SUCCESS");
      const currentUser = useAuthStore.getState().user;
      navigateAfterAuth(currentUser);
    } catch (error) {
      logger.error("Google OAuth login error:", error);
      AlertToast("تعذر الاتصال بالخادم.", "ERROR");
    } finally {
      setGoogleLoading(false);
    }
  };

  /**
   * Completes registration for new Google OAuth users with chosen role.
   */
  const handleCompleteGoogleRegistration = async () => {
    if (!pendingGoogleToken) return;
    if (!selectedGoogleRole) {
      AlertToast("يرجى اختيار نوع الحساب للمتابعة.", "ERROR");
      return;
    }

    setGoogleCompleteLoading(true);

    try {
      const res = await completeGoogleRegistrationApi({
        pendingToken: pendingGoogleToken,
        role: selectedGoogleRole,
      });

      if (!res.ok || (res.messageStatus && res.messageStatus !== "SUCCESS")) {
        AlertToast(res?.message || "فشل إكمال التسجيل", res?.messageStatus || "ERROR");
        return;
      }

      if (res.data) {
        setAuth(res.data);
      } else {
        await tokenManager.callRefreshAPI();
      }

      AlertToast(res?.message || "تم إنشاء الحساب بنجاح", "SUCCESS");
      setGoogleRoleOpen(false);
      setPendingGoogleToken(null);

      const currentUser = useAuthStore.getState().user;
      navigateAfterAuth(currentUser);
    } catch (error) {
      logger.error("Complete Google registration error:", error);
      AlertToast("تعذر الاتصال بالخادم.", "ERROR");
    } finally {
      setGoogleCompleteLoading(false);
    }
  };

  const handleCredentialRef = useRef(handleGoogleCredentialResponse);
  handleCredentialRef.current = handleGoogleCredentialResponse;
  // isGoogleInitializedRef intentionally uses module-level flag (see top of file)

  // Mount and initialize Google Identity Services SDK
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || resetOpen || googleRoleOpen) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;

      if (!_googleInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (res) => handleCredentialRef.current?.(res),
          auto_select: false,
        });
        _googleInitialized = true;
      }

      if (googleBtnRef.current) {
        try {
          googleBtnRef.current.innerHTML = "";
          const containerWidth = googleBtnRef.current.parentElement?.offsetWidth || 380;
          const targetWidth = Math.min(400, Math.max(280, containerWidth));
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "center",
            width: targetWidth,
            locale: "ar",
          });
        } catch (e) {
          logger.error("Failed to render Google button:", e);
        }
      }
      setIsGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const existingScript = document.getElementById("google-gsi-client");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client?hl=ar";
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.body.appendChild(script);
      } else {
        existingScript.addEventListener("load", initGoogle);
      }
    }
  }, [resetOpen, googleRoleOpen]);

  const validate = () => {
    const nextErrors = {};
    const cleanEmail = sanitizeEmail(email);

    const emailErr = validateEmail(cleanEmail, {
      requiredMessage: "الرجاء إدخال البريد الإلكتروني.",
      invalidMessage: "صيغة بريد إلكتروني غير صحيحة.",
    });
    if (emailErr) nextErrors.email = emailErr;

    const pwErr = validateLoginPassword(password);
    if (pwErr) nextErrors.password = pwErr;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const cleanEmail = sanitizeEmail(email);
      const res = await loginApi({
        email: cleanEmail,
        password,
      });

      if (!res.ok || (res.messageStatus && res.messageStatus !== "SUCCESS")) {
        AlertToast(res?.message || "فشل تسجيل الدخول", res?.messageStatus || "ERROR");
        return;
      }

      // Apply returned user profile or tokens to store
      if (res.data) {
        setAuth(res.data);
      } else {
        await tokenManager.callRefreshAPI();
      }

      AlertToast(res?.message || "تم تسجيل الدخول بنجاح", "SUCCESS");

      const currentUser = useAuthStore.getState().user;
      navigateAfterAuth(currentUser);
    } catch (error) {
      logger.error("Login submission error:", error);
      AlertToast("تعذر الاتصال بالخادم.", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const triggerGooglePrompt = () => {
    try {
      document.cookie = "g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    } catch {}

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      AlertToast("جاري تهيئة خدمة Google، يرجى المحاولة بعد لحظات...", "INFO");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errors,
    loading,
    googleLoading,
    isGoogleReady,
    googleBtnRef,
    triggerGooglePrompt,
    resetOpen,
    setResetOpen,
    googleRoleOpen,
    setGoogleRoleOpen,
    pendingGoogleToken,
    setPendingGoogleToken,
    selectedGoogleRole,
    setSelectedGoogleRole,
    googleCompleteLoading,
    handleCompleteGoogleRegistration,
    handleSubmit,
  };
}

export default useLogin;

