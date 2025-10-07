/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // TODO: Add environment variables for API endpoints
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`,
      },
    ]
  },
  // Suppress hydration warnings for browser extension attributes
  reactStrictMode: true,
  experimental: {
    suppressHydrationWarning: true,
  },
}

module.exports = nextConfig
