import { ContactForm, Modal } from '@/components/molecules'

export default async function ContactModalPage() {
  return (
    <Modal
      title={'Chat with me'}
      description={'Id love to hear from you. Please fill out this form or shoot us an email.'}
    >
      <ContactForm />
    </Modal>
  )
}
