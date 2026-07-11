import 'dotenv/config'
import path from 'path'
import { mkdirSync, writeFileSync } from 'fs'
import { slug } from 'github-slugger'
import tagData from '@json/tag-data.json'
import { getAllPosts, type PostMeta } from '@portfolio/content'
import { sortPosts, escape } from '@/utils'
import { env } from '@env'

// Extract only non-macro fields needed for RSS generation
// Scripts don't run through babel, so we can't use msg macros
const RSS_CONFIG = {
  siteUrl: env.NEXT_PUBLIC_APP_URL,
  email: process.env.email,
  author: process.env.owner,
  language: 'vi-VN',
  // RSS feed uses English strings (hardcoded) as RSS feeds typically don't support i18n
  title: "Lương Vĩ Phú's dev blog - portfolio",
  description:
    'I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.',
}

// Union 2 locale, dedupe theo path — 1 item mỗi slug như hệ cũ (C5-03, D-07)
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
				<lastBuildDate>${new Date(items[0].date).toUTCString()}</lastBuildDate>
				<atom:link href="${siteUrl}/${page}" rel="self" type="application/rss+xml"/>
				${items.map((item) => generateRssItem(item)).join('')}
			</channel>
		</rss>
	`
}

export async function generateRssFeed() {
  const publishPosts = blogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(sortPosts([...publishPosts]))
    writeFileSync(`./public/${RSS_PAGE}`, rss)
  }

  if (publishPosts.length > 0) {
    // RSS for tags
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = blogs.filter((p) => p.tags.map((t) => slug(t)).includes(tag))
      const rss = generateRss([...filteredPosts], `tags/${tag}/feed.xml`)
      const rssPath = path.join('public', 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, RSS_PAGE), rss)
    }
  }
  console.log('🗒️. RSS feed generated.')
}
