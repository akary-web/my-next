'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'

type FormInputs = {
  name: string
}

export default function Page() {
  const { id } = useParams()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // カテゴリーを更新します。
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    alert('カテゴリーを更新しました。')
  }

  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return

    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    })

    alert('カテゴリーを削除しました。')
    router.push('/admin/categories')
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`)
      const { category } = await res.json()

      // 初期値をフォームに設定します。
      setValue('name', category.name)
    }

    fetcher()
  }, [id, setValue])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            カテゴリー名
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'カテゴリー名は必須です' })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="shadow-md px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white rounded-md"
          >
            更新
          </button>
          <button
            type="button"
            onClick={handleDeletePost}
            className="shadow-md px-4 py-2 bg-red-400 hover:bg-red-600 text-white rounded-md"
          >
            削除
          </button>
        </div>
      </form>
    </div>
  )
}
