// Xoá thư mục build của DEV (.next) trước mỗi lần khởi động dev.
//
// Vì sao: Turbopack dev đôi khi để .next/dev vào trạng thái hỏng (mọi route trả 404
// dù code đúng). Điều oái oăm là KHỞI ĐỘNG LẠI process KHÔNG chữa được — server mới
// đọc lại đúng .next hỏng trên đĩa; chỉ xoá .next đi mới sạch. Chạy ở predev để mỗi
// `pnpm dev` luôn bắt đầu sạch → không bao giờ kế thừa trạng thái hỏng.
//
// KHÔNG đụng .next-build (output của build local, distDir riêng) — chỉ xoá đúng .next.
import { rmSync } from 'node:fs'

rmSync('.next', { recursive: true, force: true })
console.log('[clean-dev-cache] đã xoá .next (dev khởi động sạch)')
