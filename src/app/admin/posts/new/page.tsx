"use client";

import { useRouter } from "next/navigation"; // ルーティング用
import { PostForm } from "@/app/admin/posts/_components/PostForm"; // 投稿フォームコンポーネント
import { useForm } from "react-hook-form"; // フォームの管理用フック
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"; // Supabaseセッション管理のカスタムフック
import { PostFormValues } from "@/app/_types/Post"; // フォームのデータ型定義
import { useState } from "react"; // ReactのuseStateフック

export default function PageNew() {
  const router = useRouter(); // ルーターのインスタンスを取得
  const { token } = useSupabaseSession(); // 現在のSupabaseセッションからトークンを取得

  // React Hook Formを使用してフォームの管理を行う
  const { control, handleSubmit } = useForm<PostFormValues>({
    defaultValues: {
      title: "", // タイトルの初期値
      content: "", // 内容の初期値
      thumbnailImageKey: "", // サムネイル画像のキー初期値
      categories: [], // カテゴリー初期値
    },
  });

  // サムネイル画像キーを管理するためのstate
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string>("");

  // フォーム送信時の処理
  const onSubmit = async (data: PostFormValues) => {
    try {
      // 送信するデータをまとめる
      const body = {
        title: data.title, // タイトル
        content: data.content, // 内容
        thumbnailImageKey, // サムネイル画像のキー
        categories: data.categories, // 選択されたカテゴリー
      };

      // 投稿作成APIを呼び出す
      const res = await fetch("/api/admin/posts", {
        method: "POST", // POSTメソッドでデータ送信
        headers: {
          "Content-Type": "application/json", // JSONデータを送信
          Authorization: token!, // 認証用トークンをヘッダーに追加
        },
        body: JSON.stringify(body), // データをJSONとして送信
      });

      // APIレスポンスから作成された投稿IDを取得
      const { id } = await res.json();
      
      // 作成した投稿ページにリダイレクト
      router.push(`/admin/posts/${id}`);

      // 投稿作成完了のメッセージを表示
      alert("記事を作成しました。");
    } catch (error) {
      // エラーハンドリング
      console.log("データを取得できませんでした。", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1> {/* ページタイトル */}
      </div>

      {/* PostFormコンポーネントを表示、記事作成用のフォーム */}
      <PostForm
        mode="new" // 新規作成モード
        control={control} // React Hook Formのcontrolを渡す
        onSubmit={handleSubmit(onSubmit)} // フォーム送信時の処理を指定
        setThumbnailImageKey={setThumbnailImageKey} // サムネイル画像キーを設定する関数を渡す
        thumbnailImageKey={thumbnailImageKey} // 現在のサムネイル画像キーを渡す
      />
    </div>
  );
}
