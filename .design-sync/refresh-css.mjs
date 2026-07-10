// Copy CSS Tailwind đã compile của apps/2025 (.next/static/css, file lớn nhất)
// → .design-sync/.cache/css2025.css (cssEntry của design-sync).
// Chạy `pnpm build --filter=web-2025` trước nếu .next chưa có.
import { readdirSync, statSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:')
const cssDir = join(ROOT, 'apps/2025/.next/static/css')
const files = readdirSync(cssDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => ({ f, size: statSync(join(cssDir, f)).size }))
  .sort((a, b) => b.size - a.size)
if (!files.length) {
  console.error('Không thấy css nào trong .next/static/css — build web-2025 trước.')
  process.exit(1)
}
mkdirSync(join(ROOT, 'apps/2025/.ds-css'), { recursive: true })
copyFileSync(join(cssDir, files[0].f), join(ROOT, 'apps/2025/.ds-css/css2025.css'))
console.log(`css2025.css ← ${files[0].f} (${(files[0].size / 1024).toFixed(0)}K)`)
