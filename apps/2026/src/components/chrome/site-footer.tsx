import { getTranslations } from 'next-intl/server'
import { profile } from '@portfolio/content'
import { Link } from '@portfolio/i18n/navigation'

export async function SiteFooter() {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className='border-t'>
      <div
        className='text-muted-foreground flex w-full flex-col items-center justify-between gap-2 py-6 sm:flex-row'
        style={{ paddingInline: 'var(--safe)' }}
      >
        <p className='p-xs'>
          © {year} {profile.name}. {t('rights')}
        </p>
        <div className='flex items-center gap-4'>
          <Link href='/privacy' className='p-xs hover:text-foreground hover:underline'>
            {t('privacy')}
          </Link>
          <p className='p-xs'>{t('builtWith')}</p>
        </div>
      </div>
    </footer>
  )
}
