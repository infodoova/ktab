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

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteHelper({
        url: `${import.meta.env.VITE_API_URL}/authors/deleteBook/${book.id}`,
      });

      if (res?.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        onDeleted(book.id);
        onClose();
        return;
      }
      AlertToast(res?.message, res?.messageStatus);
    } catch (err) {
      console.error(err);
      AlertToast(
        "تعذر الاتصال بالخادم. الرجاء التحقق من الاتصال أو المحاولة لاحقاً.",
        "ERROR"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
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
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
