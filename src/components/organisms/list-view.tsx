import { AnimatePresence, motion } from 'framer-motion'
import type { Blog } from '@contentlayer/generated'
import { PostCardListView } from '@/components/molecules'
import type { CoreContent } from '@/types/data'

type ListViewProps = {
  posts: CoreContent<Blog>[]
}

export const ListView = (props: ListViewProps) => {
  const { posts } = props
  return (
    <ul className='grid gap-y-12 md:gap-y-20'>
      {posts && (
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.li
              key={post.path}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.5 } }}
            >
              <PostCardListView post={post} />
            </motion.li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  )
}
