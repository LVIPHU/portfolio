import { createStatsHandlers } from '@portfolio/service/stats/handlers'

export const { GET, POST } = createStatsHandlers({
  databaseUrl: process.env.DATABASE_URL,
})
