import { Badge } from '@portfolio/ui'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Reveal } from '@portfolio/ui/motion'
import { Container, NavigationLink } from '@/components/atoms'
import { slug } from 'github-slugger'
import { getTagData, mapLocale } from '@/utils/content'
import { withOg } from '@/utils/og-meta'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return withOg({
    locale,
    path: '/tags',
    title: t('Common.tags'),
    description: t('Tags.thingsIBlogAbout'),
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tagCounts = getTagData(mapLocale(locale))
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => (tagCounts[b] ?? 0) - (tagCounts[a] ?? 0))
  return (
    <Container className='pt-4 md:pt-0'>
      <div className='flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700'>
        <div className='space-x-2 pt-6'>
          <h1 className='heading-page text-gray-900 md:border-r-2 md:px-6 dark:text-gray-100'>Tags</h1>
        </div>
        <div className='my-8 flex flex-wrap gap-x-4 gap-y-4 py-4 md:my-0 md:py-8'>
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((text, idx) => {
            const tagName = text.split(' ').join('-')
            return (
              <NavigationLink key={text} href={`/tags/${slug(text)}`}>
                <Reveal delay={idx * 0.1}>
                  <li
                    data-umami-event={`tag-${tagName}`}
                    className='flex items-center justify-between gap-2 rounded-md bg-black p-3 text-white dark:bg-white dark:text-black'
                  >
                    <span className='font-medium'>{tagName}</span>
                    <Badge variant={'secondary'} className='rounded-full px-1.5'>
                      {tagCounts[text]}
                    </Badge>
                  </li>
                </Reveal>
              </NavigationLink>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
