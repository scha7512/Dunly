/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ui-avatars.com', 'images.unsplash.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'],
  },
}

module.exports = nextConfig
