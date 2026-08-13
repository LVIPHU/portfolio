import { z } from 'zod'

export const statsTypeSchema = z.enum(['blog'])

export const statsQuerySchema = z.object({
  type: statsTypeSchema,
  slug: z.string().min(1).max(255),
})

export const statsUpdateBodySchema = z.object({
  type: statsTypeSchema,
  slug: z.string().min(1).max(255),
  views: z.number().int().nonnegative().optional(),
  loves: z.number().int().nonnegative().optional(),
  applauses: z.number().int().nonnegative().optional(),
  ideas: z.number().int().nonnegative().optional(),
  bullseyes: z.number().int().nonnegative().optional(),
})

export type StatsQuery = z.infer<typeof statsQuerySchema>
export type StatsUpdateBody = z.infer<typeof statsUpdateBodySchema>
