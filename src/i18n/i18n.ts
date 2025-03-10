import 'server-only'
import '@/libs/dayjs'
import linguiConfig from '../../lingui.config'
import { I18n, Messages, setupI18n } from '@lingui/core'
import dayjs from 'dayjs'

import { dayjsLocaleMap, dayjsLocales } from '@/libs/dayjs'

const { locales } = linguiConfig
// optionally use a stricter union type
type SupportedLocales = string

async function loadCatalog(locale: SupportedLocales): Promise<{
  [k: string]: Messages
}> {
  const { messages } = await import(`./locales/${locale}/messages.po`)
  return {
    [locale]: messages
  }
}
const catalogs = await Promise.all(locales.map(loadCatalog))

// transform array of catalogs into a single object
export const allMessages = catalogs.reduce((acc, oneCatalog) => {
  return { ...acc, ...oneCatalog }
}, {})

type AllI18nInstances = { [K in SupportedLocales]: I18n }

export const allI18nInstances: AllI18nInstances = locales.reduce((acc, locale) => {
  const messages = allMessages[locale] ?? {}
  const i18n = setupI18n({
    locale,
    messages: { [locale]: messages }
  })
  return { ...acc, [locale]: i18n }
}, {})

export const getI18nInstance = async (locale: SupportedLocales): Promise<I18n> => {
  if (!allI18nInstances[locale]) {
    console.warn(`No i18n instance found for locale "${locale}"`)
  }

  if (dayjsLocales[locale]) {
    await dayjsLocales[locale]()
    dayjs.locale(dayjsLocaleMap[locale])
  }

  return allI18nInstances[locale]! || allI18nInstances['vi-VN']!
}
