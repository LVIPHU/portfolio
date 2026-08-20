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
  // Tăng lượt xem PHẢI do server làm: client đọc-rồi-ghi thì con số nó gửi có thể đã cũ, mà
  // updateBlogStats không bao giờ hạ giá trị nên lượt xem đó biến mất không dấu vết.
  incrementViews: z.boolean().optional(),
})

export type StatsQuery = z.infer<typeof statsQuerySchema>
export type StatsUpdateBody = z.infer<typeof statsUpdateBodySchema>
