import { z } from 'zod'

export const statsTypeSchema = z.enum(['blog'])

export const statsQuerySchema = z.object({
  type: statsTypeSchema,
  slug: z.string().min(1).max(255),
})

const SLUG_LIST_MAX = 50

/** GET ?type=blog&slugs=a,b,c — tối đa 50 slug, chống N request trên list. */
export const statsListQuerySchema = z.object({
  type: statsTypeSchema,
  slugs: z
    .string()
    .min(1)
    .transform((raw) =>
      [
        ...new Set(
          raw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        ),
      ].slice(0, SLUG_LIST_MAX)
    )
    .refine((slugs) => slugs.length > 0 && slugs.every((s) => s.length <= 255), {
      message: 'Invalid slug list',
    }),
})

/** Delta phản ứng: chỉ +1…+5 mỗi request — không nhận giá trị tuyệt đối. */
const reactionDelta = z.number().int().min(1).max(5).optional()

export const statsUpdateBodySchema = z
  .object({
    type: statsTypeSchema,
    slug: z.string().min(1).max(255),
    incrementViews: z.boolean().optional(),
    loves: reactionDelta,
    applauses: reactionDelta,
    ideas: reactionDelta,
    bullseyes: reactionDelta,
  })
  .refine((body) => body.incrementViews === true || body.loves || body.applauses || body.ideas || body.bullseyes, {
    message: 'No increment specified',
  })

export type StatsQuery = z.infer<typeof statsQuerySchema>
export type StatsListQuery = z.infer<typeof statsListQuerySchema>
export type StatsUpdateBody = z.infer<typeof statsUpdateBodySchema>
