"use client";  // クライアントサイドで実行
import React from 'react';
import { nav } from '../_data/navList';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-gray-800 text-white font-bold p-6">
      {nav.map((elem) => (
        <Link href={elem.href} key={elem.id}>
          {elem.name}
        </Link>
      ))}
    </header>
  );
};

