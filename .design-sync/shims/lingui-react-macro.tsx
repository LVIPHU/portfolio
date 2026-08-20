// Shim @lingui/react/macro — Trans render children/message thuần, useLingui trả i18n passthrough.
export { t, msg, defineMessage, plural, select, selectOrdinal } from './lingui-macro'
import { t as tImpl } from './lingui-macro'

export function Trans({ children, message, id }: any) {
  // Không dùng JSX — design-sync không luôn resolve `react/jsx-runtime`.
  return children ?? message ?? id ?? null
}

const passthrough = (d: any) => (typeof d === 'string' ? d : (d?.message ?? d?.id ?? ''))

export const useLingui = () => ({
  t: tImpl,
  _: passthrough,
  i18n: { _: passthrough, locale: 'en' },
})
