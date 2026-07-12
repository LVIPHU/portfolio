import { getPostsWithAuthors, mapLocale } from '@/utils/content'
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

type PageBlogParam = {
  params: Promise<{ locale: string; page?: string }>
}

export default async function BlogPage(props: PageBlogParam) {
  const params = await props.params
  // getAllPosts đã sort + lọc draft + bỏ content (per-locale, fallback slug thiếu — D-04)
  // + enrich author cho card grid/list
  const posts = getPostsWithAuthors(mapLocale(params.locale))
  const pageNumber = parseInt(params.page as string) || 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return <BlogTemplate posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
}
