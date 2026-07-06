import { NavigationLink } from '@/components/atoms/index'

export function DiscussOnX({ postUrl }: { postUrl: string }) {
  return (
    <NavigationLink
      className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
      href={`https://x.com/search?q=${encodeURIComponent(postUrl)}`}
      rel='nofollow'
    >
      <span data-umami-event='discuss-on-x'>
        Discuss on <span className='font-semibold'>X</span>
        <span className='hidden font-semibold md:inline'> (Twitter)</span>
      </span>
    </NavigationLink>
  )
}
