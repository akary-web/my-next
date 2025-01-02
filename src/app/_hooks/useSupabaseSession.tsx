import { supabase } from '@/app/utils/supabase'
import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// カスタムフック: Supabaseのセッション状態を管理する
export const useSupabaseSession = () => {
  // ログイン状態を管理するstate
  // 初期値undefined: ロード中, null: 未ログイン, Session: ログイン中
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  // アクセストークンを管理するstate
  const [token, setToken] = useState<string | null>(null)

  // ローディング状態を管理するstate
  const [isLoding, setIsLoding] = useState(true)

  // コンポーネントがマウントされたときにセッション情報を取得
  useEffect(() => {
    const fetcher = async () => {
      // Supabaseのセッション情報を取得
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // セッション情報をstateに保存
      setSession(session)

      // アクセストークンをstateに保存（セッションが存在しない場合はnull）
      setToken(session?.access_token || null)

      // ローディング状態を解除
      setIsLoding(false)
    }

    // セッション情報取得処理を実行
    fetcher()
  }, [])

  // 現在のセッション、ローディング状態、トークンを返却
  return { session, isLoding, token }
}
