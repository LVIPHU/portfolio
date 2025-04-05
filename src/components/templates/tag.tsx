'use client'

import tagData from '@json/tag-data.json'
import type { CoreContent } from '@/types/data'
import type { Blog } from '@contentlayer/generated'
import { Badge, Container, NavigationLink, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms'
import { GridView, Header, ListView } from '@/components/organisms'
import { Tag } from '@/components/molecules'
import { AppContextInterface, useApp } from '@/providers/app'
import { LayoutGrid, List } from 'lucide-react'
import { slug } from 'github-slugger'

interface ListLayoutProps {
  title: string
  description: React.ReactNode
  posts: CoreContent<Blog>[]
}

export function TagTemplate({ title, description, posts }: ListLayoutProps) {
  const { postsView, setPostsView } = useApp()

  return (
    <Container className='pt-4 lg:pt-12'>
      <Tabs
        value={postsView}
        onValueChange={(value) => {
          setPostsView(value as AppContextInterface['postsView'])
        }}
      >
        <Header title={title} className='border-b border-gray-200 dark:border-gray-700'>
          <>
            <i className={'text-base text-gray-500 dark:text-gray-400 md:text-lg md:leading-7'}>{description}</i>
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
        <div className='relative flex flex-col items-start gap-12 lg:flex-row'>
          <TagsList />
          <div className='py-5 md:py-10'>
            <TabsContent value='GRID'>
              <GridView posts={posts} />
            </TabsContent>
            <TabsContent value='LIST'>
              <ListView posts={posts} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Container>
  )
}

function TagsList() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <aside className='sticky top-8 order-last w-full shrink-0 lg:order-first lg:max-w-sm'>
      <h3 className='text-3xl font-bold tracking-tight'>Tags</h3>
      <ul className='mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1'>
        {sortedTags.map((text) => {
          const tagName = text.split(' ').join('-')
          return (
            <NavigationLink key={text} href={`/tags/${slug(text)}`}>
              <li
                data-umami-event={`tag-${tagName}`}
                className='flex items-center justify-between gap-2 rounded-md bg-black bg-muted p-3 text-white dark:bg-white dark:text-black'
              >
                <span className='font-medium'>{tagName}</span>
                <Badge variant={'secondary'} className='rounded-full px-1.5'>
                  {tagCounts[text]}
                </Badge>
              </li>
            </NavigationLink>
          )
        })}
      </ul>
    </aside>
  )
}
