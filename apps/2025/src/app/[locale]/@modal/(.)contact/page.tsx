import { ContactForm, Modal } from '@/components/molecules'
import { PageLangParam } from '@/i18n'
import { getTranslations } from 'next-intl/server'

export default async function ContactModal(props: PageLangParam) {
  const lang = (await props.params).locale
  const t = await getTranslations()
  return (
    <Modal title={t('ContactModal.chatWithMe')} description={t('Common.iDLoveTo')}>
      <ContactForm />
    </Modal>
  )
}
