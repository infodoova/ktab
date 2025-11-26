import React, { useState } from "react";
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
  const [alert, setAlert] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const fetchBooks = async (page = 0) => {
    const user = getUserData();
    if (!user?.userId) return { content: [], totalPages: 1 };

    const res = await getHelper({
      url: `${import.meta.env.VITE_API_URL}/books/author/${user.userId}`,
      pagination: true,
      page,
      size: 8,
    });

    const data = res?.data || {};
    return {
      content: data.content || [],
      totalPages: data.totalPages || 1,
    };
  };

  return (
    <div dir="rtl" className="bg-[var(--earth-cream)] min-h-screen">
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

          <BooksGrid fetchFunction={fetchBooks} />
        </main>
      </div>

      <AlertToast
        open={alert.open}
        variant={alert.variant}
        title={alert.title}
        description={alert.description}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  );
}
