/**
 * Convert catalog Lingui .po → messages/{vi,en}.json cho next-intl (C6-01, D-03).
 * ĐỒ DÙNG 1 LẦN — xóa ở plan C06-04 cùng msgid-map.json.
 *
 * - Namespace suy từ tham chiếu nguồn (#: src/...) trong .po: tên file chứa macro
 *   → PascalCase (navbar.tsx → Navbar; about/page.tsx → About). msgid xuất hiện
 *   ở nhiều namespace khác nhau → Common (D-03 + Claude tự quyết trong CONTEXT).
 * - Key máy: camelCase 4 từ đầu của msgid, khử trùng bằng hậu tố số.
 * - Placeholder giữ nguyên cú pháp {0}/{name} (ICU của next-intl đọc được);
 *   rich text <0>..</0> giữ nguyên — plan 02/03 sẽ chuyển thành t.rich với tag đặt tên.
 * - msgid-map.json: msgid → "Namespace.key" để tra khi port call site.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const ROOT = path.join(__dirname, '..')
const LOCALES: Record<string, string> = {
  vi: path.join(ROOT, 'src/i18n/locales/vi-VN/messages.po'),
  en: path.join(ROOT, 'src/i18n/locales/en-US/messages.po'),
}

interface PoEntry {
  refs: string[]
  msgid: string
  msgstr: string
}

function parsePo(file: string): PoEntry[] {
  const text = readFileSync(file, 'utf8')
  const entries: PoEntry[] = []
  // tách block theo dòng trống; block đầu là header (msgid "")
  for (const block of text.split(/\r?\n\r?\n/)) {
    const refs = [...block.matchAll(/^#: (.+)$/gm)].map((m) => m[1].split(':')[0])
    const grab = (kw: string) => {
      const m = block.match(new RegExp(`^${kw} "((?:[^"\\\\]|\\\\.)*)"((?:\\r?\\n"(?:[^"\\\\]|\\\\.)*")*)`, 'm'))
      if (!m) return null
      const cont = (m[2] || '')
        .split(/\r?\n/)
        .map((l) => l.trim().replace(/^"|"$/g, ''))
        .join('')
      return JSON.parse(`"${(m[1] + cont).replace(/"/g, '\\"').replace(/\\\\"/g, '\\"')}"`) as string
    }
    const msgid = grab('msgid')
    const msgstr = grab('msgstr')
    if (!msgid || msgid === '') continue // bỏ header
    entries.push({ refs, msgid, msgstr: msgstr || '' })
  }
  return entries
}

/** src/components/organisms/navbar.tsx → Navbar; src/app/[lang]/(page)/about/page.tsx → About */
function namespaceOf(ref: string): string {
  const parts = ref.replace(/\\/g, '/').split('/')
  let base = parts[parts.length - 1].replace(/\.(tsx?|jsx?)$/, '')
  if (base === 'page' || base === 'layout') {
    const dir = parts[parts.length - 2] || 'root'
    base = dir.startsWith('[') || dir.startsWith('(') ? parts[parts.length - 3] || 'root' : dir
    if (base.startsWith('(') || base.startsWith('[')) base = 'root'
    if (base === '@modal') base = 'contact-modal'
  }
  return base
    .split(/[-_.()]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('')
}

/** "I will always be ready..." → iWillAlwaysBe */
function keyOf(msgid: string, taken: Set<string>): string {
  const words = msgid
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
  let key =
    words.map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join('') || 'msg'
  let candidate = key
  let n = 2
  while (taken.has(candidate)) candidate = `${key}${n++}`
  taken.add(candidate)
  return candidate
}

const viEntries = parsePo(LOCALES.vi)
const enEntries = parsePo(LOCALES.en)
const enById = new Map(enEntries.map((e) => [e.msgid, e]))

// Namespace: từ refs; nhiều namespace khác nhau → Common
const nsById = new Map<string, string>()
for (const e of viEntries) {
  const spaces = [...new Set(e.refs.map(namespaceOf))]
  nsById.set(e.msgid, spaces.length === 1 ? spaces[0] : 'Common')
}

const takenPerNs = new Map<string, Set<string>>()
const vi: Record<string, Record<string, string>> = {}
const en: Record<string, Record<string, string>> = {}
const map: Record<string, string> = {}

for (const e of viEntries) {
  const ns = nsById.get(e.msgid)!
  if (!takenPerNs.has(ns)) takenPerNs.set(ns, new Set())
  const key = keyOf(e.msgid, takenPerNs.get(ns)!)
  const enStr = enById.get(e.msgid)?.msgstr || e.msgid // sourceLocale: msgstr rỗng → msgid
  ;(vi[ns] ??= {})[key] = e.msgstr || e.msgid
  ;(en[ns] ??= {})[key] = enStr
  map[e.msgid] = `${ns}.${key}`
}

const sortObj = (o: Record<string, Record<string, string>>) =>
  Object.fromEntries(
    Object.keys(o)
      .sort()
      .map((ns) => [ns, Object.fromEntries(Object.entries(o[ns]).sort(([a], [b]) => a.localeCompare(b)))])
  )

mkdirSync(path.join(ROOT, 'messages'), { recursive: true })
writeFileSync(path.join(ROOT, 'messages/vi.json'), JSON.stringify(sortObj(vi), null, 2) + '\n')
writeFileSync(path.join(ROOT, 'messages/en.json'), JSON.stringify(sortObj(en), null, 2) + '\n')
writeFileSync(path.join(ROOT, 'messages/msgid-map.json'), JSON.stringify(map, null, 2) + '\n')
console.log(`✅ ${viEntries.length} msgid → ${Object.keys(vi).length} namespace (vi/en đối xứng)`)
