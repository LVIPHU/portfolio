import { AnimatePresence } from 'framer-motion'
import type { CoreContent } from '@/types/data'
import type { Blog } from '@contentlayer/generated'
import { PostCardGridView } from '@/components/molecules'
import { AnimatedContent } from '@/components/atoms'

type ListViewProps = {
  posts: CoreContent<Blog>[]
}

export const GridView = (props: ListViewProps) => {
  const { posts } = props

  return (
    <ul className='grid grid-cols-1 gap-5 md:gap-10 lg:grid-cols-2 xl:grid-cols-3'>
      {posts && (
        <AnimatePresence>
          {posts.map((post, idx) => (
            <li key={post.path}>
              <AnimatedContent className={'h-full'} direction={'horizontal'} reverse={true} delay={idx * 0.1}>
                <PostCardGridView key={post.path} post={post} />
              </AnimatedContent>
            </li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  )
}
