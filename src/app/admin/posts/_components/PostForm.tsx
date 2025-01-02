"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image"; // Next.jsの画像表示用コンポーネント
import { Controller, Control } from "react-hook-form"; // React Hook Formのコントローラー
import { Category } from "@/app/_types/Categories"; // カテゴリーの型をインポート
import { CategoriesSelect } from "./CategoriesSelect"; // カスタムカテゴリーセレクトコンポーネント
import { supabase } from "@/app/utils/supabase"; // Supabaseの初期化ファイルをインポート
import { v4 as uuidv4 } from "uuid"; // 一意のIDを生成するためのライブラリ
import { PostFormValues } from "@/app/_types/Post"; // フォームデータの型をインポート
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

// プロパティの型定義
interface Props {
  mode: "new" | "edit"; // フォームが新規作成用か編集用かを指定
  control: Control<PostFormValues>; // React Hook FormのControlオブジェクト
  onSubmit: (e: React.FormEvent) => void; // フォーム送信時のコールバック
  onDelete?: () => void; // 削除ボタンが押された時のコールバック（編集時のみ）
  setThumbnailImageKey: (thumbnailImageKey: string) => void; // サムネイル画像のキーを設定する関数
  thumbnailImageKey: string; // 現在のサムネイル画像のキー
}

// PostFormコンポーネント
export const PostForm: React.FC<Props> = ({
  mode,
  control,
  onSubmit,
  onDelete,
  setThumbnailImageKey,
  thumbnailImageKey,
}) => {
  // ステート: カテゴリーのリストを管理
  const [categories, setCategories] = useState<Category[]>([]);

  // Supabaseセッションからトークンを取得
  const { token } = useSupabaseSession();

  // ステート: サムネイル画像のURL（表示用）
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);

  // サムネイル画像を選択したときのアップロード処理
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) return; // ファイルが選択されていなければ何もしない

    const file = event.target.files[0]; // 選択された画像ファイル
    const filePath = `private/${uuidv4()}`; // 一意のファイルパスを生成

    // SupabaseのStorageにファイルをアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // バケット名を指定
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      // アップロードに失敗した場合、エラーを表示
      alert(error.message);
      return;
    }

    // アップロード成功時、画像のキーをステートに保存
    setThumbnailImageKey(data.path);
  };

  // サムネイル画像のURLを取得する処理
  useEffect(() => {
    if (!thumbnailImageKey) return; // 画像キーが未設定の場合は何もしない

    const fetchThumbnailUrl = async () => {
      // Supabaseから公開URLを取得
      const { data } = supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      if (data?.publicUrl) {
        // 取得したURLをステートに保存
        setThumbnailImageUrl(data.publicUrl);
      }
    };

    fetchThumbnailUrl(); // サムネイルURLを非同期で取得
  }, [thumbnailImageKey]); // thumbnailImageKeyが変化したときに再実行

  // カテゴリーのデータをAPIから取得する処理
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token)
        return
      const res = await fetch("/api/admin/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 認証トークンをヘッダーに追加
        },
      }) // APIを呼び出す
      const { categories } = await res.json(); // 取得したデータをJSONとしてパース
      setCategories(categories); // カテゴリーのリストをステートに保存
    };
    fetchCategories(); // 非同期でカテゴリーを取得
  }, [token]);

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
          rules={{ required: "タイトルは必須です" }}
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                id="title"
                className={`mt-1 block w-full rounded-md border ${fieldState.error ? "border-red-500" : "border-gray-200"
                  } p-3`}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
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
          rules={{ required: "内容は必須です" }}
          render={({ field, fieldState }) => (
            <>
              <textarea
                {...field}
                id="content" rows={5}
                className={`mt-1 block w-full rounded-md border ${fieldState.error ? "border-red-500" : "border-gray-200"
                  } p-3`}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* サムネイル画像 */}
      <div className="mt-4">
        <label htmlFor="thumbnailImageKey" className="block text-sm text-gray-700">
          サムネイル画像 <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={async (event) => {
            await handleImageChange(event); // 画像アップロード処理
          }}
          accept="image/*"
        />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
        <Controller
          name="thumbnailImageKey"
          control={control}
          render={({ field }) => (
            <input type="hidden" {...field} value={thumbnailImageKey} />
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
          }}
          render={({ field, fieldState }) => (
            <>
              <CategoriesSelect
                selectedCategories={field.value}
                setSelectedCategories={field.onChange}
                categories={categories}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
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
