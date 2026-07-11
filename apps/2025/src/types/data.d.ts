import type { Post } from '@portfolio/content'

/** Shape của hệ content cũ, giờ neo vào Post của @portfolio/content (C5) */
export type MDXDocument = Post
export type MDXDocumentDate = Post

export type CoreContent<T> = Omit<T, 'content'>
