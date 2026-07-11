'use client'
// client component: đổi locale qua router của next-intl (D-10)

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms'

const languages = {
  vi: 'Tiếng Việt',
  en: 'English',
} as const

type Locale = keyof typeof languages

export function LocaleSwitch() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(value: string) {
    router.replace(pathname, { locale: value as Locale })
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder={t('LocaleSwitch.selectATimezone')} />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(languages) as Locale[]).map((value) => (
          <SelectItem value={value} key={value}>
            {languages[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
