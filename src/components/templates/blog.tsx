'use client'

import type { Blog } from '@contentlayer/generated'
import { ArrowLeft, ArrowRight, LayoutGrid, List } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { CoreContent } from '@/types/data'
import { Container, NavigationLink, SearchArticles, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms'
import { GridView, Header, ListView } from '@/components/organisms'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { AppContextInterface, useApp } from '@/providers/app'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className='space-y-2 pb-8 pt-6 md:space-y-5'>
      <nav className='flex justify-between'>
        {prevPage ? (
          <NavigationLink
            className='cursor-pointer'
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel='prev'
          >
            <div className='inline-flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              <span>Previous</span>
            </div>
          </NavigationLink>
        ) : (
          <button className='cursor-auto disabled:opacity-50' disabled={!prevPage}>
            <div className='inline-flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              <span>Previous</span>
            </div>
          </button>
        )}
        <span>
          {currentPage} / {totalPages}
        </span>
        {nextPage ? (
          <NavigationLink className='cursor-pointer' href={`/${basePath}/page/${currentPage + 1}`} rel='next'>
            <div className='inline-flex items-center gap-2'>
              <span>Next</span>
              <ArrowRight className='h-4 w-4' />
            </div>
          </NavigationLink>
        ) : (
          <button className='cursor-auto disabled:opacity-50' disabled={!nextPage}>
            <div className='inline-flex items-center gap-2'>
              <span>Next</span>
              <ArrowRight className='h-4 w-4' />
            </div>
          </button>
        )}
      </nav>
    </div>
  )
}

export function BlogTemplate({ posts, initialDisplayPosts = [], pagination }: ListLayoutProps) {
  const { i18n } = useLingui()
  const { postsView, setPostsView } = useApp()
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts = initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <Container className='pt-4 lg:pt-12'>
      <Tabs
        value={postsView}
        onValueChange={(value) => {
          setPostsView(value as AppContextInterface['postsView'])
        }}
      >
        <Header
          title={t(i18n)`All posts`}
          description={t(
            i18n
          )`I like to write about stuff I'm into. You'll find a mix of web dev articles, tech news, and random thoughts from my life. Use the search below to filter by title.`}
          className='border-b border-gray-200 dark:border-gray-700'
        >
          <>
            <SearchArticles
              className={'min-w-0 md:min-w-96'}
              label='Search articles'
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <TabsList>
              <TabsTrigger value='GRID'>
                <LayoutGrid />
                <span className='ml-2 hidden sm:block'>Grid</span>
              </TabsTrigger>
              <TabsTrigger value='LIST'>
                <List />
                <span className='ml-2 hidden sm:block'>List</span>
              </TabsTrigger>
            </TabsList>
          </>
        </Header>

        {!filteredBlogPosts.length ? (
          <div className='py-10'>No posts found.</div>
        ) : (
          <>
            <TabsContent value='GRID'>
              <GridView posts={displayPosts} />
            </TabsContent>
            <TabsContent value='LIST'>
              <ListView posts={displayPosts} />
            </TabsContent>
          </>
        )}
      </Tabs>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </Container>
  )
}
