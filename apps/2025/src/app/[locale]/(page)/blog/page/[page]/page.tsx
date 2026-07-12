import { getAllPosts, getPostsWithAuthors, mapLocale } from '@/utils/content'
import { POSTS_PER_PAGE } from '@/constants/post'
import { BlogTemplate } from '@/components/templates'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export async function generateMetadata() {
  const t = await getTranslations()

  return {
    title: t('Common.blog'),
  }
}

// Sinh trang 2..totalPages cho mỗi locale (trang 1 là /blog). Segment tĩnh `page` cụ thể
// hơn catch-all blog/[...slug] nên /blog/page/2 không rơi vào route bài viết.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const total = Math.ceil(getAllPosts(mapLocale(params.locale)).length / POSTS_PER_PAGE)
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }))
}

type PageBlogParam = {
  params: Promise<{ locale: string; page: string }>
}

export default async function BlogPaginatedPage(props: PageBlogParam) {
  const params = await props.params
  // getAllPosts đã sort + lọc draft + bỏ content (per-locale, fallback slug thiếu — D-04)
  // + enrich author cho card grid/list
  const posts = getPostsWithAuthors(mapLocale(params.locale))
  const pageNumber = parseInt(params.page, 10)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  // Trang 1 sống ở /blog; /blog/page/1 và ngoài biên → 404
  if (isNaN(pageNumber) || pageNumber <= 1 || pageNumber > totalPages) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return <BlogTemplate posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
}
