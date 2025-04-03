import { allBlogs } from '@contentlayer/generated'
import { allCoreContent, sortPosts } from '@/utils'
import { POSTS_PER_PAGE } from '@/constants/post'
import { BlogTemplate } from '@/components/templates/blog'
import { getI18nInstance, initLingui, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'

export async function generateMetadata(props: PageLangParam) {
  const i18n = await getI18nInstance((await props.params).lang)

  return {
    title: t(i18n)`Blog`,
  }
}

export default async function BlogPage(props: PageLangParam) {
  const lang = (await props.params).lang
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }
  await initLingui(lang)

  return <BlogTemplate posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} />
}
