// 管理者_記事一覧取得API
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabase'

const prisma = new PrismaClient() // Prismaクライアントのインスタンスを作成

// GETリクエスト: 記事の一覧を取得するAPI
export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '' // Authorizationヘッダーからトークンを取得

  // Supabaseでトークンを検証してユーザーを認証
  const { error } = await supabase.auth.getUser(token)

  // トークンが無効の場合、400ステータスとエラーメッセージを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // トークンが有効な場合、以下の処理を実行
  try {
    // Prismaを使って記事データを取得
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true, // カテゴリーIDを取得
                name: true, // カテゴリー名を取得
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 作成日時の降順で並び替え
      },
    })

    // 成功時に記事一覧をレスポンスとして返す
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
  } catch (error) {
    // エラーハンドリング: エラー内容を400ステータスで返す
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// 管理者_記事新規作成API
// 記事作成時に送られてくるリクエストボディの型定義
interface CreatePostRequestBody {
  title: string // 記事タイトル
  content: string // 記事内容
  categories: { id: number }[] // 記事に紐づくカテゴリーのIDリスト
  thumbnailImageKey: string // サムネイル画像のキー
}

// POSTリクエスト: 記事を新規作成するAPI
export const POST = async (request: Request, context: any) => {
  try {
    // リクエストボディをJSON形式で取得
    const body = await request.json()

    // ボディから必要なデータを取り出す
    const { title, content, categories, thumbnailImageKey }: CreatePostRequestBody = body

    // Prismaを使って記事データを作成
    const data = await prisma.post.create({
      data: {
        title, // 記事タイトル
        content, // 記事内容
        thumbnailImageKey, // サムネイル画像のキー
      },
    })

    // 記事とカテゴリーの中間テーブル(postCategories)のレコードを作成
    // SQLiteではcreateManyが使用できないため、for文で1件ずつ処理
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id, // 紐づけるカテゴリーID
          postId: data.id, // 作成した記事のID
        },
      })
    }

    // 成功時に作成した記事のIDをレスポンスとして返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    // エラーハンドリング: エラー内容を400ステータスで返す
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}
