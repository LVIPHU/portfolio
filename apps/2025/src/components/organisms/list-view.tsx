import type { CSSProperties } from 'react'
import type { PostWithAuthor } from '@/utils/content'
import { PostCardListView } from '@/components/molecules'

type ListViewProps = {
  posts: PostWithAuthor[]
}

// C9 (D-03/D-04): stagger fade-in bằng CSS thuần (.fade-in-up + --i inline),
// thay lib animation cũ. Không còn exit animation (chủ đích D-04).
export const ListView = (props: ListViewProps) => {
  const { posts } = props
  return (
    <ul className='grid gap-y-5 md:gap-y-10'>
      {posts?.map((post, idx) => (
        <li key={post.path} className='fade-in-up' style={{ '--i': idx } as CSSProperties}>
          <PostCardListView post={post} />
        </li>
      ))}
    </ul>
  )
}
