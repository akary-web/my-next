'use client'

import Link from 'next/link' // Next.jsのLinkコンポーネントをインポート。ページ遷移に使用
import { useEffect, useState } from 'react' // useEffectとuseStateをインポート。非同期データ取得と状態管理に使用
import { Post } from '@/app/_types/Post' // 投稿データの型をインポート
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession' // Supabaseセッションを管理するカスタムフックをインポート

export default function Page() {
  // 投稿データを格納するステート。Post型の配列として初期化
  const [posts, setPosts] = useState<Post[]>([])

  // Supabaseのセッション情報（トークン）を取得
  const { token } = useSupabaseSession();

  // tokenが存在する場合にAPIから投稿データを取得する処理
  useEffect(() => {
    // トークンがない場合、何もせず終了
    if (!token) return;

    // 非同期関数fetcherを定義して投稿データを取得
    const fetcher = async () => {
      try {
        // APIエンドポイント`/api/admin/posts`にGETリクエストを送信
        const res = await fetch("/api/admin/posts", {
          headers: {
            "Content-Type": "application/json", // リクエストヘッダーにContent-Typeを指定
            Authorization: token, // リクエストヘッダーにAuthorizationトークンを追加
          },
        });
        // レスポンスをJSON形式で受け取り、投稿データを`posts`として抽出
        const { posts } = await res.json();
        // 受け取った投稿データを`posts`ステートに設定
        setPosts([...posts]);
      } catch (error) {
        // エラーハンドリング：データ取得に失敗した場合のエラーメッセージ
        console.log('データの取得ができませんでした', error);
      }
    }

    fetcher() // `fetcher`関数を実行してデータを取得
  }, [token]) // `token`が変更された場合にこのエフェクトを再実行

  return (
    <div>
      {/* 記事一覧のタイトルと新規作成ボタン */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1> {/* 見出し：記事一覧 */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/posts/new">新規作成</Link> {/* 新しい記事を作成するためのリンク */}
        </button>
      </div>

      {/* 投稿データをリストとして表示 */}
      <div>
        {posts.map((post) => {
          return (
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{post.title}</div>
                <div className="text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
