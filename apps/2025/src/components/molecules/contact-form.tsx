import { Button, Input, Label, Textarea } from '@/components/atoms'
import { Trans } from '@lingui/react/macro'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

export const ContactForm = () => {
  const { i18n } = useLingui()
  return (
    <form>
      <div className='grid gap-x-8 gap-y-5 md:grid-cols-2'>
        <div className='col-span-2 sm:col-span-1'>
          <Label htmlFor='firstName'>{t(i18n)`First name`}</Label>
          <Input placeholder={t(i18n)`First name`} id='firstName' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2 sm:col-span-1'>
          <Label htmlFor='lastName'>{t(i18n)`Last name`}</Label>
          <Input placeholder={t(i18n)`Last name`} id='lastName' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' placeholder='Email' id='email' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='tel'>{t(i18n)`Phone Number`}</Label>
          <Input type='tel' placeholder={t(i18n)`Phone Number`} id='tel' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='message'>{t(i18n)`Message`}</Label>
          <Textarea id='message' placeholder={t(i18n)`Message`} className='mt-1.5 bg-white shadow-none' rows={6} />
        </div>
      </div>
      <Button className='mt-6 w-full' size='lg'>
        <Trans>Submit</Trans>
      </Button>
    </form>
  )
}
