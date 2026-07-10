import { BlogMeta } from 'web-2025'

// Dòng meta dưới tiêu đề bài viết: ngày đăng / phút đọc / lượt xem.
// ViewsCounter bên trong fetch /api/stats của app gốc → fail-an-toàn về "0 views".
// Clock của capture cố định 2024-05-15 → getTimeAgo(lastmod) cho giá trị ổn định.
export const PublishedMeta = () => (
  <BlogMeta
    date='2024-04-02T00:00:00.000Z'
    slug='toi-uu-hieu-nang-anh-nextjs'
    type='blog'
    readingTime={{ text: '8 min read', minutes: 7.2, time: 432000, words: 1440 } as any}
  />
)

export const UpdatedMeta = () => (
  <BlogMeta
    date='2023-11-20T00:00:00.000Z'
    lastmod='2024-03-01T00:00:00.000Z'
    slug='kien-truc-react-fiber'
    type='blog'
    readingTime={{ text: '18 min read', minutes: 18, time: 1080000, words: 3600 } as any}
  />
)
