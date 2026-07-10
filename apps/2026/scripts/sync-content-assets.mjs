/**
 * Copy ảnh/asset từ packages/content/assets → public/content
 * Chạy tự động trước dev/build (predev/prebuild).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = path.resolve(appDir, '..', '..', 'packages', 'content', 'assets')
const dest = path.join(appDir, 'public', 'content')

if (!fs.existsSync(src)) {
  console.warn(`[sync-content-assets] Không thấy ${src}, bỏ qua.`)
  process.exit(0)
}

fs.rmSync(dest, { recursive: true, force: true })
fs.mkdirSync(dest, { recursive: true })
fs.cpSync(src, dest, { recursive: true })
console.log(`[sync-content-assets] Đã copy assets → public/content`)
