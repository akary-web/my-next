// 投稿の詳細データの型を定義
export interface MicroCmsPost {
  // id: number;
  // title: string;
  // content: string;
  // createdAt: string;
  // thumbnailUrl: string;
  // categories: string[];
  id: string
  title: string
  content: string
  createdAt: string
  categories: { id: string; name: string }[]
  thumbnail: { url: string; height: number; width: number }
};
