import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className='flex min-h-[70svh] flex-col items-center justify-center gap-6 py-24 text-center'>
      <p className='h1 text-primary'>404</p>
      <h1 className='h3'>{t('title')}</h1>
      <p className='p text-muted-foreground'>{t('description')}</p>
      <Link
        href='/'
        className='p-s border-primary text-foreground hover:bg-primary hover:text-primary-foreground mt-2 inline-flex items-center border px-5 py-3 transition-colors'
      >
        {t('backHome')}
      </Link>
    </div>
  )
}
