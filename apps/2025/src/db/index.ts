import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '@env'

if (!env.DATABASE_URL) {
  throw new Error('process.env.DATABASE_URL is not set!')
}

export const db = drizzle(env.DATABASE_URL)
