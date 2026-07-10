import { PostNav } from 'web-2025'

// Điều hướng cuối bài viết: bài trước bên trái, bài sau bên phải.
// Component xếp cột dưới md: (iframe card trong pane hẹp hơn 768px) → glue CSS
// ép resting state desktop: hàng ngang + space-between (đúng giao diện site thật).
const rowFix = '.pn-fix > div{flex-direction:row!important;justify-content:space-between!important;gap:32px!important}'

export const BetweenPosts = () => (
  <>
    <style>{rowFix}</style>
    <div className='pn-fix' style={{ minWidth: 480 }}>
      <PostNav
        prev={{ path: 'blog/kien-truc-react-fiber', title: 'Kiến trúc React Fiber' }}
        prevLabel='Bài trước'
        next={{ path: 'blog/toi-uu-hieu-nang-anh-nextjs', title: 'Tối ưu hiệu năng ảnh trong Next.js' }}
        nextLabel='Bài sau'
      />
    </div>
  </>
)

export const NextOnly = () => (
  <>
    <style>{rowFix}</style>
    <div className='pn-fix' style={{ minWidth: 480 }}>
      <PostNav
        next={{
          path: 'blog/does-promise-all-run-in-parallel-or-sequential',
          title: 'Does JavaScript Promise.all() run in parallel or sequential?',
        }}
        nextLabel='Next article'
      />
    </div>
  </>
)
