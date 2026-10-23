/** @type {import('next').NextConfig} */
const nextConfig = {
  // 全站静态导出：构建产物可以直接扔到任何静态托管（Cloudflare Pages / Vercel / OSS）
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
