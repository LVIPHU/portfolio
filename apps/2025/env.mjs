import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local when not running in Next.js (e.g. scripts)
if (typeof window === 'undefined' && !process.env.NEXT_RUNTIME) {
  config({ path: resolve(process.cwd(), '.env.local') })
}

// Preview deploy trên Vercel KHÔNG có NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_NODE_ENV — hai biến đó chỉ
// được khai ở scope Production, nên mọi preview (mọi PR) chết ngay bước "Collecting page data" với
// "Invalid environment variables". Suy ra từ biến hệ thống của Vercel thay vì bắt khai lại tay: URL
// preview vốn khác nhau theo từng deployment nên hardcode một giá trị chung còn sai hơn (canonical
// và OG sẽ trỏ về bản production).
//
// NEXT_PUBLIC_VERCEL_URL chỉ có khi bật "Automatically expose System Environment Variables" (mặc
// định bật) — giữ thêm VERCEL_URL cho các script chạy ngoài Next (rss.ts), và VERCEL_URL phải được
// khai trong apps/2025/turbo.json vì turbo lược sạch biến không khai.
const vercelHost = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL
const vercelAppUrl = vercelHost ? `https://${vercelHost}` : undefined

export const env = createEnv({
  server: {
    NODE_ENV: z.string().refine((value) => ['development', 'production'].includes(value), {
      message: "NODE_ENV must be 'development' or 'production'",
    }),
    DATABASE_URL: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          try {
            new URL(val)
            return true
          } catch {
            return false
          }
        },
        {
          message: 'DATABASE_URL phải là một URL hợp lệ',
        }
      ),
    GITHUB_API_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_NODE_ENV: z.string().refine((value) => ['development', 'production'].includes(value), {
      message: "NEXT_PUBLIC_NODE_ENV must be 'development' or 'production'",
    }),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_GISCUS_REPO: z.string().optional(),
    NEXT_PUBLIC_GISCUS_REPOSITORY_ID: z.string().optional(),
    NEXT_PUBLIC_GISCUS_CATEGORY: z.string().optional(),
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: z.string().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,

    // Đọc thẳng process.env.NEXT_PUBLIC_* làm nhánh đầu: Next thay thế đúng dạng chữ này lúc build
    // để nhúng vào bundle client — viết vòng vo là mất phép nhúng đó.
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || vercelAppUrl,
    // Chỉ dùng để lọc bài draft (utils/content-core.ts). NODE_ENV là 'production' trong MỌI lần
    // next build, nên preview lọc draft y như production — đúng cái ta muốn xem trước.
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV,
    NEXT_PUBLIC_GISCUS_REPO: process.env.NEXT_PUBLIC_GISCUS_REPO,
    NEXT_PUBLIC_GISCUS_REPOSITORY_ID: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
    NEXT_PUBLIC_GISCUS_CATEGORY: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  },
})
