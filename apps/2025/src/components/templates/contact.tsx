import { ContactForm } from '@/components/molecules'
import { Card, CardContent, Container, NavigationLink } from '@/components/atoms'
import { Facebook, Linkedin, MailIcon, PhoneIcon } from 'lucide-react'
import { Header } from '@/components/organisms'
import { SITE_METADATA } from '@data/site-metadata'
import { Trans } from '@lingui/react/macro'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

export const ContactTemplate = () => {
  const { i18n } = useLingui()
  return (
    <Container>
      <Header
        title={t(i18n)`Contact`}
        description={t(i18n)`I'd love to hear from you. Please fill out this form or send me an email.`}
      />
      <div className='mt-24 grid gap-16 md:gap-10 lg:grid-cols-2'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2'>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <MailIcon />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Email</h3>
            <p className='text-muted-foreground my-2.5'>
              <Trans>I will always be ready to support you.</Trans>
            </p>
            <NavigationLink className='text-primary font-medium' href={`mailto:${SITE_METADATA.email}`}>
              {SITE_METADATA.email}
            </NavigationLink>
          </div>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <PhoneIcon />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>
              <Trans>Phone</Trans>
            </h3>
            <p className='text-muted-foreground my-2.5'>
              <Trans>Mon-Fri from 8am to 5pm.</Trans>
            </p>
            <NavigationLink className='text-primary font-medium' href={`tel:${SITE_METADATA.email}`}>
              +84 528-307-775
            </NavigationLink>
          </div>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <Facebook />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Facebook</h3>
            <p className='text-muted-foreground my-2.5'>
              <Trans>I will always be ready to support you.</Trans>
            </p>
            <NavigationLink className='text-primary font-medium' href='#'>
              <Trans>Start new chat</Trans>
            </NavigationLink>
          </div>
          <div>
            <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
              <Linkedin />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>LinkedIn</h3>
            <NavigationLink href={SITE_METADATA.linkedIn} className='text-primary font-medium'>
              <Trans>Hire me</Trans>
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
