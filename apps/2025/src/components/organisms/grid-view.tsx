import type { CSSProperties } from 'react'
import type { CoreContent } from '@/types/data'
import type { Blog } from '@/utils/content'
import { PostCardGridView } from '@/components/molecules'

type ListViewProps = {
  posts: CoreContent<Blog>[]
}

// C9 (D-03/D-04): gỡ lib animation cũ + AnimatedContent — stagger fade-in bằng CSS
// (.fade-in-up + --i inline). Không còn exit animation (chủ đích D-04).
export const GridView = (props: ListViewProps) => {
  const { posts } = props

  return (
    <ul className='grid grid-cols-1 gap-5 md:gap-10 lg:grid-cols-2 xl:grid-cols-3'>
      {posts?.map((post, idx) => (
        <li key={post.path} className='fade-in-up h-full' style={{ '--i': idx } as CSSProperties}>
          <PostCardGridView post={post} />
        </li>
      ))}
    </ul>
  )
}
