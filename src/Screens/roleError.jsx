import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RoleError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 rtl">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        لا تملك صلاحية للدخول
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        هذا القسم غير متوفر حسب دور المستخدم الخاص بك.
      </p>

      <Button onClick={() => navigate("/")} className="px-6 py-2 text-lg">
        العودة إلى الصفحة الرئيسية
      </Button>
    </div>
  );
}
