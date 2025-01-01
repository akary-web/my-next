'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

type FormInputs = {
  name: string
}

export default function Page() {
  // URLパラメータからカテゴリーIDを取得
  const { id } = useParams()

  // ルーティングに使うrouterを取得
  const router = useRouter()

  // react-hook-formを使用してフォームを管理
  const {
    register, // フォームの各入力項目にbindする関数
    handleSubmit, // フォーム送信時に呼ばれる関数
    setValue, // フォームの値を手動で設定する関数
    formState: { errors }, // フォームエラーの状態
  } = useForm<FormInputs>()

  // Supabaseセッションからトークンを取得
  const { token } = useSupabaseSession();

  // フォーム送信時の処理
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // サーバーにPUTリクエストを送り、カテゴリーを更新する
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!, // 認証トークンをヘッダーに追加
      },
      body: JSON.stringify(data), // フォームのデータをリクエストボディとして送信
    })

    alert('カテゴリーを更新しました。') // 更新が成功したらアラートを表示
  }

  // カテゴリー削除の処理
  const handleDeletePost = async () => {
    // 削除の確認ダイアログを表示
    if (!confirm('カテゴリーを削除しますか？')) return

    // サーバーにDELETEリクエストを送り、カテゴリーを削除
    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: token!, // 認証トークンをヘッダーに追加
      },
    })

    alert('カテゴリーを削除しました。') // 削除が成功したらアラートを表示
    router.push('/admin/categories') // 削除後、カテゴリー一覧ページに遷移
  }

  // コンポーネントの初回レンダリング時とidやtokenが変わった時に呼ばれる
  useEffect(() => {
    // セッションのトークンがない場合、データの取得をしない
    if (!token) return;

    const fetcher = async () => {
      // カテゴリー詳細を取得するAPIリクエストを送信
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 認証トークンをヘッダーに追加
        },
      });
      const { category } = await res.json() // レスポンスからカテゴリー情報を取得

      // 初期値をフォームに設定
      setValue('name', category.name) // フォームにカテゴリー名を設定
    }

    fetcher() // カテゴリー詳細を取得
  }, [id, setValue, token]) // id、setValue、tokenが変わったときに再実行

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      {/* フォームの送信 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          {/* カテゴリー名の入力欄 */}
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            カテゴリー名
          </label>
          <input
            id="name" // IDをnameに設定
            type="text" // 入力タイプをテキストに設定
            {...register('name', { required: 'カテゴリー名は必須です' })} // react-hook-formで必須項目として検証
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {/* 入力エラーがあれば表示 */}
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* 更新ボタンと削除ボタン */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="shadow-md px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white rounded-md"
          >
            更新
          </button>
          <button
            type="button"
            onClick={handleDeletePost} // 削除ボタンがクリックされたらhandleDeletePostを実行
            className="shadow-md px-4 py-2 bg-red-400 hover:bg-red-600 text-white rounded-md"
          >
            削除
          </button>
        </div>
      </form>
    </div>
  )
}
