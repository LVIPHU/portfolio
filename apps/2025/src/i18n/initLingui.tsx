import { getI18nInstance } from './i18n'
import { setI18n } from '@lingui/react/server'

export type PageLangParam = {
  params: Promise<{ lang: string }>
}

export async function initLingui(lang: string) {
  const i18n = await getI18nInstance(lang)
  setI18n(i18n)
  return i18n
}
