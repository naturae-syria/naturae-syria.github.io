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
  // تحديث المسار الأساسي ليتطابق مع اسم المستودع
  basePath: '/naturae-syria.github.io',
  assetPrefix: '/naturae-syria.github.io',
}

export default nextConfig
