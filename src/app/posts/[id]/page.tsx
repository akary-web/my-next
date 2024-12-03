"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';  // 修正点
import styles from '../../_styles/postsDetail.module.css';
import Image from 'next/image';

// 投稿の詳細データの型を定義
interface PostDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  thumbnailUrl: string;
  categories: string[];
}

const PostsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // useRouterの代わりにuseParamsを使用
  const [detailPost, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, [id]);

  if (isLoading) {
    return <div>・・・読み込み中です・・・</div>;
  }

  if (!detailPost) {
    return <div>投稿が見つかりませんでした。</div>;
  }

  return (
    <div className={styles.detail_container}>
      <Image className={styles.detail_thumbnail} src={detailPost.thumbnailUrl} alt={detailPost.title} width={800} height={400} />
      <div className={styles.detail_detail}>
        <div className={styles.detail_info}>
          <p className={styles.detail_date}>{new Date(detailPost.createdAt).toLocaleDateString()}</p>
          <ul className={styles.detail_cate}>
            {detailPost.categories.map((cate, index) => (
              <li className={styles.detail_item} key={index}>{cate}</li>
            ))}
          </ul>
        </div>
        <h2 className={styles.detail_title}>{detailPost.title}</h2>
        <div className={styles.detail_text} dangerouslySetInnerHTML={{ __html: detailPost.content }} />
      </div>
    </div>
  );
};

export default PostsDetail;
