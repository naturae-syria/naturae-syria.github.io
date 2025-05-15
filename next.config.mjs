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
  // تأكد من تغيير هذا ليتطابق مع اسم المستودع الخاص بك
  // لا تضع شرطة مائلة في البداية
  basePath: '/arabic-product-catalog',
  assetPrefix: '/arabic-product-catalog',
  trailingSlash: true,
}

export default nextConfig
