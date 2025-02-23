import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
    turbo: {
      rules: {
        '*.po': {
          loaders: ['@lingui/loader'],
          as: '*.js'
        }
      }
    }
  },
  webpack: (config) => {
    // Add a rule to handle .po files using @lingui/loader
    config.module.rules.push({
      test: /\.po$/,
      use: '@lingui/loader'
    })
    return config
  }
}

export default nextConfig
