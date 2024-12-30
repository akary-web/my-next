'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname(); // 現在のパスを取得する

  return (
    <div className="flex">
      {/* サイドバー */}
      <aside className="sticky top-[72px] bg-gray-100 w-[280px] h-screen">
        <Link
          href="/admin/posts"
          className={`p-4 block ${pathname === '/admin/posts' ? 'bg-blue-200' : 'hover:bg-blue-100'
            }`}
        >
          記事一覧
        </Link>
        <Link
          href="/admin/categories"
          className={`p-4 block ${pathname === '/admin/categories' ? 'bg-blue-200' : 'hover:bg-blue-100'
            }`}
        >
          カテゴリー 一覧
        </Link>
      </aside>

      {/* メインコンテンツ */}
      <div className="p-4 overflow-y-auto h-screen w-screen">
        {children}
      </div>
    </div>
  )
}
