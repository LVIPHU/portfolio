// C11 (D-04): fence-as-file DSL kiểu react.dev. Parse meta của mỗi code fence
// con trong <Sandpack> → 1 file của sandbox. LẤY code THÔ ở tầng mdast (trước
// rehype-pretty-code) nên không bị highlight phá — xem remark/sandpack-files.ts.

export type SandpackFile = {
  code: string
  active?: boolean
  hidden?: boolean
  readOnly?: boolean
}

export type SandpackFileMap = Record<string, SandpackFile>

/** 1 fence: ngôn ngữ + metastring + code thô. */
export type RawFence = {
  lang: string | null | undefined
  meta: string | null | undefined
  value: string
}

// Tên file mặc định theo ngôn ngữ khi fence không ghi path.
function defaultPathForLang(lang: string | null | undefined): string {
  switch ((lang || '').toLowerCase()) {
    case 'css':
      return '/styles.css'
    case 'html':
      return '/index.html'
    case 'json':
      return '/data.json'
    case 'ts':
    case 'tsx':
      return '/App.tsx'
    default:
      return '/App.js'
  }
}

const FLAG_TOKENS = new Set(['active', 'hidden', 'readonly', 'read-only'])

// Token trông giống đường dẫn file (có dấu chấm mở rộng hoặc dấu /).
function looksLikePath(token: string): boolean {
  return /[./]/.test(token) && !FLAG_TOKENS.has(token.toLowerCase())
}

/**
 * Parse 1 fence → [path, file]. Trả null nếu meta không hiểu được (caller
 * bỏ qua + warn, KHÔNG throw — 1 fence xấu không được làm chết build, D-04).
 */
export function parseFence(fence: RawFence): [string, SandpackFile] | null {
  const tokens = (fence.meta || '').trim().split(/\s+/).filter(Boolean)

  let path: string | undefined
  const flags = { active: false, hidden: false, readOnly: false }

  for (const token of tokens) {
    const lower = token.toLowerCase()
    if (lower === 'active') flags.active = true
    else if (lower === 'hidden') flags.hidden = true
    else if (lower === 'readonly' || lower === 'read-only') flags.readOnly = true
    else if (looksLikePath(token) && !path) path = token
    else return null // token lạ không parse được
  }

  if (!path) path = defaultPathForLang(fence.lang)
  if (!path.startsWith('/')) path = `/${path}`

  return [
    path,
    {
      code: fence.value,
      ...(flags.active ? { active: true } : {}),
      ...(flags.hidden ? { hidden: true } : {}),
      ...(flags.readOnly ? { readOnly: true } : {}),
    },
  ]
}

/**
 * Gộp nhiều fence thành file map. Fence lỗi → onWarn(meta) + bỏ qua.
 * 1 fence duy nhất không tên → dùng path mặc định theo lang.
 */
export function buildFileMap(fences: RawFence[], onWarn?: (meta: string) => void): SandpackFileMap {
  const map: SandpackFileMap = {}
  for (const fence of fences) {
    const parsed = parseFence(fence)
    if (!parsed) {
      onWarn?.(fence.meta || '(no meta)')
      continue
    }
    map[parsed[0]] = parsed[1]
  }
  return map
}
