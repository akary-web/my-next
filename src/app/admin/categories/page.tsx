'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
// import { Post } from '@/app/_types/Post'
import { Category } from '@/app/_types/Categories'

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch('/api/admin/categories')
        const { categories } = await res.json()
        setCategories(categories)
      } catch (error) {
        console.log('データの取得ができませんでした', error);
      }
    }

    fetcher()
  }, [])

  return (
    <div >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">カテゴリー一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>

      <div>
        {categories.map((category) => {
          return (
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{category.name}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}