import { ContactTemplate } from '@/components/templates'
import { PageLangParam } from '@/i18n'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations()

  return {
    title: t('Common.contact'),
  }
}

export default async function ContactPage(props: PageLangParam) {
  const lang = (await props.params).locale
  return <ContactTemplate />
}
