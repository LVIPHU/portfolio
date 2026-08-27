'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { fetcher } from '@portfolio/utils'
import type { SelectStats, StatsType } from '../db/schema'

export function useBlogStats(type: StatsType, slug: string) {
  const { data, isLoading } = useSWR<SelectStats>(`/api/stats?slug=${encodeURIComponent(slug)}&type=${type}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  const stats: SelectStats = {
    type,
    slug,
    views: data?.views || 0,
    loves: data?.loves || 0,
    applauses: data?.applauses || 0,
    ideas: data?.ideas || 0,
    bullseyes: data?.bullseyes || 0,
  }
  return [stats, isLoading] as const
}

export function useBlogStatsList(type: StatsType, slugs: string[]) {
  const key = slugs.length ? `/api/stats?type=${type}&slugs=${slugs.map(encodeURIComponent).join(',')}` : null
  const { data, isLoading } = useSWR<SelectStats[]>(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  return [
    data ?? slugs.map((slug) => ({ type, slug, views: 0, loves: 0, applauses: 0, ideas: 0, bullseyes: 0 })),
    isLoading,
  ] as const
}

/** `incrementViews` để SERVER tự +1 — client đọc-rồi-ghi làm mất lượt khi cache đã cũ. */
export type StatsUpdateArg = {
  type: StatsType
  slug: string
  incrementViews?: boolean
  loves?: number
  applauses?: number
  ideas?: number
  bullseyes?: number
}

export function useUpdateBlogStats() {
  const { trigger } = useSWRMutation('/api/stats', async (url: string, { arg }: { arg: StatsUpdateArg }) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg),
    })
    if (!res.ok) throw new Error(`Stats update failed: ${res.status}`)
    return res.json() as Promise<SelectStats>
  })
  return trigger
}
