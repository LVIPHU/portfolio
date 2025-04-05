import { AnimatePresence, motion } from 'framer-motion'
import type { CoreContent } from '@/types/data'
import type { Blog } from '@contentlayer/generated'
import { PostCardGridView } from '@/components/molecules'

type ListViewProps = {
  posts: CoreContent<Blog>[]
}

export const GridView = (props: ListViewProps) => {
  const { posts } = props

  return (
    <ul className='grid grid-cols-1 gap-x-8 gap-y-16 md:gap-y-16 lg:grid-cols-2 xl:grid-cols-3'>
      {posts && (
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.li
              layout
              key={post.path}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }}
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.5 } }}
            >
              <PostCardGridView key={post.path} post={post} />
            </motion.li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  )
}
