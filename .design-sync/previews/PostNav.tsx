import { PostNav } from 'web-2025'

// Điều hướng cuối bài viết: bài trước bên trái, bài sau bên phải (label + link
// gạch chân grow khi hover).
export const BetweenPosts = () => (
  <PostNav
    prev={{ path: 'blog/kien-truc-react-fiber', title: 'Kiến trúc React Fiber' }}
    prevLabel="Bài trước"
    next={{ path: 'blog/toi-uu-hieu-nang-anh-nextjs', title: 'Tối ưu hiệu năng ảnh trong Next.js' }}
    nextLabel="Bài sau"
  />
)

export const NextOnly = () => (
  <PostNav
    next={{
      path: 'blog/does-promise-all-run-in-parallel-or-sequential',
      title: 'Does JavaScript Promise.all() run in parallel or sequential?',
    }}
    nextLabel="Next article"
  />
)
