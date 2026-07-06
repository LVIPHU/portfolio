import tagData from '@json/tag-data.json'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'
import { AnimatedContent, Badge, Container, NavigationLink } from '@/components/atoms'
import { slug } from 'github-slugger'

export async function generateMetadata(props: PageLangParam) {
  const i18n = await getI18nInstance((await props.params).lang)

  return {
    title: t(i18n)`Tags`,
    description: t(i18n)`Things I blog about`,
  }
}

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <Container className='pt-4 md:pt-0'>
      <div className='flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0'>
        <div className='space-x-2 pt-6'>
          <h1 className='md:leading-14 text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl'>
            Tags
          </h1>
        </div>
        <div className='my-8 flex flex-wrap gap-x-4 gap-y-4 py-4 md:my-0 md:py-8'>
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((text, idx) => {
            const tagName = text.split(' ').join('-')
            return (
              <NavigationLink key={text} href={`/tags/${slug(text)}`}>
                <AnimatedContent delay={idx * 0.1}>
                  <li
                    data-umami-event={`tag-${tagName}`}
                    className='flex items-center justify-between gap-2 rounded-md bg-black p-3 text-white dark:bg-white dark:text-black'
                  >
                    <span className='font-medium'>{tagName}</span>
                    <Badge variant={'secondary'} className='rounded-full px-1.5'>
                      {tagCounts[text]}
                    </Badge>
                  </li>
                </AnimatedContent>
              </NavigationLink>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
