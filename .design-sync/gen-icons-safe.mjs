// Bản sao máy-biến-đổi cho bundle DS (không đụng source app).
// Vấn đề gốc: converter bundle JSX kiểu CLASSIC (factory `React.createElement`),
// mà DS có icon tên `React` (icons.tsx) và file import icon đó (social-icons.tsx)
// → factory bị shadow → "X.createElement is not a function" khi render icon.
// Sinh 3 file vào .design-sync/.cache/:
//  1. icons-safe.tsx        — icons.tsx + import react thật, icon React → ReactIcon (alias export giữ tên React)
//  2. social-icons-safe.tsx — social-icons.tsx nhưng import icon React as ReactTechIcon
//  3. atoms-barrel-safe.ts  — atoms/index.ts với './social-icons' trỏ sang bản safe
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:')
const CACHE = join(ROOT, '.design-sync/.cache')
mkdirSync(CACHE, { recursive: true })

// 1. icons-safe
const icons = readFileSync(join(ROOT, 'apps/2025/src/utils/icons.tsx'), 'utf8')
if (!icons.includes('export function React(')) {
  console.error('gen-icons-safe: không thấy `export function React(` trong icons.tsx — transform cần cập nhật!')
  process.exit(1)
}
writeFileSync(
  join(CACHE, 'icons-safe.tsx'),
  "import * as React from 'react'\n" +
    icons.replace('export function React(', 'export function ReactIcon(') +
    '\nexport { ReactIcon as React }\n'
)

// 2. social-icons-safe — đổi tên binding icon React trong file importer
const social = readFileSync(join(ROOT, 'apps/2025/src/components/atoms/social-icons.tsx'), 'utf8')
if (!/\bReact\b/.test(social)) {
  console.error('gen-icons-safe: social-icons.tsx không còn tham chiếu React? — kiểm tra transform')
  process.exit(1)
}
const socialSafe = social
  .replace(/(\{[^}]*?)\bReact\b(,?[^}]*?\}\s*from\s*'@\/utils')/s, '$1React as ReactTechIcon$2')
  .replace(/\breact:\s*React\b/, 'react: ReactTechIcon')
if (!socialSafe.includes('React as ReactTechIcon') || !socialSafe.includes('react: ReactTechIcon')) {
  console.error('gen-icons-safe: rename React trong social-icons thất bại')
  process.exit(1)
}
writeFileSync(join(CACHE, 'social-icons-safe.tsx'), socialSafe)

// 3. atoms-barrel-safe — re-export mọi atom, social-icons trỏ bản safe
const barrel = readFileSync(join(ROOT, 'apps/2025/src/components/atoms/index.ts'), 'utf8')
const barrelSafe = barrel
  .split('\n')
  .map((l) => {
    const m = l.match(/^export \* from '\.\/(.+)'/)
    if (!m) return l
    if (m[1] === 'social-icons') return "export * from './social-icons-safe'"
    return `export * from '../../apps/2025/src/components/atoms/${m[1]}'`
  })
  .join('\n')
writeFileSync(join(CACHE, 'atoms-barrel-safe.ts'), barrelSafe)

console.log('icons-safe + social-icons-safe + atoms-barrel-safe OK')
