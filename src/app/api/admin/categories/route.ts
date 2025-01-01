// 管理者_カテゴリー一覧取得API
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from "@/app/utils/supabase";

const prisma = new PrismaClient() // Prismaクライアントのインスタンスを作成

// GETリクエスト: カテゴリー一覧を取得するAPI
export const GET = async (request: NextRequest) => {
  try {
    // リクエストヘッダーから認証トークンを取得
    const token = request.headers.get("Authorization") ?? "";

    // トークンを使用してSupabaseユーザーを認証
    const { error } = await supabase.auth.getUser(token);

    // 認証エラーの場合は400ステータスを返す
    if (error) {
      return NextResponse.json({ state: error.message }, { status: 400 });
    }

    // データベースからカテゴリーの一覧を取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc', // 作成日時の降順でソート
      },
    });

    // 正常時のレスポンスを返す
    return NextResponse.json({ status: 'OK', categories }, { status: 200 });
  } catch (error) {
    // エラーハンドリング: エラー内容を400ステータスで返す
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

// 管理者_カテゴリー新規作成API
// カテゴリー作成時のリクエストボディの型
interface CreateCategoryRequestBody {
  name: string; // カテゴリー名
}

// POSTリクエスト: 新しいカテゴリーを作成するAPI
export const POST = async (request: Request) => {
  // リクエストヘッダーから認証トークンを取得
  const token = request.headers.get("Authorization") ?? "";

  // トークンを使用してSupabaseユーザーを認証
  const { error } = await supabase.auth.getUser(token);

  // 認証エラーの場合は400ステータスを返す
  if (error) {
    return NextResponse.json({ state: error.message }, { status: 400 });
  }

  try {
    // リクエストボディをJSON形式で取得
    const body = await request.json();

    // リクエストボディからカテゴリー名を取り出す
    const { name }: CreateCategoryRequestBody = body;

    // Prismaを使用して新しいカテゴリーをデータベースに作成
    const data = await prisma.category.create({
      data: {
        name, // 取得したカテゴリー名を保存
      },
    });

    // 正常時のレスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました', // 成功メッセージ
      id: data.id, // 作成したカテゴリーのID
    });
  } catch (error) {
    // エラーハンドリング: エラー内容を400ステータスで返す
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
