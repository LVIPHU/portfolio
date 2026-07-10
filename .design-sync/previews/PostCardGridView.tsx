import { PostCardGridView } from 'web-2025'

const bannerVi =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/></svg>`
  )

const bannerEn =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#ef4444"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/></svg>`
  )

const postVi = {
  slug: 'kien-truc-react-fiber',
  path: 'blog/kien-truc-react-fiber',
  title: 'Kiến trúc React Fiber',
  summary:
    'React Fiber là một phiên bản tái cấu trúc liên tục của thuật toán cốt lõi của React, kết quả của hơn hai năm nghiên cứu bởi đội ngũ React.',
  date: '2024-11-12T00:00:00.000Z',
  tags: ['react', 'architecture'],
  images: [bannerVi],
  readingTime: { text: '18 min read', minutes: 18 },
  language: 'vi',
}

const postEn = {
  slug: 'does-promise-all-run-in-parallel-or-sequential',
  path: 'blog/does-promise-all-run-in-parallel-or-sequential',
  title: 'Does JavaScript Promise.all() run in parallel or sequential?',
  summary:
    "JavaScript is a single-threaded programming language, so it can't run multiple things at the same time. Promise.all() actually runs promises concurrently!",
  date: '2025-03-02T00:00:00.000Z',
  tags: ['javascript', 'promise'],
  images: [bannerEn],
  readingTime: { text: '3 min read', minutes: 3 },
  language: 'en',
}

export const GridCardVi = () => (
  <div style={{ maxWidth: 400 }}>
    <PostCardGridView post={postVi as any} />
  </div>
)

export const GridCardEn = () => (
  <div style={{ maxWidth: 400 }}>
    <PostCardGridView post={postEn as any} />
  </div>
)
