import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./destyle.css";
import { Header } from "./_components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "8章課題",
  description: "8章課題",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
      <Header />
      {children}</body>
    </html>
  );
}
