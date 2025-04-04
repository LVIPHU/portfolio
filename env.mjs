import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

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

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_GISCUS_REPO: process.env.NEXT_PUBLIC_GISCUS_REPO,
    NEXT_PUBLIC_GISCUS_REPOSITORY_ID: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
    NEXT_PUBLIC_GISCUS_CATEGORY: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  },
})
