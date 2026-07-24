// Xoá thư mục build của DEV (.next) trước mỗi lần khởi động dev.
//
// Vì sao: Turbopack dev đôi khi để .next/dev vào trạng thái hỏng (mọi route trả 404
// dù code đúng). Khởi động lại process KHÔNG chữa được — server mới đọc lại đúng .next
// hỏng trên đĩa; chỉ xoá .next mới sạch. Chạy ở predev để mỗi `pnpm dev` luôn sạch.
//
// KHÔNG đụng .next-build (output build local, distDir riêng) — chỉ xoá đúng .next.
import { rmSync } from 'node:fs'

rmSync('.next', { recursive: true, force: true })
console.log('[clean-dev-cache] đã xoá .next (dev khởi động sạch)')
