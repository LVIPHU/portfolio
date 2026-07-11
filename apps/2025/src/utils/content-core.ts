import { env } from '@env'
import type { Author, Post, PostMeta } from '@portfolio/content'
import type { Toc } from '@portfolio/mdx'

/**
 * Tầng THUẦN của eo biển content (C5): type + helper không đụng fs —
 * an toàn cho client bundle (đi qua barrel @/utils). Data functions
 * (getAllPosts... — đọc filesystem) nằm ở ./content, CHỈ import trực tiếp
 * từ server code, không qua barrel.
 */

// ---- Types tương thích tên cũ (type-only — erased khi compile) ----
export type { Author, Post, PostMeta }
export type Blog = Post
/** Trước: Omit<T, 'body' | '_raw' | '_id'> — nguồn mới chỉ thừa mỗi content */
export type CoreContent<T> = Omit<T, 'content'>
/** content prop của 3 template post-*: meta + toc do page tính */
export type BlogContent = CoreContent<Blog> & { toc: Toc }

/** Map segment URL [lang] (Lingui, còn tới C6) → locale của @portfolio/content */
export function mapLocale(lang: string): 'vi' | 'en' {
  return lang === 'en-US' ? 'en' : 'vi'
}

const isProduction = env.NEXT_PUBLIC_NODE_ENV === 'production'

export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export function sortPosts<T extends { date: string }>(allBlogs: T[], dateKey: keyof T & string = 'date' as never) {
  return allBlogs.sort((a, b) => dateSortDesc(String(a[dateKey]), String(b[dateKey])))
}

export const omit = <Obj, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Omit<Obj, Keys> => {
  const result = Object.assign({}, obj)
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

export const pick = <Obj, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Pick<Obj, Keys> => {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key]
      return acc
    },
    {} as Pick<Obj, Keys>
  )
}

/** Generic không ràng buộc — dùng được cho mọi shape doc (cũ lẫn Post mới) */
export function coreContent<T>(content: T): CoreContent<T> {
  return omit(content as T & object, ['content' as keyof T]) as CoreContent<T>
}

/** Bỏ content + lọc draft ở production — hành vi y hệt hệ cũ */
export function allCoreContent<T>(contents: T[]): CoreContent<T>[] {
  if (isProduction)
    return contents
      .map((c) => coreContent(c))
      .filter((c) => !('draft' in (c as object) && (c as { draft?: boolean }).draft === true))
  return contents.map((c) => coreContent(c))
}
