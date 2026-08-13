const HTML_ESCAPE_RE = /[&<>'"]/g
const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
} as const

function replaceHtmlEntity(match: string): string {
  return HTML_ESCAPE_MAP[match as keyof typeof HTML_ESCAPE_MAP] ?? ''
}

/** Escape `& < > " '` for safe HTML text nodes. */
export function escapeHtml(es: string): string {
  return String.prototype.replace.call(es, HTML_ESCAPE_RE, replaceHtmlEntity)
}

/** @deprecated Prefer `escapeHtml` — kept for 2025 RSS call sites. */
export const escape = escapeHtml

export function kebabCaseToPlainText(str: string): string {
  return str.replace(/-/g, ' ')
}

export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}
