"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// フォームの入力データの型を定義
interface IFormInput {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInput>(); // useForm に型を渡す

  // フォーム送信処理
  const onSubmit: SubmitHandler<IFormInput> = async (data) => { // SubmitHandler を使って型安全を確保
    try {
      const response = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }
      alert("送信しました"); // 送信完了のアラート
      reset(); // フォーム内容をクリア
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <form className="py-10 max-w-3xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold leading-relaxed mb-10">問合わせフォーム</h1>
      <div className="flex items-center justify-between mb-6">
        <label className="w-[240px]">お名前</label>
        <div className="w-full">
          <input className="w-full p-4 border border-gray-300 rounded-lg"
            type="text"
            {...register("name", {
              required: "お名前は必須です。",
              maxLength: {
                value: 30,
                message: "お名前は30文字以内で入力してください。",
              },
            })}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-700 text-sm">{errors.name.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <label className="w-[240px]">メールアドレス</label>
        <div className="w-full">
          <input className="w-full p-4 border border-gray-300 rounded-lg"
            type="email"
            {...register("email", {
              required: "メールアドレスは必須です。",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "正しいメールアドレスを入力してください。",
              },
            })}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-700 text-sm">{errors.email.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <label className="w-[240px]">本文</label>
        <div className="w-full">
          <textarea className="w-full p-4 border border-gray-300 rounded-lg" rows={8}
            {...register("message", {
              required: "本文は必須です。",
              maxLength: {
                value: 500,
                message: "本文は500文字以内で入力してください",
              },
            })}
            disabled={isSubmitting}
          />
          {errors.message && <p className="text-red-700 text-sm">{errors.message.message}</p>}
        </div>
      </div>

      <div className="flex justify-center">
        <button className="py-2 px-4 rounded-lg font-bold text-white bg-gray-800 mr-4" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "送信中" : "送信"}
        </button>
        <button className="py-2 px-4 rounded-lg font-bold  bg-gray-300" type="button" onClick={() => reset()} disabled={isSubmitting}>
          クリア
        </button>
      </div>
    </form>
  );
};

export default ContactForm;