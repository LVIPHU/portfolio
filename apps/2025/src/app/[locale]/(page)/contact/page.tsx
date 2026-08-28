import { ContactTemplate } from '@/components/templates'
import { PageLangParam } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { withOg } from '@/utils/og-meta'

export async function generateMetadata(props: PageLangParam) {
  const { locale } = await props.params
  const t = await getTranslations({ locale })

  return withOg({
    locale,
    path: '/contact',
    title: t('Common.contact'),
    description: t('Contact.subtitle'),
  })
}

export default async function ContactPage(props: PageLangParam) {
  const { locale } = await props.params
  setRequestLocale(locale)
  return <ContactTemplate />
}
