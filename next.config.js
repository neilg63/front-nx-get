/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/artworks/tags/:slug*',
        destination: '/artworks/tag--:slug*',
        permanent: true,
      },
      {
        source: '/artworks/tag/:slug*',
        destination: '/artworks/tag--:slug*',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
