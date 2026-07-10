// Shim @lingui/macro + @lingui/core/macro — macro chỉ hoạt động qua SWC plugin
// lúc compile trong Next; ở bundle DS ta passthrough chuỗi gốc (tiếng gốc trong code).
const compile = (strings: any, ...values: any[]): string => {
  if (typeof strings === 'string') return strings
  const raw = strings?.raw ?? strings
  return Array.isArray(raw) ? String.raw({ raw }, ...values.map(String)) : String(strings ?? '')
}

export const t: any = (strings: any, ...values: any[]) => {
  if (strings?.raw || Array.isArray(strings)) return compile(strings, ...values)
  if (typeof strings === 'object' && strings !== null) return strings.message ?? strings.id ?? ''
  return strings
}
export const msg: any = (strings: any, ...values: any[]) => {
  const s = compile(strings, ...values)
  return { id: s, message: s }
}
export const defineMessage = msg
export const plural = (value: any, opts: any) => String(opts?.other ?? '').replace('#', String(value))
export const select = (value: any, opts: any) => opts?.[value] ?? opts?.other ?? ''
export const selectOrdinal = plural
