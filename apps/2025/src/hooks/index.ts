// C12 (D-05): hook dùng chung đã lên @portfolio/ui/hooks (bản ui giống hệt + 'use client')
// → re-export từ đó, xóa bản trùng trong app. use-blog-stats ĐẶC THÙ app (DB) giữ local.
export * from './use-blog-stats'
export * from '@portfolio/ui/hooks'
