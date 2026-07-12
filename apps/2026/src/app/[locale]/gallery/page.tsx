import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { gallery, type Locale } from '@portfolio/content'
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
      <h1 className='text-3xl font-bold tracking-tight'>{tGallery('title')}</h1>
      <p className='text-muted-foreground mt-2'>{tGallery('description')}</p>

      <div className='mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4'>
        {gallery.map((item) => (
          <figure key={item.src} className='bg-card break-inside-avoid overflow-hidden rounded-xl border'>
            <img src={item.src} alt={item.alt} loading='lazy' className='w-full object-cover' />
            <figcaption className='flex items-baseline justify-between gap-2 p-3 text-sm'>
              <span>{t(item.caption, locale)}</span>
              <span className='text-muted-foreground shrink-0 text-xs'>{item.date}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
