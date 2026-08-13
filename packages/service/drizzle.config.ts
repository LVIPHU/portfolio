import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'drizzle-kit'

const root = dirname(fileURLToPath(import.meta.url))
// Ưu tiên .env local của package, rồi fallback .env.local của web-2025
config({ path: resolve(root, '.env') })
config({ path: resolve(root, '../../apps/2025/.env.local') })

export default defineConfig({
  out: './supabase/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
