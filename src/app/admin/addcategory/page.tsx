"use client";

import AddCategoryForm from "@/component/addCategoryForm";
import CategoryList from "@/component/categoryTable";

// ✅ Ensure dynamic rendering to avoid build errors
export const dynamic = "force-dynamic"; 

export default function Page() {
  return (
    <div>
      <AddCategoryForm />
      <CategoryList />
    </div>
  );
}
