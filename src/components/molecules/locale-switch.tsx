'use client'
// this is a client component because it uses the `useState` hook

import { useState } from 'react'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { usePathname, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms'

type LOCALES = 'en' | 'vn' | 'pseudo'

const languages = {
  en: msg`English`,
  vn: msg`Tiếng Việt`
} as const

export function LocaleSwitch() {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(pathname?.split('/')[1] as LOCALES)

  // disabled for DEMO - so we can demonstrate the 'pseudo' locale functionality
  // if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  //   languages['pseudo'] = t`Pseudo`
  // }

  function handleChange(value: string) {
    const locale = value as LOCALES

    const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
    const newPath = `/${locale}/${pathNameWithoutLocale.join('/')}`

    setLocale(locale)
    router.push(newPath)
  }

  return (
    <Select value={locale} defaultValue={locale} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder='Select a timezone' />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(languages).map((locale) => {
          return (
            <SelectItem value={locale} key={locale}>
              {i18n._(languages[locale as keyof typeof languages])}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
