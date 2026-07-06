import { allBlogs } from '@contentlayer/generated'
import { allCoreContent, sortPosts } from '@/utils'
import { POSTS_PER_PAGE } from '@/constants/post'
import { BlogTemplate } from '@/components/templates'
import { getI18nInstance, initLingui, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: PageLangParam) {
  const i18n = await getI18nInstance((await props.params).lang)

  return {
    title: t(i18n)`Blog`,
  }
}

type PageBlogParam = {
  params: Promise<{ lang: string; page?: string }>
}

export default async function BlogPage(props: PageBlogParam) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allBlogs))
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

  await initLingui(params.lang)

  return <BlogTemplate posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
}
