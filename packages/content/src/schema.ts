import { z } from 'zod'

/**
 * Frontmatter hợp nhất cho blog (chuẩn hóa theo field của 2025).
 * Validate fail-fast lúc build/SSG — sai frontmatter là dừng build với đường dẫn file.
 */
export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  lastmod: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  summary: z.string().default(''),
  images: z.array(z.string()).default([]),
  authors: z.array(z.string()).default([]),
  layout: z.enum(['PostLayout', 'PostSimple', 'PostBanner']).optional(),
  canonicalUrl: z.string().url().optional(),
})

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>

export const authorFrontmatterSchema = z.object({
  name: z.string().min(1),
  avatar: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  twitter: z.string().optional(),
  x: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
})

export type AuthorFrontmatter = z.infer<typeof authorFrontmatterSchema>
