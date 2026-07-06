import { capitalize, cn, kebabCaseToPlainText } from '@/utils'
import { GritBackground, GrowingUnderline, Image, NavigationLink, Zoom } from '@/components/atoms'

export function Banner({ banner, className }: { banner: string; className?: string }) {
  const [path, author, filename] = banner.split('__')
  const handle = path.split('/').pop() || ''
  return (
    <div className={cn('relative', className)}>
      <Credit
        author={author}
        id={filename?.split('.')[0]}
        className={cn([
          'absolute right-4 top-4 z-10',
          'hidden rounded-xl px-3 py-0.5 lg:block',
          'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
        ])}
      />
      <Zoom>
        <Image
          src={banner}
          alt={capitalize(kebabCaseToPlainText(handle)) || 'Article banner photo'}
          width={1600}
          height={900}
          className='h-auto w-full rounded-lg'
        />
      </Zoom>
      <GritBackground className='inset-0 rounded-lg opacity-75' />
    </div>
  )
}

interface CreditProps {
  author: string
  id: string
  className?: string
}

function Credit({ author, id, className }: CreditProps) {
  if (author && id) {
    return (
      <div className={cn('text-sm italic', className)}>
        Photo by{' '}
        <NavigationLink className='font-semibold' href={`https://unsplash.com/@${author}`}>
          <GrowingUnderline data-umami-event='banner-author'>@{author}</GrowingUnderline>
        </NavigationLink>{' '}
        on{' '}
        <NavigationLink className='font-semibold' href={`https://unsplash.com/photos/${id}`}>
          <GrowingUnderline data-umami-event='banner-unsplash'>Unsplash</GrowingUnderline>
        </NavigationLink>
      </div>
    )
  }
  return null
}
