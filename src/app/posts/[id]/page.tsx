"use client";

import React, { useState, useEffect } from 'react'; // Reactのフックである`useState`と`useEffect`をインポート
import { useParams } from 'next/navigation'; // `useParams`を使ってURLパラメータを取得
import styles from './postsDetail.module.css'; // CSSモジュールをインポート
import Image from 'next/image'; // 画像表示のための`Image`コンポーネントをインポート
import { Post } from '@/app/_types/Post'; // `Post`型をインポート。投稿データの型を定義
import { supabase } from '@/app/utils/supabase'; // Supabaseの設定をインポート

const PostsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URLの`id`パラメータを取得。記事のID
  const [post, setPost] = useState<Post | null>(null); // 投稿データを格納するステート。初期値はnull
  const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態を管理するステート
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null); // サムネイル画像のURLを格納するステート

  // 投稿データをAPIから取得する処理
  useEffect(() => {
    // 非同期関数`fetcher`を定義
    const fetcher = async () => {
      setIsLoading(true); // 読み込み中の状態にする
      try {
        // `/api/posts/${id}` というAPIにGETリクエストを送信
        const res = await fetch(`/api/posts/${id}`);
        const { post } = await res.json(); // レスポンスから投稿データを取得
        setPost(post); // 取得した投稿データを`post`ステートに格納
      } catch (error) {
        console.error(error); // エラーが発生した場合はコンソールに表示
        setPost(null); // 投稿データが取得できなかった場合、`post`ステートをnullに設定
      } finally {
        setIsLoading(false); // ローディングが終了したことを示す
      }
    };

    fetcher(); // `fetcher`関数を実行
  }, [id]); // `id`が変わった時に再実行されるように依存配列に`id`を設定

  // 投稿のサムネイル画像URLを取得する処理
  useEffect(() => {
    // 投稿が存在し、かつ`thumbnailImageKey`が設定されていれば
    if (!post?.thumbnailImageKey) return;

    const fetcher = async () => {
      // Supabaseのストレージから画像の公開URLを取得
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail") // `post_thumbnail`というバケットから画像を取得
        .getPublicUrl(post.thumbnailImageKey); // 画像のキーを指定して公開URLを取得

      setThumbnailImageUrl(publicUrl); // 取得した公開URLを`thumbnailImageUrl`ステートに格納
    };

    fetcher(); // `fetcher`関数を実行
  }, [post?.thumbnailImageKey]); // `post.thumbnailImageKey`が変更されたときに実行される

  // 記事データが読み込まれているかどうかの状態で表示を分ける
  if (isLoading) {
    return <div>・・・読み込み中です・・・</div>; // ローディング中は「読み込み中です」というメッセージを表示
  }

  // 投稿が見つからなかった場合、エラーメッセージを表示
  if (!post) {
    return <div>投稿が見つかりませんでした。</div>;
  }

  // 投稿が正常に取得できた場合、詳細情報を表示
  return (
    <div className={styles.detail_container}>
      {/* サムネイル画像を表示 */}
      <Image
        className={styles.detail_thumbnail}
        src={thumbnailImageUrl || '/default-image.png'} // サムネイルが存在しない場合はデフォルト画像を表示
        alt={post.title} // 画像の代替テキストに投稿のタイトルを設定
        width={800} // 画像の幅
        height={400} // 画像の高さ
      />
      <div className={styles.detail_detail}>
        <div className={styles.detail_info}>
          {/* 投稿の作成日を表示 */}
          <p className={styles.detail_date}>
            {new Date(post.createdAt).toLocaleDateString()} {/* 投稿日をローカル日付形式で表示 */}
          </p>
          {/* 投稿が属するカテゴリをリスト表示 */}
          <ul className={styles.detail_cate}>
            {post.postCategories?.map((pc) => (
              <li className={styles.detail_item} key={pc.category.id}>{pc.category.name}</li> // カテゴリー名を表示
            ))}
          </ul>
        </div>
        {/* 投稿タイトルを表示 */}
        <h2 className={styles.detail_title}>{post.title}</h2>
        {/* 投稿内容をHTMLとして表示 */}
        <div className={styles.detail_text} dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default PostsDetail;
