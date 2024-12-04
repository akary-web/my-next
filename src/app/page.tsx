"use client";  // クライアントサイド実行指定

import React, { useState, useEffect } from 'react';
import styles from './postsList.module.css';
import Link from 'next/link'; // react-router-domから変更
import { MicroCmsPost } from './_types/MicrCmsPost';

// APIデータの型定義
// interface Post {
//   id: number;
//   title: string;
//   createdAt: string; // 日付はISO文字列
//   categories: string[]; // カテゴリは文字列配列
//   content: string;
// }
//移動

const Home: React.FC = () => {
  // useStateに型を追加
  const [posts, setPosts] = useState<MicroCmsPost[]>([]); // 初期値は空配列
  const [isLoading, setIsLoading] = useState<boolean>(false); // boolean型

  // useEffect(() => {
  //   const fetcher = async () => {
  //     setIsLoading(true);

  //     try {
  //       const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts");
  //       const data = await res.json();
  //       setPosts(data.posts)
  //     } catch (error) {
  //       console.error("データの取得に失敗しました:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetcher();
  // }, []);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);  // 開始時にtrue
      try {
        const res = await fetch('https://ravlkryk2h.microcms.io/api/v1/posts', {// 管理画面で取得したエンドポイントを入力してください。
          headers: {// fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
            'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string, // 管理画面で取得したAPIキーを入力してください。
          },
        })
        const { contents } = await res.json()
        setPosts(contents)
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);  // 取得後にfalse
      }
    };

    fetcher()
  }, [])

  if (isLoading) {
    return <div>・・・読み込み中です・・・</div>;
  }

  if (posts.length === 0) {
    return <div>投稿が見つかりませんでした。</div>;
  }

  return (
    <div className={styles.post_container}>
      {posts.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <div className={styles.post_list}>
            <div className={styles.post_info}>
              <p className={styles.post_date}>{new Date(post.createdAt).toLocaleDateString()}</p>
              <ul className={styles.post_cate}>
                {post.categories.map((cate, index) => (
                  <li className={styles.cate_item} key={index}>{cate.name}</li>
                ))}
              </ul>
            </div>
            <h2 className={styles.post_title}>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;