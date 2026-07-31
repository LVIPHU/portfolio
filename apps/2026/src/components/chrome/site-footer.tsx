import { getTranslations } from 'next-intl/server'
import { profile } from '@portfolio/content'

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
        <p className='p-xs'>{t('builtWith')}</p>
      </div>
    </footer>
  )
}
