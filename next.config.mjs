/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 개발 모드에서 렌더링이 두 번 발생하는 것을 방지
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    cacheComponents: true,
  },
}

export default nextConfig