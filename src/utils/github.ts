import { graphql, type GraphQlQueryResponseData } from '@octokit/graphql'
import type { GithubRepository } from '@/types/github'
import { SITE_METADATA } from '@data/site-metadata'
import { env } from '@env'

const HISTORY_QUERY = `
  defaultBranchRef {
    target {
      ... on Commit {
        history(first: 1) {
          edges {
            node {
              ... on Commit {
                id
                abbreviatedOid
                committedDate
                message
                url
                status {
                  state
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function fetchRepoData({
  repo = '',
  includeLastCommit = false,
}: {
  repo: string
  includeLastCommit?: boolean
}): Promise<GithubRepository | null> {
  if (!env.GITHUB_API_TOKEN || !repo) {
    console.error('Missing `GITHUB_API_TOKEN` or `repo`')
    return null
  }
  let owner = SITE_METADATA?.github
  if (!owner) {
    console.error('Missing github username in siteMetadata')
    return null
  }
  const parts = owner.split('/')
  owner = parts.pop() ?? 'LVIPHU'
  if (repo.includes('/')) {
    ;[owner, repo] = repo.split('/')
  }
  try {
    const { repository }: GraphQlQueryResponseData = await graphql(
      `
            query repository($owner: String!, $repo: String!) {
                repository(owner: $owner, name: $repo) {
                    stargazerCount
                    description
                    homepageUrl
                    ${includeLastCommit ? HISTORY_QUERY : ''}
                    languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                        edges {
                            node {
                                color
                                name
                            }
                        }
                    }
                    name
                    nameWithOwner
                    url
                    forkCount
                    repositoryTopics(first: 20) {
                        edges {
                            node {
                                topic {
                                    name
                                }
                            }
                        }
                    }
                }
            }
      `,
      {
        owner: owner,
        repo: repo,
        headers: {
          authorization: `token ${env.GITHUB_API_TOKEN}`,
        },
      }
    )
    if (includeLastCommit) {
      repository.lastCommit = repository.defaultBranchRef.target.history.edges[0].node
      delete repository.defaultBranchRef
    }
    repository.languages = repository.languages.edges.map((edge: any) => {
      return {
        color: edge.node.color,
        name: edge.node.name,
      }
    })
    repository.repositoryTopics = repository.repositoryTopics.edges.map((edge: any) => edge.node.topic.name)
    return repository
  } catch (err) {
    console.error(err)
    return null
  }
}
