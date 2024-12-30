import { Category } from "./Categories";

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  postCategories: { category: Category }[]
  thumbnailUrl: string
}
