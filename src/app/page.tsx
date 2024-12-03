"use client";  // クライアントサイド実行指定

import React, { useState, useEffect } from 'react';
import styles from './postsList.module.css';
import Link from 'next/link'; // react-router-domから変更

// APIデータの型定義
interface Post {
  id: number;
  title: string;
  createdAt: string; // 日付はISO文字列
  categories: string[]; // カテゴリは文字列配列
  content: string;
}
const Home: React.FC = () => {
  // useStateに型を追加
  const [posts, setPosts] = useState<Post[]>([]); // 初期値は空配列
  const [isLoading, setIsLoading] = useState<boolean>(true); // boolean型

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);

      try {
        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts");
        const data = await res.json();
        setPosts(data.posts)
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, []);


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
                  <li className={styles.cate_item} key={index}>{cate}</li>
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