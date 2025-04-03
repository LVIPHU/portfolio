import { allBlogs } from '@contentlayer/generated'
import { allCoreContent, sortPosts } from '@/utils'
import { genPageMetadata } from '@/app/seo'
import { POSTS_PER_PAGE } from '@/constants/post'
import { BlogTemplate } from '@/components/templates/blog'

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <BlogTemplate posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} title='All posts' />
  )
}
