// Shim @lingui/react RUNTIME — bundle DS không có I18nProvider thật; passthrough chuỗi gốc.
// (Khác lingui-react-macro.tsx: đây là bản cho import '@lingui/react' trần, vd project-card, locale-switch.)
export { Trans, useLingui } from './lingui-react-macro'

export function I18nProvider({ children }: any) {
  return <>{children}</>
}
