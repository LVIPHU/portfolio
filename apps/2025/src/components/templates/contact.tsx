import { ContactForm } from '@/components/molecules'
import { Card, CardContent, Container, NavigationLink } from '@/components/atoms'
import { MailIcon, PhoneIcon } from 'lucide-react'
import { Facebook, Linkedin } from '@/utils'
import { Header } from '@/components/organisms'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { useTranslations } from 'next-intl'

export const ContactTemplate = () => {
  const t = useTranslations()
  return (
    <Container>
      <Header title={t('Common.contact')} description={t('Common.iDLoveTo')} />
      <div className='mt-24 grid gap-16 md:gap-10 lg:grid-cols-2'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2'>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <MailIcon />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Email</h3>
            <p className='text-muted-foreground my-2.5'>{t('Contact.iWillAlwaysBe')}</p>
            <NavigationLink className='text-primary font-medium' href={`mailto:${SITE_METADATA.email}`}>
              {SITE_METADATA.email}
            </NavigationLink>
          </div>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <PhoneIcon />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>{t('Contact.phone')}</h3>
            <p className='text-muted-foreground my-2.5'>{t('Contact.monFriFrom8am')}</p>
            <NavigationLink className='text-primary font-medium' href={`tel:${SITE_METADATA.email}`}>
              +84 528-307-775
            </NavigationLink>
          </div>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <Facebook />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Facebook</h3>
            <p className='text-muted-foreground my-2.5'>{t('Contact.iWillAlwaysBe')}</p>
            <NavigationLink className='text-primary font-medium' href='#'>
              {t('Contact.startNewChat')}
            </NavigationLink>
          </div>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <Linkedin />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>LinkedIn</h3>
            <NavigationLink href={SITE_METADATA.linkedIn} className='text-primary font-medium'>
              {t('Contact.hireMe')}
            </NavigationLink>
          </div>
        </div>
        <Card>
          <CardContent className='p-6 md:p-10'>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
