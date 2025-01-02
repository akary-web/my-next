/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.jp' },
      { protocol: 'https', hostname: 'images.microcms-assets.io' },
      { protocol: 'https', hostname: 'jfmmtsullnqjjeihwoka.supabase.co' }, // Supabaseのホスト名を追加
    ],
  },
};

export default nextConfig;
