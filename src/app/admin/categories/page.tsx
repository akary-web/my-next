'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Category } from '@/app/_types/Categories' // `Category`型をインポート。カテゴリーデータの型を定義
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession' // Supabaseセッションを取得するカスタムフックをインポート

export default function Page() {
  // `categories`ステート変数を作成。カテゴリーのリストを保持するために使用
  const [categories, setCategories] = useState<Category[]>([]);

  // `useSupabaseSession`フックを使用して、現在のSupabaseセッションから`token`を取得
  const { token } = useSupabaseSession();

  // `useEffect`を使用して、`token`が変更されるたびに実行される副作用を設定
  useEffect(() => {
    // トークンがない場合、データの取得を行わない
    if (!token) return;

    // 非同期関数`fetcher`を定義して、カテゴリー情報をAPIから取得する
    const fetcher = async () => {
      try {
        // カテゴリーを取得するためのAPIリクエストを送信
        const res = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json", // JSON形式のリクエストボディを送信
            Authorization: token, // 認証用のトークンをヘッダーに追加
          },
        });

        // レスポンスからカテゴリーのデータを取得
        const { categories } = await res.json();

        // 取得したカテゴリー情報を`categories`ステートにセット
        setCategories(categories);
      } catch (error) {
        // エラーハンドリング：データの取得が失敗した場合にエラーメッセージをログに出力
        console.log('データの取得ができませんでした', error);
      }
    }

    // `fetcher`関数を実行してデータを取得
    fetcher();
  }, [token]); // `token`が変更された場合に再実行される

  return (
    <div >
      {/* タイトルと新規作成ボタンを表示 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">カテゴリー 一覧</h1>
        {/* 新しいカテゴリーを作成するリンクを持つボタン */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>

      {/* カテゴリーリストを表示 */}
      <div>
        {categories.map((category) => {
          return (
            // 各カテゴリーのリンクを作成。クリックするとカテゴリーの詳細ページに遷移
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                {/* カテゴリー名を表示 */}
                <div className="text-xl font-bold">{category.name}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
