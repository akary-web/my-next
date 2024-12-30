'use client'

import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'

type FormInputs = {
  name: string
}

export default function Page() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // カテゴリーを作成する。
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('カテゴリー作成中にエラーが発生しました')
      }

      // レスポンスから作成したカテゴリーのIDを取得。
      const { id } = await res.json()

      // 作成したカテゴリーの詳細ページに遷移。
      router.push(`/admin/categories/${id}`)
      alert('カテゴリーを作成しました。')
    } catch (error) {
      if (error instanceof Error) {
        alert(`エラー: ${error.message}`)
      } else {
        alert('不明なエラーが発生しました')
      }
    } finally {
      // フォームの入力をリセット。
      reset()
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            カテゴリー名<span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'カテゴリー名は必須です', maxLength: { value: 50, message: '50文字以内で入力してください' } })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

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
