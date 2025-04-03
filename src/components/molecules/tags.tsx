import { clsx } from 'clsx'
import { slug } from 'github-slugger'
import { Badge, NavigationLink } from '@/components/atoms'

export function TagsList({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-2 md:gap-3'>
      {tags.map((tag) => (
        <Tag key={tag} text={tag} />
      ))}
    </div>
  )
}

export function Tag({ text, size = 'sm' }: { text: string; size?: 'sm' | 'md' }) {
  const tagName = text.split(' ').join('-')
  return (
    <NavigationLink href={`/tags/${slug(text)}`}>
      <Badge className={size === 'sm' ? 'text-sm' : 'text-base'} data-umami-event={`tag-${tagName}`}>
        {tagName}
      </Badge>
    </NavigationLink>
  )
}
