import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.string().refine((value) => ['development', 'production'].includes(value), {
      message: "NODE_ENV must be 'development' or 'production'"
    }),
    GITHUB_API_TOKEN: z.string().optional(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
  }
})
