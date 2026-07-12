import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const repoRoot = path.join(__dirname, '..', '..')

const config: NextConfig = {
  // C10 (D-01): React Compiler stable trong Next 16 — memo tự động (babel pass).
  reactCompiler: true,
  // C11: sandpack-react cần transpile (ESM không chạy thẳng qua Turbopack — client
  // component không hydrate nếu để nguyên; đã kiểm chứng trên 2025).
  transpilePackages: ['@portfolio/content', '@portfolio/ui', '@portfolio/mdx', '@codesandbox/sandpack-react'],
  // Monorepo: chỉ rõ workspace root để Turbopack không phải đoán (cần cho vercel build)
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
}

export default withNextIntl(config)
