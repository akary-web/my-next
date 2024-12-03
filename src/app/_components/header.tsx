"use client";  // クライアントサイドで実行

import React from 'react';
import { nav } from '../_data/navList';
import styles from '../_styles/header.module.css';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {nav.map((elem) => (
        <Link href={elem.href} key={elem.id}>
          {elem.name}
        </Link>
      ))}
    </header>
  );
};
