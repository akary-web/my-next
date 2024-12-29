"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "@/app/admin/posts/_components/PostForm";
import { Category } from "@/app/_types/Categories";
import { Post } from "@/app/_types/Post";
import { useForm } from "react-hook-form";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  // const [categories, setCategories] = useState<Category[]>([]);

  // react-hook-formのuseFormフック
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      content: "",
      thumbnailUrl: "",
      categories: [] as Category[], // カテゴリの型を明示
    },
  });

  // const selectedCategories = watch("categories"); // カテゴリの変更を監視

  const onSubmit = async (data: any) => {
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      alert("記事を更新しました。");
    } catch (error) {
      console.log("記事の更新に失敗しました。", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!confirm("記事を削除しますか？")) return;

      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      alert("記事を削除しました。");
      router.push("/admin/posts");
    } catch (error) {
      console.log("記事の削除に失敗しました。", error);
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      const { post }: { post: Post } = await res.json();

      setValue("title", post.title);
      setValue("content", post.content);
      setValue("thumbnailUrl", post.thumbnailUrl);
      // postCategories から category を抽出して categories に設定
      setValue("categories", post.postCategories.map((pc) => pc.category) as Category[]);
    };
    fetchPostData();
  }, [id, setValue]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const res = await fetch("/api/admin/categories");
  //     const { categories } = await res.json();
  //     setCategories(categories);
  //   };
  //   fetchCategories();
  // }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        control={control}
        onSubmit={handleSubmit(onSubmit)}
        onDelete={handleDelete}
      />

    </div>
  );
}

// カテゴリーデータ取得を PostForm 内に統合:
// PostForm の使用箇所で重複したデータ取得処理が不要になる。
// mode プロパティ追加: "new" か "edit" を明示することで動作を切り替え。
