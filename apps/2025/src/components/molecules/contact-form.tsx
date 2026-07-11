import { useTranslations } from 'next-intl'
import { Button, Input, Label, Textarea } from '@/components/atoms'

export const ContactForm = () => {
  const t = useTranslations()
  return (
    <form>
      <div className='grid gap-x-8 gap-y-5 md:grid-cols-2'>
        <div className='col-span-2 sm:col-span-1'>
          <Label htmlFor='firstName'>{t('ContactForm.firstName')}</Label>
          <Input placeholder={t('ContactForm.firstName')} id='firstName' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2 sm:col-span-1'>
          <Label htmlFor='lastName'>{t('ContactForm.lastName')}</Label>
          <Input placeholder={t('ContactForm.lastName')} id='lastName' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' placeholder='Email' id='email' className='mt-1.5 h-11 bg-white shadow-none' />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='tel'>{t('ContactForm.phoneNumber')}</Label>
          <Input
            type='tel'
            placeholder={t('ContactForm.phoneNumber')}
            id='tel'
            className='mt-1.5 h-11 bg-white shadow-none'
          />
        </div>
        <div className='col-span-2'>
          <Label htmlFor='message'>{t('ContactForm.message')}</Label>
          <Textarea
            id='message'
            placeholder={t('ContactForm.message')}
            className='mt-1.5 bg-white shadow-none'
            rows={6}
          />
        </div>
      </div>
      <Button className='mt-6 w-full' size='lg'>
        {t('ContactForm.submit')}
      </Button>
    </form>
  )
}
