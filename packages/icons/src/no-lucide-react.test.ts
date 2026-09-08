import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '../../..')
const SKIP = new Set(['node_modules', '.next', '.next-build', '.turbo', 'dist', '.claude', '.git', '.ds-css'])

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) acc.push(p)
  }
  return acc
}

describe('no lucide-react outside packages/icons (T5)', () => {
  it('apps, packages/ui, packages/mdx do not import lucide-react', () => {
    const files = [...walk(join(ROOT, 'apps')), ...walk(join(ROOT, 'packages/ui')), ...walk(join(ROOT, 'packages/mdx'))]
    const hits: string[] = []
    for (const file of files) {
      const src = readFileSync(file, 'utf8')
      if (/from ['"]lucide-react['"]/.test(src) || /require\(['"]lucide-react['"]\)/.test(src)) {
        hits.push(file.replace(ROOT, '').replaceAll('\\', '/'))
      }
    }
    expect(hits).toEqual([])
  })
})
