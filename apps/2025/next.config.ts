import createNextIntlPlugin from 'next-intl/plugin'
import { version, author } from './package.json'
import type { NextConfig } from 'next'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withNextIntl = createNextIntlPlugin()

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src * blob: data:;
  media-src 'self' http://localhost:3000 blob: data:;
  connect-src *;
  font-src 'self' fonts.gstatic.com;
  frame-src giscus.app;
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

const nextConfig: NextConfig = () => {
  const plugins = [withNextIntl, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    // next-mdx-remote phải được bundle + alias react theo layer RSC của webpack,
    // nếu không nó resolve react@19.2.7 (peer-variant của pnpm) lẫn với react vendored
    // của Next 15.2 → TypeError recentlyCreatedOwnerStacks trong dev. Bỏ được ở C7 (Next 16).
    transpilePackages: ['@portfolio/content', '@portfolio/mdx', 'next-mdx-remote'],
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
    webpack: (config: any) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })
      return config
    },
  })
}

export default nextConfig
