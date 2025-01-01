import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// カスタムフック: 認証状態を確認し、未認証の場合にログインページへリダイレクト
export const useRouteGuard = () => {
  // Next.jsのルーターを取得
  const router = useRouter()

  // Supabaseセッション情報を取得
  const { session } = useSupabaseSession()

  // セッション状態を監視して処理を実行
  useEffect(() => {
    // sessionがundefinedの場合はセッション情報を読み込み中なので何もしない
    if (session === undefined) return

    // 非同期処理でログインチェックを行う
    const fetcher = async () => {
      // sessionがnullの場合、未ログイン状態とみなしてログインページへリダイレクト
      if (session === null) {
        router.replace('/login') // replace: ページ遷移履歴を残さない
      }
    }

    // ログイン状態を確認する関数を実行
    fetcher()
  }, [router, session]) // routerとsessionが変更されたときにuseEffectを再実行
}
