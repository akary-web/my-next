"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './postsDetail.module.css';
import Image from 'next/image';
import { Post } from '@/app/_types/Post';


const PostsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`)
        const { post } = await res.json()
        setPost(post)
      } catch (error) {
        console.error(error);
        setPost(null);
      } finally {
        setIsLoading(false)
      }
    };

    fetcher()
  }, [id])

  // 記事取得中は、読み込み中であることを表示します。
  if (isLoading) {
    return <div>・・・読み込み中です・・・</div>
  }

  // 記事が見つからなかった場合は、記事が見つからないことを表示します。
  if (!post) {
    return <div>投稿が見つかりませんでした。</div>
  }

  return (
    <div className={styles.detail_container}>
      <Image className={styles.detail_thumbnail} src={post.thumbnailUrl} alt={post.title} width={800} height={400} />
      <div className={styles.detail_detail}>
        <div className={styles.detail_info}>
          <p className={styles.detail_date}>{new Date(post.createdAt).toLocaleDateString()}</p>
          <ul className={styles.detail_cate}>
            {post.postCategories?.map((pc) => (
              <li className={styles.detail_item} key={pc.category.id}>{pc.category.name}</li>
            ))}
          </ul>
        </div>
        <h2 className={styles.detail_title}>{post.title}</h2>
        <div className={styles.detail_text} dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default PostsDetail;
