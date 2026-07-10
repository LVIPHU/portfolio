import { PostCardListView } from 'web-2025'

const banner =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/></svg>`
  )

const post = {
  slug: 'kien-truc-react-fiber',
  path: 'blog/kien-truc-react-fiber',
  title: 'Kiến trúc React Fiber',
  summary:
    'React Fiber là một phiên bản tái cấu trúc liên tục của thuật toán cốt lõi của React. Đây là kết quả của hơn hai năm nghiên cứu bởi đội ngũ React.',
  date: '2016-07-19T00:00:00.000Z',
  tags: ['react', 'architecture', 'vietnamese'],
  images: [banner],
  readingTime: { text: '18 min read', minutes: 18 },
  language: 'vi',
}

export const BlogListItem = () => (
  <div style={{ maxWidth: 720 }}>
    <PostCardListView post={post as any} />
  </div>
)

export const NoImageFallback = () => (
  <div style={{ maxWidth: 720 }}>
    <PostCardListView
      post={
        {
          ...post,
          slug: 'does-promise-all-run-in-parallel-or-sequential',
          title: 'Does JavaScript Promise.all() run in parallel or sequential?',
          summary:
            "JavaScript is a single-threaded programming language, so it can't run multiple things at the same time. Promise.all() actually runs promises concurrently!",
          tags: ['javascript', 'promise'],
          images: [banner],
          readingTime: { text: '3 min read', minutes: 3 },
        } as any
      }
    />
  </div>
)
