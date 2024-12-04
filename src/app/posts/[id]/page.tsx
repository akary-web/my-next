"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './postsDetail.module.css';
import Image from 'next/image';
import { MicroCmsPost } from '../../_types/MicrCmsPost';



const PostsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<MicroCmsPost | null>(null);// ステート名をpostに変更
  const [isLoading, setIsLoading] = useState<boolean>(false);//  useEffect内、setIsLoading(true);とするなら、最初はfalseでOK

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://ravlkryk2h.microcms.io/api/v1/posts/${id}`, { // microCMSのエンドポイント
          headers: {
            'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,  // 追加：環境変数 microCMS APIキー
          },
        });
        const data = await res.json();
        setPost(data);// microCMSはそのままのデータを格納
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

  if (!post) {
    return <div>投稿が見つかりませんでした。</div>;
  }

  return (
    <div className={styles.detail_container}>
      <Image className={styles.detail_thumbnail} src={post.thumbnail.url} alt={post.title} width={post.thumbnail.width} height={post.thumbnail.height} />
      {/* ↑修正: 正しいプロパティを使用 */}
      <div className={styles.detail_detail}>
        <div className={styles.detail_info}>
          <p className={styles.detail_date}>{new Date(post.createdAt).toLocaleDateString()}</p>
          <ul className={styles.detail_cate}>
            {post.categories.map((cate, index) => (
              <li className={styles.detail_item} key={cate.id}>{cate.name}</li>// categories 配列の name を表示し、key に id を使用。
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
