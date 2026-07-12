import createNextIntlPlugin from 'next-intl/plugin'
import { version, author } from './package.json'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src * blob: data:;
  media-src 'self' http://localhost:3000 blob: data:;
  connect-src *;
  font-src 'self' fonts.gstatic.com;
  frame-src giscus.app *.codesandbox.io *.csb.app;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

// Next 16: object thuần (C7, D-04) — không còn reduce qua plugin wrapper
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // C10 (D-01): React Compiler stable trong Next 16 — memo tự động (babel pass).
  reactCompiler: true,
  transpilePackages: ['@portfolio/content', '@portfolio/mdx', '@portfolio/ui', '@codesandbox/sandpack-react'],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  env: {
    version: version,
    owner: author.name,
    email: author.email,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
  async redirects() {
    // URL cũ /vi-VN/* và /en-US/* → scheme mới (C6-04, D-02) — permanent 308
    return [
      { source: '/vi-VN', destination: '/', permanent: true },
      { source: '/vi-VN/:path*', destination: '/:path*', permanent: true },
      { source: '/en-US', destination: '/en', permanent: true },
      { source: '/en-US/:path*', destination: '/en/:path*', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
