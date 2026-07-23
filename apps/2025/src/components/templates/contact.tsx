import { ContactForm, ContactInfo } from '@/components/molecules'
import { Card, CardContent, Container } from '@/components/atoms'
import { useTranslations } from 'next-intl'

export const ContactTemplate = () => {
  const t = useTranslations()
  return (
    <Container className='pt-4 lg:pt-12'>
      <div className='max-w-2xl'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>{t('Contact.contactMe')}</h1>
        <p className='text-muted-foreground mt-3 text-base'>{t('Contact.subtitle')}</p>
      </div>

      <div className='mt-10 grid gap-10 lg:grid-cols-2'>
        <ContactInfo />
        <Card>
          <CardContent className='p-6 md:p-8'>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
