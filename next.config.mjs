/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // استبدل 'your-repo-name' باسم المستودع الخاص بك على GitHub
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name',
}

export default nextConfig
