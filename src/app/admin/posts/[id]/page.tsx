"use client"; // クライアントサイドで動作するコンポーネント

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // URLパラメータやルーティングに使用
import { PostForm } from "@/app/admin/posts/_components/PostForm"; // 投稿フォームコンポーネント
import { Category } from "@/app/_types/Categories"; // カテゴリー型
import { useForm } from "react-hook-form"; // React Hook Formのフック
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"; // Supabaseセッションを管理するカスタムフック
import { Post, PostFormValues } from "@/app/_types/Post"; // フォームの型定義

// 記事編集ページコンポーネント
export default function Page() {
  const { id } = useParams(); // URLから投稿IDを取得
  const router = useRouter(); // ルーティング操作用
  const { token } = useSupabaseSession(); // Supabaseセッションからトークンを取得

  // React Hook Formの設定
  const { control, handleSubmit, setValue, watch } = useForm<PostFormValues>({
    defaultValues: {
      title: "", // タイトルの初期値
      content: "", // 内容の初期値
      thumbnailImageKey: "", // サムネイル画像キーの初期値
      categories: [], // カテゴリーの初期値
    },
  });

  // フォーム状態からサムネイル画像キーを取得
  const thumbnailImageKey = watch("thumbnailImageKey");

  // フォーム送信時の処理
  const onSubmit = async (data: PostFormValues) => {
    try {
      const body = {
        title: data.title, // フォームから取得したタイトル
        content: data.content, // フォームから取得した内容
        thumbnailImageKey, // watch を使用して取得した値
        categories: data.categories, // 選択されたカテゴリー
      };

      // 記事の更新APIを呼び出し
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!, // 認証トークンをヘッダーに追加
        },
        body: JSON.stringify(body), // データをJSONとして送信
      });

      alert("記事を更新しました。"); // 成功メッセージ
    } catch (error) {
      console.error("記事の更新に失敗しました。", error); // エラーメッセージを出力
    }
  };

  // 記事削除時の処理
  const handleDelete = async () => {
    try {
      if (!confirm("記事を削除しますか？")) return; // ユーザーに確認を促す

      // 削除APIを呼び出し
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });

      alert("記事を削除しました。"); // 成功メッセージ
      router.push("/admin/posts"); // 投稿一覧ページにリダイレクト
    } catch (error) {
      console.error("記事の削除に失敗しました。", error); // エラーメッセージを出力
    }
  };

  // 記事データの取得処理
  useEffect(() => {
    if (!token) return; // トークンが未取得の場合は何もしない

    const fetchPostData = async () => {
      // 記事データを取得
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 認証トークンをヘッダーに追加
        },
      });

      const result = await res.json(); // APIレスポンスのボディをJSON形式で解析して、result変数に格納

      if (result && result.post) {
        const { post }: { post: Post } = result;

        // フォームの値をセット
        setValue("title", post.title);
        setValue("content", post.content);
        setValue("thumbnailImageKey", post.thumbnailImageKey); // サムネイル画像キーをセット
        setValue("categories", post.postCategories.map((pc) => pc.category) as Category[]);
      } else {
        console.error("Post not found or error in fetching data"); // データ取得失敗時のエラーメッセージ
      }
    };

    fetchPostData(); // 記事データを取得
  }, [id, setValue, token]); // 依存関係が変化したときに再実行

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      {/* PostFormコンポーネントの呼び出し */}
      <PostForm
        mode="edit" // 編集モードを指定
        control={control} // React Hook FormのControlを渡す
        onSubmit={handleSubmit(onSubmit)} // フォーム送信時の処理
        onDelete={handleDelete} // 削除ボタンの動作を指定
        setThumbnailImageKey={(key) => setValue("thumbnailImageKey", key)} // サムネイル画像キー設定関数をフォームに反映
        thumbnailImageKey={thumbnailImageKey} // フォーム状態から取得したサムネイル画像キーを渡す
      />
    </div>
  );
}

// 独立した useState を削除し、React Hook Form の watch を使って値を取得
// サムネイル画像キーを更新する時、React Hook Form の setValue を使用
// フォーム状態にある thumbnailImageKey をリアルタイムで取得（watchを活用）
// setThumbnailImageKey は setValue を使う形にする（PostForm コンポーネント）
