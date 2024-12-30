"use client";  // クライアントサイド実行指定

import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import Link from 'next/link';
import { Post } from './_types/Post';


const Home: React.FC = () => {
  // useStateに型を追加
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true); // ローディング開始
      try {
        const res = await fetch("/api/posts");
        const { posts } = await res.json();
        setPosts(posts);
      } catch (error) {
        console.error("データ取得に失敗しました:", error);
      } finally {
        setIsLoading(false); // ローディング終了
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
                {post.postCategories?.map((pc) => (
                  <li className={styles.cate_item} key={pc.category.id}>{pc.category.name}</li>
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