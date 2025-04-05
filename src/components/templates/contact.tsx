import { ContactForm } from '@/components/molecules'
import { Card, CardContent, Container, NavigationLink } from '@/components/atoms'
import { Facebook, Linkedin, MailIcon, PhoneIcon } from 'lucide-react'
import { Header } from '@/components/organisms'
import { SITE_METADATA } from '@data/site-metadata'

export const ContactTemplate = () => {
  return (
    <Container>
      <Header
        title={'Contact'}
        description={'Id love to hear from you. Please fill out this form or shoot us an email.'}
      />
      <div className='mt-24 grid gap-16 md:gap-10 lg:grid-cols-2'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2'>
          <div>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <MailIcon />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Email</h3>
            <p className='my-2.5 text-muted-foreground'>Our friendly team is here to help.</p>
            <NavigationLink className='font-medium text-primary' href='mailto:akashmoradiya3444@gmail.com'>
              {SITE_METADATA.email}
            </NavigationLink>
          </div>
          <div>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <PhoneIcon />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Phone</h3>
            <p className='my-2.5 text-muted-foreground'>Mon-Fri from 8am to 5pm.</p>
            <NavigationLink className='font-medium text-primary' href='tel:akashmoradiya3444@gmail.com'>
              +48 528-307-775
            </NavigationLink>
          </div>
          <div>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Facebook />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Facebook</h3>
            <p className='my-2.5 text-muted-foreground'>Our friendly team is here to help.</p>
            <NavigationLink className='font-medium text-primary' href='#'>
              Start new chat
            </NavigationLink>
          </div>
          <div>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Linkedin />
            </div>
            <h3 className='mt-6 text-xl font-semibold'>Linkedin</h3>
            <NavigationLink className='font-medium text-primary'>Hire me</NavigationLink>
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
