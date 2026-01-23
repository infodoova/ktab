import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import BooksGrid from "../../../components/myui/Users/AuthorPages/myBooks/Books";

import { getHelper } from "../../../../apis/apiHelpers";
import { getUserData } from "../../../../store/authToken";

export default function MyBooks({ pageName = "كتبي" }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const fetchBooks = useCallback(async (page = 0, status = "PUBLISHED") => {
    const user = getUserData();

    const res = await getHelper({
      url: `${import.meta.env.VITE_API_URL}/authors/getBooksByAuthor/${
        user.userId
      }?status=${status}`,
      pagination: true,
      page,
      size: 8,
    });

    const data = res?.data ?? {};
    if (res.messageStatus !== "SUCCESS") {
      AlertToast(res?.message, res?.messageStatus);
      return;
    }

    return {
      content: Array.isArray(data.content) ? data.content : [],
      totalPages: typeof data.totalPages === "number" ? data.totalPages : 1,
    };
  }, []);

  return (
    <div dir="rtl" className="bg-[#fafffe] min-h-screen">
      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileButtonTitle="رفع كتاب جديد"
          onMobileButtonPress={() =>
            navigate("/Screens/dashboard/AuthorPages/newBookPublish")
          }
        />
      </div>

      <div
        className={`flex min-h-screen transition-all duration-300 md:flex-row-reverse ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1">
          <PageHeader
            mainTitle={pageName}
            buttonTitle="رفع كتاب جديد"
            onPress={() =>
              navigate("/Screens/dashboard/AuthorPages/newBookPublish")
            }
          />

          <BooksGrid
            fetchFunction={(page, status) => fetchBooks(page, status)}
          />
        </main>
      </div>
    </div>
  );
}
