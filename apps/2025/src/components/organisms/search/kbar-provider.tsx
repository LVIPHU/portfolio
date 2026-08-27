'use client'

import type { Action } from 'kbar'
import { KBarProvider } from 'kbar'
import dynamic from 'next/dynamic'
import { useRouter } from '@portfolio/i18n/navigation'
import { useState, type ReactNode, useEffect } from 'react'
import { formatDate } from '@portfolio/utils'

const KBarModal = dynamic(() => import('./kbar-modal').then((m) => m.KBarModal), { ssr: false })

type SearchDocument = {
  path: string
  title: string
  summary?: string
  date: string
}

export interface KBarSearchProps {
  searchDocumentsPath: string | false
  defaultActions?: Action[]
  onSearchDocumentsLoad?: (documents: SearchDocument[]) => Action[]
}

export interface KBarConfig {
  provider: 'kbar'
  kbarConfig: KBarSearchProps
}

export function KBarSearchProvider({ configs, children }: { configs: KBarSearchProps; children: ReactNode }) {
  const { searchDocumentsPath, defaultActions, onSearchDocumentsLoad } = configs
  const router = useRouter()
  const [searchActions, setSearchActions] = useState<Action[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    function mapPosts(posts: SearchDocument[]) {
      const actions: Action[] = []
      for (const post of posts) {
        actions.push({
          id: post.path,
          name: post.title,
          keywords: post.summary || '',
          section: 'Content',
          subtitle: formatDate(post.date),
          perform: () => router.push('/' + post.path),
        })
      }
      return actions
    }
    async function fetchData() {
      if (searchDocumentsPath) {
        const url =
          searchDocumentsPath.indexOf('://') > 0 || searchDocumentsPath.indexOf('//') === 0
            ? searchDocumentsPath
            : new URL(searchDocumentsPath, window.location.origin)
        const res = await fetch(url)
        const json = (await res.json()) as SearchDocument[]
        const actions = onSearchDocumentsLoad ? onSearchDocumentsLoad(json) : mapPosts(json)
        setSearchActions(actions)
        setDataLoaded(true)
      }
    }
    if (!dataLoaded && searchDocumentsPath) {
      void fetchData()
    } else {
      setDataLoaded(true)
    }
  }, [defaultActions, dataLoaded, router, searchDocumentsPath, onSearchDocumentsLoad])

  return (
    <KBarProvider actions={defaultActions}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}
