// Gom CSS đã compile của app 2026 → apps/2026/.ds-css/css2026.css (+ font đi kèm).
//
// KHÁC refresh-css.mjs (2025) ở 3 chỗ, cả ba đều là lý do bản 2025 hiện chạy là fail:
//  1. THƯ MỤC: Next 16 + Turbopack không còn đặt CSS ở <dist>/static/css mà ở
//     <dist>/static/chunks/*.css.
//  2. GỐC BUILD: build local giờ ra .next-build (xem distDir trong next.config.ts —
//     .next dành riêng cho dev server). Vẫn dò .next để phòng bố cục cũ.
//  3. GHÉP TẤT CẢ chunk thay vì lấy file lớn nhất: 2026 tách CSS theo route group nên
//     globals.css (tailwind + token) và showcase/theme.css + các *.module.css nằm khác
//     chunk — lấy mỗi file lớn nhất là mất .showcase-root và CSS module của FELIX.
//
// FONT: chunk CSS tham chiếu url(../media/<hash>.woff2), tính từ static/chunks/. Sau khi
// copy sang .ds-css/ thì '../media/' trỏ vào apps/2026/media/ (không tồn tại) → converter
// báo FONT_DANGLING và Anton/Roboto rơi về font hệ thống. Nên copy luôn static/media/
// vào .ds-css/media/ rồi viết lại url thành './media/'.
import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync, existsSync, cpSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:')
const APP = join(ROOT, 'apps/2026')

const roots = [join(APP, '.next-build'), join(APP, '.next')]
const distRoot = roots.find((d) => existsSync(join(d, 'static/chunks')) || existsSync(join(d, 'static/css')))

if (!distRoot) {
  console.error('[refresh-css-2026] Không thấy CSS đã compile. Chạy trước: pnpm --filter web-2026 build')
  console.error('  Đã dò: ' + roots.join(', '))
  process.exit(1)
}

const cssDir = [join(distRoot, 'static/chunks'), join(distRoot, 'static/css')].find(
  (d) => existsSync(d) && readdirSync(d).some((f) => f.endsWith('.css'))
)
if (!cssDir) {
  console.error('[refresh-css-2026] Có thư mục build nhưng không có file .css nào trong static/chunks|css.')
  process.exit(1)
}

// Ghép: file lớn nhất trước (tailwind base + token) rồi tới các chunk nhỏ (CSS module)
const files = readdirSync(cssDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => ({ f, size: statSync(join(cssDir, f)).size }))
  .sort((a, b) => b.size - a.size)

let merged = files.map(({ f }) => `/* ── ${f} ── */\n${readFileSync(join(cssDir, f), 'utf8')}`).join('\n\n')

const outDir = join(APP, '.ds-css')
mkdirSync(outDir, { recursive: true })

// mang font đi cùng + trỏ url về đúng chỗ
const mediaSrc = join(distRoot, 'static/media')
let fontNote = 'không thấy static/media'
if (existsSync(mediaSrc)) {
  cpSync(mediaSrc, join(outDir, 'media'), { recursive: true })
  merged = merged.replace(/url\((["']?)\.\.\/media\//g, 'url($1./media/')
  fontNote = `${readdirSync(mediaSrc).length} file font → .ds-css/media/`
}

writeFileSync(join(outDir, 'css2026.css'), merged)

const kb = (merged.length / 1024).toFixed(1)
console.log(`[refresh-css-2026] OK — ghép ${files.length} chunk (${kb}KB) từ ${cssDir.replace(ROOT, '')}; ${fontNote}`)
