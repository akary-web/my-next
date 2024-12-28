
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostForm } from "@/app/admin/posts/_components/PostForm";
import { Category } from "@/app/_types/Categories";
import { useForm } from "react-hook-form";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  // react-hook-formのuseFormフック
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      content: "",
      thumbnailUrl: "https://placehold.jp/800x400.png",
      categories: [],
    },
  });

  const selectedCategories = watch("categories"); // カテゴリの変更を監視

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const { id } = await res.json();
      router.push(`/admin/posts/${id}`);
      alert("記事を作成しました。");
    } catch (error) {
      console.log("データを取得できませんでした。", error);
    }
  };

  // カテゴリの取得
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const { categories } = await res.json();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="new"
        control={control} // react-hook-formのcontrolを渡す
        categories={categories}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
