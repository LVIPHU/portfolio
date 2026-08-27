import type { NextRequest } from 'next/server'
import { fetchRepoData } from '@/utils/github'

const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/
const ALLOWED_OWNERS = new Set(['LVIPHU', 'luongviphu'])

export async function GET(request: NextRequest) {
  const repo = new URL(request.url).searchParams.get('repo')
  if (!repo || repo === 'undefined' || repo === 'null') {
    return Response.json({ message: 'Missing repo parameter' }, { status: 400 })
  }
  if (!REPO_RE.test(repo)) {
    return Response.json({ message: 'Invalid repo parameter' }, { status: 400 })
  }
  const owner = repo.split('/')[0]
  if (!owner || !ALLOWED_OWNERS.has(owner)) {
    return Response.json({ message: 'Repo owner not allowed' }, { status: 403 })
  }

  const data = await fetchRepoData({ repo, includeLastCommit: true })
  return Response.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
