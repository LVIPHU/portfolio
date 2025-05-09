import { AnimatePresence } from 'framer-motion'
import type { Blog } from '@contentlayer/generated'
import { PostCardListView } from '@/components/molecules'
import type { CoreContent } from '@/types/data'
import { AnimatedContent } from '@/components/atoms'

type ListViewProps = {
  posts: CoreContent<Blog>[]
}

export const ListView = (props: ListViewProps) => {
  const { posts } = props
  return (
    <ul className='grid gap-y-12 md:gap-y-20'>
      {posts && (
        <AnimatePresence>
          {posts.map((post, idx) => (
            <li key={post.path}>
              <AnimatedContent delay={idx * 0.1}>
                <PostCardListView post={post} />
              </AnimatedContent>
            </li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  )
}
