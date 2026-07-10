import { getTranslations } from 'next-intl/server'
import { profile } from '@portfolio/content'

export async function SiteFooter() {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className='border-t'>
      <div className='text-muted-foreground mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row'>
        <p>
          © {year} {profile.name}. {t('rights')}
        </p>
        <p>{t('builtWith')}</p>
      </div>
    </footer>
  )
}
