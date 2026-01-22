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

export default function DeleteStoryModal({ story, isOpen, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(story.id);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <AlertDialogContent className="bg-white border-black/5 rtl" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black text-lg font-black text-right">
            هل أنت متأكد من حذف القصة؟
          </AlertDialogTitle>
        </AlertDialogHeader>

        <p className="text-black/60 text-sm mt-1 text-right font-bold">
          سيتم حذف قصة <span className="text-black underline">"{story?.title}"</span> نهائياً. هذا الإجراء لا يمكن التراجع عنه.
        </p>

        <AlertDialogFooter className="mt-6 flex-row gap-3">
          <AlertDialogCancel className="flex-1 bg-black/[0.03] text-black/60 border-black/5 hover:bg-black/5 rounded-xl font-bold h-12">
            إلغاء
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold h-12 shadow-lg shadow-red-500/20"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "تأكيد الحذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}