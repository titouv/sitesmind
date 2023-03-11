/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  experimental: {
    appDir: true,
    // typedRoutes: true,
  },
}

module.exports = nextConfig
