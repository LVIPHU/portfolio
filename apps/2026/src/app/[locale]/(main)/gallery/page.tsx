import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { gallery, type Locale } from '@portfolio/content'
import { AppearTitle } from '@/components/showcase/effects/appear-title'
import { t } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'vi' ? 'Ảnh' : 'Gallery' }
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tGallery = await getTranslations('gallery')

  return (
    <div>
      <header className='py-8'>
        <h1 className='h2'>
          <AppearTitle>{tGallery('title')}</AppearTitle>
        </h1>
        <p className='p text-muted-foreground mt-4 max-w-xl'>{tGallery('description')}</p>
      </header>

      <div className='mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4'>
        {gallery.map((item) => (
          <figure key={item.src} className='bg-card break-inside-avoid overflow-hidden border'>
            <img src={item.src} alt={item.alt} loading='lazy' className='w-full object-cover' />
            <figcaption className='flex items-baseline justify-between gap-2 p-3'>
              <span className='p'>{t(item.caption, locale)}</span>
              <span className='p-xs text-muted-foreground shrink-0'>{item.date}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
