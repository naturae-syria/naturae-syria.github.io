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
  // تصحيح إعداد assetPrefix ليبدأ بشرطة مائلة
  basePath: '/arabic-product-catalog',
  assetPrefix: '/arabic-product-catalog',
}

export default nextConfig
