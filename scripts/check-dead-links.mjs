#!/usr/bin/env node
// C12 (D-01/D-02/M-02): dead-link crawler đơn giản kiểu react.dev — Node thuần, 0 dep.
// BFS trên HTML build thật của 2 app (SSG). Link nội bộ: theo dấu + kiểm 404. Link
// ngoài: chỉ kiểm định dạng URL (KHÔNG fetch — tránh flaky mạng). Anchor #frag: kiểm
// id tồn tại ở trang đích (mặc định lỗi; --anchors=warn hạ cấp).
//
// Dùng:
//   node scripts/check-dead-links.mjs                       # tự spawn next start 2 app (3000/3001)
//   node scripts/check-dead-links.mjs --base=http://localhost:3000,http://localhost:3001  # crawl server có sẵn
//   node scripts/check-dead-links.mjs --anchors=warn
//   node scripts/check-dead-links.mjs --help

import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const CONCURRENCY = 6
const FETCH_TIMEOUT_MS = 15000
const SERVER_READY_TIMEOUT_MS = 90000

const APPS = [
  { name: 'web-2026', port: 3000 },
  { name: 'web-2025', port: 3001 },
]

function parseArgs(argv) {
  const args = { anchors: 'error', base: null }
  for (const a of argv.slice(2)) {
    if (a === '--help' || a === '-h') args.help = true
    else if (a.startsWith('--anchors=')) args.anchors = a.slice('--anchors='.length)
    else if (a.startsWith('--base=')) args.base = a.slice('--base='.length).split(',').filter(Boolean)
  }
  return args
}

function help() {
  console.log(`check-dead-links — crawler link chết cho web-2025 + web-2026

  node scripts/check-dead-links.mjs [--base=url1,url2] [--anchors=warn|error]

  --base     crawl server có sẵn (bỏ qua spawn next start)
  --anchors  warn: anchor #frag chết chỉ cảnh báo (mặc định error)`)
}

async function fetchText(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'manual' })
    const body = res.status >= 200 && res.status < 300 ? await res.text() : ''
    return { status: res.status, body, location: res.headers.get('location') }
  } catch (e) {
    return { status: 0, body: '', error: String(e?.message || e) }
  } finally {
    clearTimeout(t)
  }
}

// Chờ 1 server sẵn sàng (poll HEAD /).
async function waitReady(origin) {
  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    try {
      const res = await fetch(origin + '/', { method: 'HEAD' })
      if (res.status > 0) return true
    } catch {
      /* chưa lên */
    }
    await sleep(1000)
  }
  return false
}

function startServer(app) {
  // pnpm --filter <name> exec next start -p <port>; shell:true để chạy trên Windows
  const child = spawn('pnpm', ['--filter', app.name, 'exec', 'next', 'start', '-p', String(app.port)], {
    shell: true,
    stdio: 'ignore',
    env: process.env,
  })
  return child
}

function killTree(child) {
  if (!child || child.killed) return
  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', shell: true })
    } else {
      process.kill(-child.pid, 'SIGKILL')
    }
  } catch {
    child.kill('SIGKILL')
  }
}

const HREF_RE = /(?:href|src)\s*=\s*["']([^"']+)["']/gi
const ID_RE = /\bid\s*=\s*["']([^"']+)["']/gi

// href trong HTML bị entity-encode (&amp; → &) — phải decode trước khi fetch.
function htmlDecode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x2f;/gi, '/')
}

function extractHrefs(html) {
  const out = []
  let m
  while ((m = HREF_RE.exec(html))) out.push(htmlDecode(m[1]))
  return out
}
function extractIds(html) {
  const set = new Set()
  let m
  while ((m = ID_RE.exec(html))) set.add(m[1])
  return set
}

function isExternal(href) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('/')
}

// Crawl 1 app origin. Trả { dead: [...], anchorWarn: [...] }
async function crawlApp(origin, anchorsMode) {
  const seen = new Set()
  const queue = ['/', '/en']
  const pageIds = new Map() // path -> Set(id)
  const pageStatus = new Map() // path -> status
  const dead = [] // { from, href, reason }
  const anchorIssues = [] // { from, href }
  const externalSeen = new Set()

  // tải + cache 1 trang (id + status)
  async function loadPage(path) {
    if (pageStatus.has(path)) return
    const { status, body } = await fetchText(origin + path)
    pageStatus.set(path, status)
    if (status >= 200 && status < 300) pageIds.set(path, extractIds(body))
    return body
  }

  while (queue.length) {
    const batch = queue.splice(0, CONCURRENCY)
    await Promise.all(
      batch.map(async (path) => {
        if (seen.has(path)) return
        seen.add(path)
        const { status, body } = await fetchText(origin + path)
        pageStatus.set(path, status)
        if (status < 200 || status >= 300) return
        pageIds.set(path, extractIds(body))

        for (const raw of extractHrefs(body)) {
          const href = raw.trim()
          if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:')) continue
          // framework internals + image-optimization proxy: không phải link điều hướng
          // (thất bại /_next/image là chuyện ảnh remote, không phải link chết) — bỏ qua
          if (href.startsWith('/_next/')) continue

          if (isExternal(href)) {
            // chỉ kiểm định dạng URL, không fetch
            try {
              new URL(href)
            } catch {
              dead.push({ from: path, href, reason: 'URL ngoài sai định dạng' })
            }
            externalSeen.add(href)
            continue
          }

          // nội bộ (bắt đầu / hoặc #...)
          let targetPath, frag
          if (href.startsWith('#')) {
            targetPath = path
            frag = href.slice(1)
          } else if (href.startsWith('/')) {
            const [p, f] = href.split('#')
            targetPath = p.replace(/\/$/, '') || '/'
            frag = f
            // bỏ asset tĩnh (có đuôi file) khỏi BFS nhưng vẫn kiểm tồn tại
            if (!seen.has(targetPath) && !queue.includes(targetPath) && !/\.[a-z0-9]{2,5}(\?|$)/i.test(targetPath)) {
              queue.push(targetPath)
            }
          } else {
            continue // href tương đối lạ — bỏ qua
          }

          // kiểm anchor
          if (frag) {
            await loadPage(targetPath)
            const st = pageStatus.get(targetPath)
            if (st !== undefined && (st < 200 || st >= 300)) {
              dead.push({ from: path, href, reason: `trang đích ${st}` })
            } else {
              const ids = pageIds.get(targetPath)
              if (ids && !ids.has(frag)) anchorIssues.push({ from: path, href })
            }
          }
        }
      })
    )
  }

  // kiểm mọi trang nội bộ đã thăm có 404 không
  for (const [path, status] of pageStatus) {
    if (status < 200 || status >= 300)
      dead.push({ from: '(link tới)', href: path, reason: `HTTP ${status || 'no-response'}` })
  }

  return { origin, dead, anchorIssues, pagesVisited: seen.size, externalCount: externalSeen.size }
}

async function main() {
  const args = parseArgs(process.argv)
  if (args.help) return help()

  const children = []
  let origins = args.base

  if (!origins) {
    console.log('▶ spawn next start cho 2 app…')
    for (const app of APPS) children.push(startServer(app))
    origins = APPS.map((a) => `http://localhost:${a.port}`)
    for (const origin of origins) {
      const ok = await waitReady(origin)
      if (!ok) {
        console.error(`✗ server ${origin} không sẵn sàng trong ${SERVER_READY_TIMEOUT_MS / 1000}s`)
        children.forEach(killTree)
        process.exit(2)
      }
      console.log(`  ✓ ${origin} sẵn sàng`)
    }
  }

  let totalDead = 0
  let totalAnchors = 0
  try {
    for (const origin of origins) {
      const r = await crawlApp(origin, args.anchors)
      console.log(`\n── ${origin} — ${r.pagesVisited} trang nội bộ, ${r.externalCount} link ngoài ──`)
      if (r.dead.length === 0) console.log('  ✓ 0 link chết')
      for (const d of r.dead) console.log(`  ✗ [${d.from}] → ${d.href}  (${d.reason})`)
      for (const a of r.anchorIssues)
        console.log(`  ${args.anchors === 'warn' ? '⚠' : '✗'} anchor [${a.from}] → ${a.href}`)
      totalDead += r.dead.length
      totalAnchors += r.anchorIssues.length
    }
  } finally {
    children.forEach(killTree)
  }

  const anchorFail = args.anchors !== 'warn' && totalAnchors > 0
  if (totalDead > 0 || anchorFail) {
    console.error(`\n✗ FAIL — ${totalDead} link chết, ${totalAnchors} anchor lỗi`)
    process.exit(1)
  }
  console.log(`\n✓ OK — 0 link chết${totalAnchors ? `, ${totalAnchors} anchor (warn)` : ''}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
