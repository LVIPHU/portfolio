#!/usr/bin/env node
// Chụp full-page đa viewport cho web-2026 / web-2025. KHÔNG nằm trong ci-check.
//
// Giới hạn: chỉ layout tĩnh. Scroll-driven (GSAP / lenis) phải cuộn chuột thật
// (luật CLAUDE.md, mục scroll-driven) — công cụ scroll tổng hợp cho âm tính giả.
// reducedMotion mặc định reduce: intro/sao WebGL không vào ảnh.
//
// Dùng:
//   pnpm shots --app=both          # cần dev server 3000 + 3001 đang chạy
//   pnpm shots --app=2026
//   pnpm shots --app=2025 --base=http://localhost:3001
//   pnpm shots --help

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, '.shots')
const VIEWPORT_HEIGHT = 900
const INTRO_WAIT_MS = 10000
const FULLPAGE_MAX_WIDTH = 16000
const DEFAULT_WIDTHS = [320, 375, 480, 640, 767, 768, 1024, 1280, 1440, 1536, 1920]
const ROUTE_OK = /^\/[A-Za-z0-9/_-]*$/

const DEFAULT_ROUTES = {
  2026: ['/', '/about', '/blog', '/projects', '/resume', '/gallery', '/contact'],
  2025: ['/', '/blog', '/projects', '/about', '/photos', '/tags', '/contact'],
}

const APP_PORTS = { 2026: 3000, 2025: 3001 }

function parseArgs(argv) {
  const args = {
    help: false,
    app: '2026',
    base: null,
    routes: null,
    widths: DEFAULT_WIDTHS,
    allowRemote: false,
  }
  for (const a of argv.slice(2)) {
    if (a === '--help' || a === '-h') args.help = true
    else if (a === '--allow-remote') args.allowRemote = true
    else if (a.startsWith('--app=')) args.app = a.slice('--app='.length)
    else if (a.startsWith('--base=')) args.base = a.slice('--base='.length)
    else if (a.startsWith('--routes='))
      args.routes = a
        .slice('--routes='.length)
        .split(/[,\s]+/)
        .map((r) => r.trim())
        .filter(Boolean)
    else if (a.startsWith('--widths='))
      args.widths = a
        .slice('--widths='.length)
        .split(/[,\s]+/)
        .map((w) => Number(w.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
  }
  return args
}

function help() {
  console.log(`responsive-shots — chụp full-page đa viewport (không nằm trong ci-check)

  pnpm shots [--app=2026|2025|both] [--base=url] [--routes=/ ,/about] [--widths=320,375,...]

  --app           2026 (mặc định, :3000) | 2025 (:3001) | both
  --base          origin (mặc định localhost theo --app). both: --base=url2026,url2025 (đúng 2)
  --allow-remote  cho phép origin không phải localhost (cấm file: / data:)
  --routes        danh sách path, mặc định theo app (kèm bản /en/...)
  --widths        mặc định ${DEFAULT_WIDTHS.join(',')}

  Chromium chưa cài: pnpm exec playwright install chromium  (exit 2)
  Lỗi đi trang / server: exit 2, xem .shots/<app>/errors.json
  Có trang tràn ngang: exit 1, xem .shots/<app>/overflow.json
  Trang quá rộng (vd lưới Boxes 2025 /) chụp viewport, vẫn ghi overflow.

  Không kiểm animation cuộn — phải cuộn chuột thật.
  reducedMotion=reduce nên intro/sao không hiện trên ảnh.`)
}

function withEn(routes) {
  const out = []
  for (const r of routes) {
    out.push(r)
    out.push(r === '/' ? '/en' : `/en${r}`)
  }
  return out
}

function slugRoute(route) {
  if (route === '/') return 'home'
  if (route === '/en') return 'en-home'
  return route.replace(/^\//, '').replace(/\//g, '-')
}

function assertRoute(route) {
  if (route !== '/' && !ROUTE_OK.test(route)) {
    throw new Error(`--routes path không hợp lệ: ${route}`)
  }
}

function isLocalhostOrigin(origin) {
  let u
  try {
    u = new URL(origin)
  } catch {
    return false
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
  return u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '[::1]' || u.hostname === '::1'
}

function assertOrigin(origin, allowRemote) {
  let u
  try {
    u = new URL(origin)
  } catch {
    throw new Error(`--base không phải URL: ${origin}`)
  }
  if (u.protocol === 'file:' || u.protocol === 'data:') {
    throw new Error(`--base cấm scheme ${u.protocol}`)
  }
  if (!allowRemote && !isLocalhostOrigin(origin)) {
    throw new Error(`--base phải là localhost (hoặc truyền --allow-remote): ${origin}`)
  }
}

function originFor(app, apps, base, allowRemote) {
  if (!base) {
    const origin = `http://localhost:${APP_PORTS[app]}`
    assertOrigin(origin, allowRemote)
    return origin
  }
  const parts = base
    .split(',')
    .map((s) => s.replace(/\/$/, ''))
    .filter(Boolean)
  if (apps.length === 2 && parts.length !== 2) {
    throw new Error('--app=both cần --base=url2026,url2025 (đúng 2 origin)')
  }
  const origin = app === '2026' ? parts[0] : (parts[1] ?? parts[0])
  if (!origin) throw new Error(`Thiếu origin cho app ${app}`)
  assertOrigin(origin, allowRemote)
  return origin
}

function appsFrom(appFlag) {
  if (appFlag === 'both') return ['2026', '2025']
  if (appFlag === '2025' || appFlag === '2026') return [appFlag]
  throw new Error(`--app phải là 2026|2025|both, nhận: ${appFlag}`)
}

function assertUnderOutDir(filePath) {
  const resolved = resolve(filePath)
  const root = resolve(OUT_DIR)
  if (resolved !== root && !resolved.startsWith(root + '\\') && !resolved.startsWith(root + '/')) {
    throw new Error(`đường ghi nằm ngoài .shots/: ${resolved}`)
  }
}

async function waitPageReady(page, app) {
  if (app === '2026') {
    // reducedMotion: intro không gắn html.intro-out (JS skip + CSS ẩn overlay).
    // Chờ intro-out HOẶC prefers-reduced-motion, trần 10s — đừng chỉ chờ intro-out.
    try {
      await page.waitForFunction(
        () =>
          document.documentElement.classList.contains('intro-out') ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        { timeout: INTRO_WAIT_MS }
      )
    } catch {
      /* trần: vẫn chụp */
    }
  }
  try {
    await page.waitForLoadState('load', { timeout: 10000 })
  } catch {
    /* trang chậm — vẫn chụp sau domcontentloaded */
  }
}

function contactSheetHtml(rows) {
  const cells = rows
    .map(
      ({ app, route, width, href }) =>
        `<figure data-app="${app}" data-route="${escapeHtml(route)}" data-width="${width}">
  <figcaption>${escapeHtml(app)} ${escapeHtml(route)} @ ${width}</figcaption>
  <a href="${escapeHtml(href)}"><img src="${escapeHtml(href)}" alt="${escapeHtml(`${app} ${route} ${width}`)}"></a>
</figure>`
    )
    .join('\n')
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>responsive shots</title>
  <style>
    body { font: 14px/1.4 system-ui, sans-serif; margin: 16px; background: #111; color: #eee; }
    h1 { font-size: 18px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    figure { margin: 0; background: #1c1c1c; padding: 8px; }
    figcaption { font-size: 11px; margin-bottom: 6px; word-break: break-all; }
    img { width: 100%; height: auto; display: block; background: #000; }
  </style>
</head>
<body>
  <h1>responsive shots</h1>
  <p>Layout tĩnh. Scroll-driven phải cuộn chuột thật. reducedMotion=reduce — intro/sao không vào ảnh.</p>
  <div class="grid">
${cells}
  </div>
</body>
</html>
`
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function main() {
  const args = parseArgs(process.argv)
  if (args.help) {
    help()
    return
  }

  const exe = chromium.executablePath()
  if (!existsSync(exe)) {
    console.error('Chromium chưa cài. Chạy: pnpm exec playwright install chromium')
    process.exit(2)
  }

  if (!args.widths.length) {
    console.error('--widths rỗng (PowerShell nuốt dấu phẩy: dùng --widths=375,767 hoặc khoảng trắng)')
    process.exit(2)
  }

  const apps = appsFrom(args.app)
  const browser = await chromium.launch()
  const sheetRows = []
  let anyOverflow = false
  let anyError = false

  try {
    for (const app of apps) {
      const origin = originFor(app, apps, args.base, args.allowRemote)
      const rawRoutes = args.routes ?? DEFAULT_ROUTES[app]
      for (const r of rawRoutes) assertRoute(r)
      const routes = withEn(rawRoutes)
      const overflows = []
      const errors = []
      const appDir = join(OUT_DIR, app)

      for (const route of routes) {
        const slug = slugRoute(route)
        const dir = join(appDir, slug)
        assertUnderOutDir(dir)
        await mkdir(dir, { recursive: true })

        for (const width of args.widths) {
          const isNarrow = width < 768
          const context = await browser.newContext({
            viewport: { width, height: VIEWPORT_HEIGHT },
            hasTouch: isNarrow,
            isMobile: isNarrow,
            reducedMotion: 'reduce',
          })
          const page = await context.newPage()
          const url = origin + route
          try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
            await waitPageReady(page, app)
            const box = await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
            }))
            const overflowed = box.scrollWidth > box.clientWidth
            if (overflowed) {
              overflows.push({
                route,
                width,
                scrollWidth: box.scrollWidth,
                clientWidth: box.clientWidth,
              })
            }
            const pngPath = join(dir, `${width}.png`)
            assertUnderOutDir(pngPath)
            const fullPage = box.scrollWidth <= FULLPAGE_MAX_WIDTH
            await page.screenshot({
              path: pngPath,
              fullPage,
              animations: 'disabled',
              timeout: 60000,
            })
            sheetRows.push({
              app,
              route,
              width,
              href: relative(OUT_DIR, pngPath).split('\\').join('/'),
            })
            const flag = overflowed ? 'OVERFLOW' : fullPage ? 'ok' : 'ok (viewport-only)'
            process.stdout.write(`${app} ${route} @${width} ${flag}\n`)
          } catch (e) {
            console.error(`FAIL ${app} ${route} @${width}: ${e.message || e}`)
            errors.push({
              route,
              width,
              error: String(e.message || e),
            })
          } finally {
            await context.close()
          }
        }
      }

      await mkdir(appDir, { recursive: true })
      await writeFile(join(appDir, 'overflow.json'), JSON.stringify(overflows, null, 2) + '\n')
      await writeFile(join(appDir, 'errors.json'), JSON.stringify(errors, null, 2) + '\n')
      if (overflows.length) anyOverflow = true
      if (errors.length) anyError = true
    }

    await mkdir(OUT_DIR, { recursive: true })
    await writeFile(join(OUT_DIR, 'index.html'), contactSheetHtml(sheetRows))
  } finally {
    await browser.close()
  }

  console.log(`contact-sheet: ${join(OUT_DIR, 'index.html')}`)
  if (anyError) {
    console.error('Có trang lỗi đi/chụp — xem .shots/<app>/errors.json')
    process.exit(2)
  }
  if (anyOverflow) {
    console.error('Có trang tràn ngang — xem .shots/<app>/overflow.json')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
