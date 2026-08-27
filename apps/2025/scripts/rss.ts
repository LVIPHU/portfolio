import 'dotenv/config'
import path from 'path'
import { mkdirSync, writeFileSync } from 'fs'
import { slug } from 'github-slugger'
import { getAllPosts, getTagData, type PostMeta } from '@portfolio/content'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { escape, sortPosts } from '@portfolio/utils'

// postbuild chạy ngoài Next — đọc SITE_METADATA, không process.env (owner/email trống lúc script).
const RSS_CONFIG = {
  siteUrl: SITE_METADATA.siteUrl ?? '',
  email: SITE_METADATA.email,
  author: SITE_METADATA.author ?? 'Lương Vĩ Phú',
  language: 'vi-VN',
  title: SITE_METADATA.title.en,
  description: SITE_METADATA.description.en.replace('sofware', 'software'),
}

const seen = new Set<string>()
const blogs = [...getAllPosts('vi'), ...getAllPosts('en')].filter((p) =>
  seen.has(p.path) ? false : (seen.add(p.path), true)
)
const RSS_PAGE = 'feed.xml'

function generateRssItem(item: PostMeta) {
  const { siteUrl, email, author } = RSS_CONFIG
  return `
		<item>
			<guid>${siteUrl}/blog/${item.slug}</guid>
			<title>${escape(item.title)}</title>
			<link>${siteUrl}/blog/${item.slug}</link>
			${item.summary && `<description>${escape(item.summary)}</description>`}
			<pubDate>${new Date(item.date).toUTCString()}</pubDate>
			<author>${email} (${author})</author>
			${item.tags && item.tags.map((t) => `<category>${t}</category>`).join('')}
		</item>
	`
}

function generateRss(items: PostMeta[], page = RSS_PAGE) {
  const { siteUrl, language, email, author, title, description } = RSS_CONFIG
  return `
		<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
			<channel>
				<title>${escape(title)}</title>
				<link>${siteUrl}/blog</link>
				<description>${escape(description)}</description>
				<language>${language}</language>
				<managingEditor>${email} (${author})</managingEditor>
				<webMaster>${email} (${author})</webMaster>
				<lastBuildDate>${new Date(items[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
				<atom:link href="${siteUrl}/${page}" rel="self" type="application/rss+xml"/>
				${items.map((item) => generateRssItem(item)).join('')}
			</channel>
		</rss>
	`
}

export async function generateRssFeed() {
  const publishPosts = blogs.filter((post) => post.draft !== true)
  if (publishPosts.length > 0) {
    const rss = generateRss(sortPosts([...publishPosts]))
    writeFileSync(`./public/${RSS_PAGE}`, rss)
  }

  if (publishPosts.length > 0) {
    const tagKeys = new Set([...Object.keys(getTagData('vi')), ...Object.keys(getTagData('en'))])
    for (const tag of tagKeys) {
      const filteredPosts = blogs.filter((p) => p.tags.map((t) => slug(t)).includes(tag))
      const rss = generateRss([...filteredPosts], `tags/${tag}/feed.xml`)
      const rssPath = path.join('public', 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, RSS_PAGE), rss)
    }
  }
  console.log('🗒️. RSS feed generated.')
}
