import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trailerService } from "../services/trailerService";
import { getTrailerQuota, isTrailerActive, isTrailerQueued, presentTrailer } from "../utils/trailerUtils";
import { AlertToast } from "@/components/myui/AlertToast";

export function useBookTrailers({ bookId, isAdmin = false, enabled = true, role = null }) {
  const isReviewer = isAdmin || ["AUTHOR", "LIBRARY_ADMIN", "ADMIN_LIBRARIAN"].includes(role);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [operation, setOperation] = useState(null);
  const itemsRef = useRef([]);
  const lifecycle = useRef(0);
  const lock = useRef(false);
  const listRequest = useRef(0);

  const commit = useCallback((items) => {
    itemsRef.current = items;
    setTrailers(items);
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled || bookId == null) return;
    const epoch = lifecycle.current;
    const request = ++listRequest.current;
    try {
      const data = await trailerService.list(bookId);
      if (epoch !== lifecycle.current || request !== listRequest.current) return;
      commit(data);
      setError("");
    } catch (err) {
      if (epoch === lifecycle.current && request === listRequest.current) {
        setError(err.status === 404 ? "خدمة الإعلانات غير متاحة لهذا الكتاب حالياً." : err.message);
      }
    } finally {
      if (epoch === lifecycle.current && request === listRequest.current) setLoading(false);
    }
  }, [bookId, enabled, commit]);

  useEffect(() => {
    lifecycle.current++;
    lock.current = false;
    commit([]);
    setError("");
    setOperation(null);
    setLoading(enabled);
    if (enabled && bookId != null) refresh();
    const epochCounter = lifecycle;
    const requestCounter = listRequest;
    return () => { epochCounter.current++; requestCounter.current++; };
  }, [bookId, enabled, refresh, commit]);

  const activeIds = trailers.filter((item) => isTrailerActive(item.status)).map((item) => item.id).join(",");
  useEffect(() => {
    if (!enabled || !activeIds) return;
    const epoch = lifecycle.current;
    let disposed = false;
    let timer;
    let polling = false;
    const schedule = () => {
      clearTimeout(timer);
      if (!disposed && document.visibilityState !== "hidden") timer = setTimeout(tick, 12000);
    };
    const tick = async () => {
      if (disposed || polling || document.visibilityState === "hidden") return;
      if (lock.current) { schedule(); return; }
      polling = true;
      const request = listRequest.current;
      const active = itemsRef.current.filter((item) => isTrailerActive(item.status));
      const results = await Promise.allSettled(active.map((item) => trailerService.get(item.id)));
      if (!disposed && epoch === lifecycle.current && request === listRequest.current && !lock.current) {
        const updates = results.filter((result) => result.status === "fulfilled" && result.value?.id != null).map((result) => result.value);
        commit(itemsRef.current.map((item) => updates.find((update) => update.id === item.id) || item));
        if (results.some((result) => result.status === "rejected")) {
          setError("تعذر تحديث حالة الإعلان. سنحاول مجددًا تلقائياً.");
        } else setError("");
      }
      polling = false;
      schedule();
    };
    const onVisibility = () => {
      clearTimeout(timer);
      if (document.visibilityState !== "hidden") tick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    schedule();
    return () => {
      disposed = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [activeIds, enabled, commit]);

  const runAction = useCallback(async (action, trailer) => {
    if (lock.current || !enabled || bookId == null) return;
    const active = itemsRef.current.some((item) => isTrailerActive(item.status));
    const currentQuota = getTrailerQuota(itemsRef.current);
    if (action === "create" && (active || (!isAdmin && currentQuota.isExact && currentQuota.remaining === 0))) return;
    if (action === "cancel" && !isTrailerQueued(trailer?.status) && !(isAdmin && isTrailerActive(trailer?.status))) return;
    if (["approve", "reject"].includes(action) && !isReviewer) return;
    if (action === "retry" && active) return;
    lock.current = true;
    const epoch = lifecycle.current;
    listRequest.current++;
    setOperation({ action, id: trailer?.id });
    setError("");
    try {
      let result;
      if (action === "create") {
        result = await trailerService.create(bookId);
      } else if (action === "cancel") {
        await trailerService.cancel(trailer.id);
        result = { ...trailer, status: "CANCELLED" };
      } else if (action === "retry") {
        try {
          result = await trailerService.retry(trailer.id);
        } catch (err) {
          if (err.status === 403 || err.status === 404) {
            result = await trailerService.create(bookId);
          } else {
            throw err;
          }
        }
      } else {
        result = await trailerService.review(trailer.id, action === "approve");
      }
      if (epoch !== lifecycle.current) return;
      if (result?.id != null) {
        const previous = itemsRef.current.filter((item) => item.id !== result.id);
        commit([result, ...previous]);
      }
      await refresh();
      if (epoch !== lifecycle.current) return;
      AlertToast(
        action === "create"
          ? (result?.notifyByEmail ? "تمت إضافة الإعلان إلى قائمة الانتظار. سنرسل لك بريداً عند اكتماله." : "تمت إضافة الإعلان إلى قائمة الانتظار.")
          : action === "retry"
          ? "تمت إعادة جدولة إنتاج الإعلان بنجاح."
          : action === "approve"
          ? "تم اعتماد الإعلان بنجاح وأصبح متاحاً للمشاهدة."
          : action === "reject"
          ? "تم رفض الإعلان."
          : "تم تحديث الإعلان بنجاح.",
        "SUCCESS"
      );
      return result;
    } catch (err) {
      if (epoch === lifecycle.current) {
        setError(err.message);
        AlertToast(err.message, "ERROR");
        // Reload authoritative state for conflicts and quota errors.
        if ([400, 409].includes(err.status)) {
          await refresh();
          if (epoch === lifecycle.current) setError(err.message);
        }
      }
    } finally {
      if (epoch === lifecycle.current) {
        lock.current = false;
        setOperation(null);
      }
    }
  }, [bookId, enabled, isAdmin, isReviewer, commit, refresh]);

  const quota = getTrailerQuota(trailers);
  const hasActive = trailers.some((item) => isTrailerActive(item.status));
  const items = useMemo(() => trailers.map((item) => presentTrailer(item, { isAdmin, role })), [trailers, isAdmin, role]);
  return {
    items, quota, loading, error, operation, hasActive, refresh, runAction,
    canCreate: enabled && !loading && !error && !operation && !hasActive && (isAdmin || !quota.isExact || quota.remaining > 0),
  };
}
