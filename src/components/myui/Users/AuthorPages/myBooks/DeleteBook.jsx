import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
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

      if (res?.messageStatus === "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        onDeleted(book.id);
        onClose();
      } else {
        AlertToast(res?.message || "فشل حذف الكتاب", "ERROR");
      }
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
        <AlertDialogContent className="bg-[#fafffe] border-black/5 rounded-[2rem] shadow-2xl z-[200]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black text-xl font-black tracking-tight text-right">
              هل أنت متأكد من حذف الكتاب؟
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription className="text-black/60 text-sm mt-1 text-right font-medium">
            سيتم حذف الكتاب نهائياً ولا يمكن استعادته مرة أخرى.
          </AlertDialogDescription>

          <AlertDialogFooter className="mt-6 flex gap-3">
            <AlertDialogCancel className="bg-white text-black border border-black/5 hover:bg-black/5 rounded-xl px-6 h-11 font-black transition-all">
              إلغاء
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 h-11 font-black transition-all shadow-lg shadow-red-600/20"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
