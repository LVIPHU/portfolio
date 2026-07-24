import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const repoRoot = path.join(__dirname, '..', '..')

// Worker generate-params của Next dev có cwd khác app → blog.ts không đoán được
// packages/content từ cwd. Set env chính thức (blog.ts ưu tiên biến này).
process.env.PORTFOLIO_CONTENT_DIR ??= path.join(repoRoot, 'packages', 'content')

const config: NextConfig = {
  // Build LOCAL ghi ra .next-build, không đụng .next của dev server (dev và build chung
  // .next là một nguồn gây 404). Chỉ dùng .next-build khi CHẮC CHẮN là build local:
  // NODE_ENV=production VÀ không phải CI/Vercel. Mọi trường hợp khác (dev, Vercel, CI)
  // → .next. Fail-safe về .next: Vercel BẮT BUỘC .next, nên dù có sót env cũng không
  // bao giờ ghi nhầm chỗ làm hỏng deploy. `next start` local (check-links) chạy
  // NODE_ENV=production, không CI → cũng đọc .next-build, khớp build.
  distDir: process.env.NODE_ENV === 'production' && !process.env.VERCEL && !process.env.CI ? '.next-build' : '.next',
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
