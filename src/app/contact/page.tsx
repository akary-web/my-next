"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "../_styles/contactForm.module.css";

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
    <form className={styles.wrap} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>問合わせフォーム</h1>
      <div className={styles.itemwrap}>
        <label className={styles.itemlabel}>お名前</label>
        <div className={styles.textwrap}>
          <input className={styles.input}
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
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>
      </div>

      <div className={styles.itemwrap}>
        <label className={styles.itemlabel}>メールアドレス</label>
        <div className={styles.textwrap}>
          <input className={styles.input}
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
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>
      </div>

      <div className={styles.itemwrap}>
        <label className={styles.itemlabel}>本文</label>
        <div className={styles.textwrap}>
          <textarea className={styles.input} rows={8}
            {...register("message", {
              required: "本文は必須です。",
              maxLength: {
                value: 500,
                message: "本文は500文字以内で入力してください",
              },
            })}
            disabled={isSubmitting}
          />
          {errors.message && <p className={styles.error}>{errors.message.message}</p>}
        </div>
      </div>

      <div className={styles.buttonwrap}>
        <button className={styles.send} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "送信中" : "送信"}
        </button>
        <button className={styles.clear} type="button" onClick={() => reset()} disabled={isSubmitting}>
          クリア
        </button>
      </div>
    </form>
  );
};

export default ContactForm;