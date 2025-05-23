import { env } from '@env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './supabase/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
})
