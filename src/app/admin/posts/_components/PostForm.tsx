"use client";

import React, { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Category } from "@/app/_types/Categories";
import { CategoriesSelect } from "./CategoriesSelect";
import { Control } from "react-hook-form";

//型の不一致のエラーを解消するため
interface PostFormValues {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: Category[];
}

interface Props {
  mode: "new" | "edit";
  control: Control<PostFormValues>; // 型を明確に指定　
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  control,
  onSubmit,
  onDelete,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const { categories } = await res.json();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* タイトル */}
      <div className="mt-4">
        <label htmlFor="title" className="block text-sm text-gray-700">
          タイトル <span className="text-red-500">*</span>
        </label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "タイトルは必須です" }} // 必須バリデーション
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                id="title"
                className={`mt-1 block w-full rounded-md border ${fieldState.error ? "border-red-500" : "border-gray-200"
                  } p-3`}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* 内容 */}
      <div className="mt-4">
        <label htmlFor="content" className="block text-sm text-gray-700">
          内容 <span className="text-red-500">*</span>
        </label>
        <Controller
          name="content"
          control={control}
          rules={{ required: "内容は必須です" }} // 必須バリデーション
          render={({ field, fieldState }) => (
            <>
              <textarea
                {...field}
                id="content"
                className={`mt-1 block w-full rounded-md border ${fieldState.error ? "border-red-500" : "border-gray-200"
                  } p-3`}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* サムネイルURL */}
      <div className="mt-4">
        <label htmlFor="thumbnailUrl" className="block text-sm text-gray-700">
          サムネイルURL <span className="text-red-500">*</span>
        </label>
        <Controller
          name="thumbnailUrl"
          control={control}
          rules={{ required: "サムネイルURLは必須です" }} // 必須バリデーション
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                id="thumbnailUrl"
                className={`mt-1 block w-full rounded-md border ${fieldState.error ? "border-red-500" : "border-gray-200"
                  } p-3`}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* カテゴリー */}
      <div className="mt-4">
        <label htmlFor="categories" className="block text-sm text-gray-700">
          カテゴリー <span className="text-red-500">*</span>
        </label>
        <Controller
          name="categories"
          control={control}
          rules={{
            validate: (value) =>
              value.length > 0 || "少なくとも1つのカテゴリーを選択してください",
          }} // カスタムバリデーション
          render={({ field, fieldState }) => (
            <>
              <CategoriesSelect
                selectedCategories={field.value}
                setSelectedCategories={field.onChange}
                categories={categories}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* ボタン */}
      <div className="flex justify-between">
        <div className="flex">
          <button
            type="submit"
            className="shadow-md bg-blue-400 hover:bg-blue-600 text-white rounded px-4 py-2 mt-4"
          >
            {mode === "new" ? "作成" : "更新"}
          </button>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              className="shadow-md bg-red-400 hover:bg-red-600 text-white rounded px-4 py-2 mt-4 ml-2"
              onClick={onDelete}
            >
              削除
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
