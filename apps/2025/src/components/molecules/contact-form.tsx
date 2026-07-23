'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/atoms'

export const ContactForm = () => {
  const t = useTranslations()

  const schema = z.object({
    firstName: z.string().min(1, t('ContactForm.required')),
    lastName: z.string().min(1, t('ContactForm.required')),
    email: z.string().min(1, t('ContactForm.required')).email(t('ContactForm.invalidEmail')),
    subject: z.string().min(1, t('ContactForm.required')),
    message: z.string().min(1, t('ContactForm.required')),
  })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', subject: '', message: '' },
  })

  const onSubmit = (values: FormValues) => {
    const to = SITE_METADATA.email
    const body = `${values.firstName} ${values.lastName}\nEmail: ${values.email}\n\n${values.message}`
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='@container/form'>
        <div className='@sm/form:grid-cols-2 grid grid-cols-1 gap-x-6 gap-y-5'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ContactForm.firstName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('ContactForm.firstNamePlaceholder')} className='h-11' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ContactForm.lastName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('ContactForm.lastNamePlaceholder')} className='h-11' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='col-span-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder={t('ContactForm.emailPlaceholder')} className='h-11' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='subject'
            render={({ field }) => (
              <FormItem className='col-span-full'>
                <FormLabel>{t('ContactForm.subject')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('ContactForm.subjectPlaceholder')} className='h-11' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem className='col-span-full'>
                <FormLabel>{t('ContactForm.message')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('ContactForm.messagePlaceholder')} rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' className='mt-6 w-full' size='lg'>
          {t('ContactForm.sendMessage')}
        </Button>
      </form>
    </Form>
  )
}
