import React from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Categories";
import { CategoriesSelect } from "./CategoriesSelect";

interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (thumbnailUrl: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  onSubmit,
  onDelete,
}) => {
  const router = useRouter();

  return (
    <form onSubmit={onSubmit} className="spece-y-4">
      <div className="mt-4">
        <label
          htmlFor="title"
          className="block text-sm font-bold text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="content"
          className="block text-sm font-bold text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="thumbnailUrl"
          className="block text-sm font-bold text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="text"
          id="thumbnailUrl"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="thumbnailUrl"
          className="block text-sm font-bold text-gray-700"
        >
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <button
            type="submit"
            className="shadow-md bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2 mt-4"
          >
            {mode === "new" ? "作成" : "更新"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              className="shadow-md bg-red-500 hover:bg-red-400 text-white rounded px-4 py-2 mt-4 ml-2"
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