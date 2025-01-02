// 管理者_カテゴリー詳細取得API
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/app/utils/supabase'

const prisma = new PrismaClient() // Prismaクライアントのインスタンスを作成

// GETリクエスト: 特定のカテゴリー詳細を取得するAPI
export const GET = async (
  request: NextRequest, // HTTPリクエストオブジェクト
  { params }: { params: { id: string } }, // URLパラメータから`id`を受け取る
) => {
  const { id } = params; // パラメータからカテゴリーIDを取得
  const token = request.headers.get("Authorization") ?? ""; // Authorizationヘッダーからトークンを取得

  // トークンを使用してSupabaseユーザーを認証
  const { error } = await supabase.auth.getUser(token);

  // 認証エラーの場合、400ステータスとエラーメッセージを返す
  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    // Prismaを使用して特定のIDのカテゴリーを取得
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id), // IDは整数型として指定
      },
    });

    // 成功時にカテゴリー詳細をレスポンスとして返す
    return NextResponse.json({ status: 'OK', category }, { status: 200 });
  } catch (error) {
    // エラーハンドリング: エラー内容を400ステータスで返す
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
}

// 管理者_カテゴリー更新API
// カテゴリー更新時に送られてくるリクエストボディの型
interface UpdateCategoryRequestBody {
  name: string; // 新しいカテゴリー名
}

// PUTリクエスト: 特定のカテゴリーを更新するAPI
export const PUT = async (
  request: NextRequest, // HTTPリクエストオブジェクト
  { params }: { params: { id: string } }, // URLパラメータから`id`を受け取る
) => {
  const { id } = params; // パラメータからカテゴリーIDを取得

  // リクエストボディをJSON形式で取得し、nameを取り出す
  const { name }: UpdateCategoryRequestBody = await request.json();
  const token = request.headers.get("Authorization") ?? ""; // Authorizationヘッダーからトークンを取得

  // トークンを使用してSupabaseユーザーを認証
  const { error } = await supabase.auth.getUser(token);

  // 認証エラーの場合、400ステータスとエラーメッセージを返す
  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    // Prismaを使用して特定のIDのカテゴリーを更新
    const category = await prisma.category.update({
      where: {
        id: parseInt(id), // 更新するカテゴリーのID
      },
      data: {
        name, // 新しいカテゴリー名を設定
      },
    });

    // 成功時に更新後のカテゴリー情報をレスポンスとして返す
    return NextResponse.json({ status: 'OK', category }, { status: 200 });
  } catch (error) {
    // エラーハンドリング: エラー内容を400ステータスで返す
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
}
