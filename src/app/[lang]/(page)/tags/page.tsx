import tagData from '@json/tag-data.json'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'
import { Container } from '@/components/atoms'
import { Tag } from '@/components/molecules'

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
        <div className='my-8 flex flex-wrap gap-x-5 gap-y-2 py-8 md:my-0 md:py-8'>
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className='flex items-center gap-0.5'>
                <Tag text={t} size='md' />
                <span className='text-gray-600 dark:text-gray-300'>({tagCounts[t]})</span>
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
