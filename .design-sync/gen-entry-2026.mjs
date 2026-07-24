// Sinh apps/2026/.design-sync.entry.tsx (bản 2026 — KHÔNG đụng bản 2025).
//
// Khác gen-entry.mjs (2025) ở 3 điểm:
//  1. Nguồn chính là packages/ui (design system dùng chung) — QUÉT tự động, nên thêm
//     component mới vào packages/ui là tự xuất hiện.
//  2. Phần của riêng app 2026 dùng ALLOWLIST tường minh, KHÔNG quét cả thư mục: showcase/
//     có nhiều component bám cứng lenis/gsap và three/ dùng WebGL+leva — kéo vào là chết
//     bundle IIFE hoặc ra card trống (xem NOTES: đây đúng lý do 2025 không dùng chế độ
//     synth mặc định).
//  3. Xử lý trùng tên: `Card` có ở CẢ packages/ui (shadcn) lẫn showcase/effects → bản
//     showcase được đổi tên thành ShowcaseCard, nếu không hai cái đè nhau trong registry.
//
// Đường dẫn trong entry là TƯƠNG ĐỐI so với vị trí entry (apps/2026/).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:')
const UI_DIR = join(ROOT, 'packages/ui/src/components')

// Component riêng của 2026: chỉ những thứ thuần React/CSS (đã kiểm: chỉ import
// react + clsx + *.module.css). Mọi thứ chạm lenis/gsap/three/leva CỐ TÌNH bị loại.
const APP_EXPORTS = [
  { from: './src/components/showcase/felix-mark', named: null },
  { from: './src/components/showcase/effects/list-item', named: null },
  { from: './src/components/showcase/effects/marquee', named: null },
  { from: './src/components/showcase/effects/appear-title', named: null },
  // đổi tên để không đè Card của packages/ui
  { from: './src/components/showcase/effects/card', named: '{ Card as ShowcaseCard }' },
]

const lines = [
  '// FILE SINH TỰ ĐỘNG bởi .design-sync/gen-entry-2026.mjs — đừng sửa tay.',
  '// Sửa danh sách trong gen-entry-2026.mjs rồi chạy lại.',
  '',
]

// 1) packages/ui — quét mọi .tsx có export chữ hoa
let uiCount = 0
for (const f of readdirSync(UI_DIR).sort()) {
  if (!f.endsWith('.tsx')) continue
  const src = readFileSync(join(UI_DIR, f), 'utf8')
  const hasUpper =
    /export\s+(default\s+)?(const|function|class)\s+[A-Z]/.test(src) || /export\s*\{[^}]*\b[A-Z]/.test(src)
  if (!hasUpper) continue
  lines.push(`export * from '../../packages/ui/src/components/${f.replace(/\.tsx$/, '')}'`)
  uiCount++
}

// 2) component riêng của app 2026
lines.push('')
for (const e of APP_EXPORTS) {
  lines.push(e.named ? `export ${e.named} from '${e.from}'` : `export * from '${e.from}'`)
}

// 3) provider bọc preview (ép dark + showcase-root)
lines.push('')
lines.push("export { DsTheme2026 } from '../../.design-sync/shims/ds-provider-2026'")

writeFileSync(join(ROOT, 'apps/2026/.design-sync.entry.tsx'), lines.join('\n') + '\n')
console.log(`[gen-entry-2026] OK — ${uiCount} component packages/ui + ${APP_EXPORTS.length} nhóm của app 2026`)
