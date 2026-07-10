// Sinh .design-sync/entry.tsx + in componentSrcMap từ atoms + molecules của apps/2025.
// Chạy lại khi thêm/bớt component: node .design-sync/gen-entry.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:')
const COMP = join(ROOT, 'apps/2025/src/components')
// molecules/back-to-posts.tsx trùng export BackToPosts với atoms → giữ bản atoms
const SKIP_FILES = new Set(['molecules/back-to-posts.tsx', 'atoms/social-icons.tsx'])

const pascal = (f) =>
  f
    .replace(/\.tsx$/, '')
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('')

const lines = []
const map = {}
for (const dir of ['atoms', 'molecules']) {
  for (const f of readdirSync(join(COMP, dir)).sort()) {
    if (!f.endsWith('.tsx')) continue
    const rel = `${dir}/${f}`
    if (SKIP_FILES.has(rel)) continue
    const srcTxt = readFileSync(join(COMP, dir, f), 'utf8')
    const names = [...srcTxt.matchAll(/export\s+(?:default\s+)?(?:const|function|class)\s+([A-Z][A-Za-z0-9]*)/g)].map(
      (m) => m[1]
    )
    const fromBraces = [...srcTxt.matchAll(/export\s*\{([^}]+)\}/g)].flatMap((m) =>
      m[1]
        .split(',')
        .map((s) =>
          s
            .trim()
            .split(/\s+as\s+/)
            .pop()
        )
        .filter((n) => /^[A-Z][A-Za-z0-9]*$/.test(n ?? ''))
    )
    const all = [...new Set([...names, ...fromBraces])]
    if (!all.length) continue
    const primary = all.includes(pascal(f)) ? pascal(f) : all[0]
    lines.push(`export * from './src/components/${rel.replace(/\.tsx$/, '')}'`)
    map[primary] = `src/components/${rel}`
  }
}
// social-icons đi qua bản safe (xem gen-icons-safe.mjs — tránh shadow icon tên React)
lines.push(`export * from '../../.design-sync/.cache/social-icons-safe'`)
writeFileSync(join(ROOT, 'apps/2025/.design-sync.entry.tsx'), lines.join('\n') + '\n')
console.log(`entry.tsx: ${lines.length} files`)
console.log(JSON.stringify(map, null, 2))
