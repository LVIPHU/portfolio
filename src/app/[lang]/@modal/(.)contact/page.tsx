import { ContactForm, Modal } from '@/components/molecules'
import { getI18nInstance, initLingui, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'

export default async function ContactModal(props: PageLangParam) {
  const lang = (await props.params).lang
  const i18n = await getI18nInstance(lang)
  await initLingui(lang)
  return (
    <Modal
      title={t(i18n)`Chat with me`}
      description={t(i18n)`I'd love to hear from you. Please fill out this form or send me an email.`}
    >
      <ContactForm />
    </Modal>
  )
}
