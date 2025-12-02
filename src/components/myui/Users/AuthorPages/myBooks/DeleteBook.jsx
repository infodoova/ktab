import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Loader2 } from "lucide-react";
import { AlertToast } from "../../../AlertToast";

import { deleteHelper } from "../../../../../../apis/apiHelpers"; 

export default function DeleteBook({ book, open, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    variant: "success",
    title: "",
    description: "",
  });

  const showToast = (variant, title, description) => {
    setToast({
      open: true,
      variant,
      title,
      description,
    });
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteHelper({
        url: `${import.meta.env.VITE_API_URL}/authors/deleteBook/${book.id}`,
      });



   if (res.success) {
  showToast("success", "تم حذف الكتاب", "تم حذف الكتاب بنجاح.");
  onDeleted(book.id);
  onClose(); 
  return;
}

      

      showToast("error", "فشل حذف الكتاب", "حدث خطأ أثناء الحذف. الرجاء المحاولة لاحقاً.");

    } catch (err) {
      console.error(err);
      showToast(
        "error",
        "خطأ في الاتصال",
        "تعذر الاتصال بالخادم. الرجاء التحقق من الاتصال أو المحاولة لاحقاً."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={() => {}}>
        <AlertDialogContent className="bg-[var(--earth-cream)] border-[var(--earth-sand)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--earth-brown)] text-lg">
              هل أنت متأكد من حذف الكتاب؟
            </AlertDialogTitle>
          </AlertDialogHeader>

          <p className="text-[var(--earth-brown)]/70 text-sm mt-1 text-right">
            سيتم حذف الكتاب نهائياً من المنصة ومن ملفات S3.
          </p>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-white text-[var(--earth-brown)] border border-[var(--earth-sand)] hover:bg-[var(--earth-cream)]">
              إلغاء
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "حذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* TOAST */}
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}
