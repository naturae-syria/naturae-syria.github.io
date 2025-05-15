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
  // تعطيل basePath و assetPrefix لتبسيط التكوين
  // basePath: '',
  // assetPrefix: '',
  trailingSlash: true,
}

export default nextConfig
