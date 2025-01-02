'use client'

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form'; // `react-hook-form`から`useForm`と`SubmitHandler`をインポート。フォームの管理を簡単にするライブラリ。
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';// カスタムフックをインポートして、Supabaseのセッション情報を取得

type FormInputs = {
  name: string // フォームに入力する項目の型定義。今回は`name`のみ。
}

export default function Page() {
  // `useRouter`フックを使って、ルーティングを制御
  const router = useRouter()

  // `useForm`フックを使ってフォームの入力管理
  const {
    register, // フォーム要素に適用するメソッド
    handleSubmit, // フォーム送信時の処理を管理
    formState: { errors }, // フォームのエラーステートを管理
    reset, // フォームのリセットメソッド
  } = useForm<FormInputs>()

  // Supabaseセッションからトークンを取得
  const { token } = useSupabaseSession(); // セッションがない場合は`token`は`undefined`になる

  // フォームが送信された時に呼ばれる`onSubmit`関数
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // カテゴリー作成のためのAPIリクエストを送信
      const res = await fetch('/api/admin/categories', {
        method: 'POST', // HTTPメソッドはPOST
        headers: {
          'Content-Type': 'application/json', // リクエストボディの形式をJSONとして指定
          Authorization: token!, // セッションから取得したトークンをAuthorizationヘッダーに追加
        },
        body: JSON.stringify(data), // フォームデータ（`name`）をJSON形式に変換してリクエストボディに設定
      })

      // レスポンスが正常でない場合（例: 400、500エラーなど）はエラーをスロー
      if (!res.ok) {
        throw new Error('カテゴリー作成中にエラーが発生しました') // エラーメッセージをスロー
      }

      // 成功した場合、レスポンスから作成したカテゴリーのIDを取得
      const { id } = await res.json()

      // 作成したカテゴリーの詳細ページに遷移する
      router.push(`/admin/categories/${id}`) // ルーターを使って詳細ページに遷移
      alert('カテゴリーを作成しました。') // ユーザーに成功メッセージを表示
    } catch (error) {
      // エラーが発生した場合、エラーメッセージを表示
      if (error instanceof Error) {
        alert(`エラー: ${error.message}`)
      } else {
        alert('不明なエラーが発生しました') // 他のエラーの場合
      }
    } finally {
      // フォーム送信後、フォームの内容をリセット（初期化）
      reset()
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>

      {/* フォームを作成し、送信時に`handleSubmit`で`onSubmit`関数を呼び出す */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            カテゴリー名<span className="text-red-500">*</span> {/* `name`フィールドは必須 */}
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'カテゴリー名は必須です', maxLength: { value: 50, message: '50文字以内で入力してください' } })} // 入力のバリデーションを設定
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {/* エラーメッセージがあれば表示 */}
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          作成する
        </button>
      </form>
    </div>
  )
}
