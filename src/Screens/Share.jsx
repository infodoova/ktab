import { useEffect } from "react";

export default function ShareRedirectPage() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encrypted = params.get("r");

    if (!encrypted) return;

    try {
      const decoded = decodeURIComponent(atob(encrypted));
      window.location.href = decoded; // redirect to original page
    } catch (err) {
      console.error("Invalid encrypted link", err);
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-xl font-bold">
      جاري التحويل...
    </div>
  );
}
