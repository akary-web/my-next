import { Category } from "./Categories";

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  postCategories: { category: Category }[]
  thumbnailImageKey: string
}

export interface PostFormValues {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
}