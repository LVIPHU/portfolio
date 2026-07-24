import { ListItem } from 'web-2025'

// BẮT BUỘC truyền visible: mặc định là false (chờ scroll reveal) → không có nó card trắng.
export const ProjectList = () => (
  <div style={{ width: 620, maxWidth: '100%' }}>
    <ListItem title='Portfolio Monorepo' source='Next.js · TypeScript · Turborepo' href='#' index={0} visible />
    <ListItem title='Sample Project A' source='React · Node.js' href='#' index={1} visible />
    <ListItem title='Orbit UI' source='Base UI · Tailwind' href='#' index={2} visible />
  </div>
)

export const SingleRow = () => (
  <div style={{ width: 620, maxWidth: '100%' }}>
    <ListItem title='Xây dựng portfolio bằng monorepo' source='6/7/2026' href='#' index={0} visible />
  </div>
)
