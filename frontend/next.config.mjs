/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
        pathname: '/assets/**',
      },
      // DIRECTUS_HOSTNAME must be set in production; fallback avoids picomatch crash on local builds
      ...(process.env.DIRECTUS_HOSTNAME
        ? [{
            protocol: 'https',
            hostname: process.env.DIRECTUS_HOSTNAME,
            pathname: '/assets/**',
          }]
        : []),
    ],
  },
  async redirects() {
    return []
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
