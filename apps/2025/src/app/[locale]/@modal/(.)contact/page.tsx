import { ContactForm, ContactInfo, Modal } from '@/components/molecules'
import { getTranslations } from 'next-intl/server'

export default async function ContactModal() {
  const t = await getTranslations()
  return (
    <Modal
      title={t('Contact.contactMe')}
      description={t('Contact.subtitle')}
      className='max-h-[90vh] overflow-y-auto sm:max-w-4xl'
    >
      <div className='@container mt-2'>
        <div className='@2xl:grid-cols-2 grid grid-cols-1 gap-8'>
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </Modal>
  )
}
