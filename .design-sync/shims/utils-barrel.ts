// Shim barrel @/utils — khớp apps/2025/src/utils (helpers thuần lấy từ @portfolio/utils).
// './icons' thay bằng icons-safe (xem gen-icons-safe.mjs).
export * from '../../apps/2025/src/utils/content-core'
export * from '../.cache/icons-safe'
export * from '../../apps/2025/src/utils/image'
export * from '../../apps/2025/src/utils/sound'
export {
  capitalize,
  cn,
  escape,
  escapeHtml,
  fetcher,
  formatDate,
  getTimeAgo,
  kebabCaseToPlainText,
  omit,
  sortPosts,
} from '../../packages/utils/src/index.ts'
