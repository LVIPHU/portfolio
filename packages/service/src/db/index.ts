import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export type Database = PostgresJsDatabase<typeof schema>

const cache = new Map<string, Database>()

/**
 * Tạo (hoặc tái dùng) client Drizzle. Không throw khi thiếu URL —
 * trả null để queries soft-fail zeros.
 */
export function createDb(databaseUrl: string | undefined): Database | null {
  if (!databaseUrl) return null

  const cached = cache.get(databaseUrl)
  if (cached) return cached

  const client = postgres(databaseUrl, { max: 1, connect_timeout: 5 })
  const db = drizzle(client, { schema })
  cache.set(databaseUrl, db)
  return db
}

export { schema }
