// C8 (D-10): cn 1 nguồn — re-export từ subpath react-free @portfolio/ui/utils.
// KHÔNG import từ barrel chính '@portfolio/ui' vì nó kéo cả component (import
// react) vào script post-build chạy bằng tsx/Node — nơi packages/ui chỉ có
// react ở peer nên Node không phân giải được (bug deploy web-2025 C8).
export { cn } from '@portfolio/ui/utils'
