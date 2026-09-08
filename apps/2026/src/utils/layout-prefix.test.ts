import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Cổng A4: bố cục 2026 chỉ md / max-md. Không quét *.test.* (chính file này).
const SRC = fileURLToPath(new URL('..', import.meta.url))
const SCAN_EXT = new Set(['.ts', '.tsx', '.css'])
const SKIP = /\.test\.(ts|tsx)$/

/** Prefix Tailwind cấm trên bố cục trang — không khớp token `--spacer-sm:`. */
const FORBIDDEN_PREFIX = /(?:^|[\s"'`])(?:max-|min-)?(?:sm|lg|xl|2xl):/
const FORBIDDEN_PX = /800px|799\.98/
const FORBIDDEN_MIN = /min-\[/

async function walk(dir: string, acc: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) await walk(p, acc)
    else if (SCAN_EXT.has(extname(e.name)) && !SKIP.test(e.name)) acc.push(p)
  }
  return acc
}

describe('layout prefix gate (apps/2026/src)', () => {
  it('không còn 800px / 799.98 / min-[ / prefix sm|lg|xl|2xl trên bố cục', async () => {
    const files = await walk(SRC)
    const hits: string[] = []
    for (const file of files) {
      const text = await readFile(file, 'utf8')
      const lines = text.split(/\r?\n/)
      lines.forEach((line, i) => {
        if (FORBIDDEN_PX.test(line) || FORBIDDEN_MIN.test(line) || FORBIDDEN_PREFIX.test(line)) {
          hits.push(`${file}:${i + 1}: ${line.trim()}`)
        }
      })
    }
    expect(hits, hits.join('\n')).toEqual([])
  })
})
