# Phase C5: 2025 bỏ Contentlayer2 — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Gỡ toàn bộ contentlayer2 khỏi `apps/2025`: blog/authors đọc từ `@portfolio/content`, MDX render bằng `<MDXContent>` của `@portfolio/mdx`, side-effects của `onSuccess` (tag-data.json, search.json) + RSS tái lập bằng script thường. **URL bài viết giữ nguyên** (`/[lang]/blog/<slug>`). Đây là **blocker #1** của Next 16 (contentlayer2 không chạy Turbopack, vỡ `process.env.PWD` trên Windows/Git Bash). KHÔNG thuộc phase: i18n (C6 — app vẫn chạy Lingui + segment `[lang]`), nâng Next (C7), xóa `data/main.ts`/`site-metadata.ts` (C6).
</domain>

<decisions>
## Quyết định đã khóa

### Chiến lược thay ruột giữ vỏ

- **D-01:** Strangler fig qua eo biển API: toàn codebase gọi blog qua `src/utils/contentlayer.ts` (`sortPosts`, `allCoreContent`, `coreContent`, `pick`, `omit`, `CoreContent<T>`) — tạo `src/utils/content.ts` GIỮ NGUYÊN mọi signature, đổi kiểu nền từ `Document` (contentlayer) sang `PostMeta/Post/Author` của `@portfolio/content`; 14 file consumer chỉ đổi dòng import. `CoreContent<T>` mới = `Omit<T, 'content'>` (cũ là `Omit<T, 'body'|'_raw'|'_id'>`).
- **D-02:** Mapping field khi rà consumer: `post.body.code` → render `<MDXContent source={post.content}>`; `post._raw.flattenedPath` → `post.path` (C2 đã tạo `path = blog/<slug>` đúng shape cũ); `toc` → `extractTocHeadings(post.content)` từ `@portfolio/mdx`; `structuredData` → `getStructuredData(post, siteUrl)`.
- **D-03:** Xóa `layout-renderer.tsx` (`new Function` — meta-programming nguy hiểm), thay bằng map tĩnh `{ PostLayout, PostSimple, PostBanner }` chọn theo `post.layout`; 3 template `post-*` vốn nhận `children` — không sửa template.

### Locale & hành vi

- **D-04:** 2025 còn Lingui + URL `/[lang]/` trong phase này → map locale tại chỗ gọi: `vi-VN → 'vi'`, `en-US → 'en'` rồi `getAllPosts(mapLocale(lang))`. Hệ quả CÓ CHỦ ĐÍCH: mỗi lang chỉ thấy bài locale đó (+ fallback), thay vì mọi lang thấy cả 8 bài như trước — ghi rõ trong commit message.
- **D-05:** Tập URL bài viết không đổi: slug giữ nguyên, so sánh sitemap trước/sau là gate bắt buộc.

### Side-effects & assets

- **D-06:** `onSuccess` của contentlayer (ghi `json/tag-data.json` + `public/search.json`) → script `scripts/generate-content-json.ts` chạy tsx ở `predev`/`prebuild`. Chú ý: tag-data cũ **slugify tag bằng github-slugger** — nếu `getTagData()` của packages/content chưa slugify thì sửa TRONG packages/content (2026 hưởng chung), đối chiếu chỗ tiêu thụ `/tags/<slug>` khớp URL.
- **D-07:** `scripts/rss.ts` bỏ import `.contentlayer/generated` → `getAllPosts('vi')` + `getAllPosts('en')`; giữ nguyên template XML + escape + output `feed.xml`, `tags/*/feed.xml`. `sitemap.ts` đổi nguồn tương tự.
- **D-08:** Port `sync-content-assets.mjs` từ 2026 (wipe + copy `packages/content/assets` → `public/content`) + hook predev/prebuild; ảnh banner cũ trong `public/static/images/banners` xóa sau khi grep 0 tham chiếu.

### Dọn dẹp

- **D-09:** Xóa: `contentlayer.config.ts`, `data/blog/`, `data/authors/`, deps `contentlayer2` + `next-contentlayer2`; `next.config.ts` bỏ `withContentlayer` + thêm `transpilePackages: ['@portfolio/content','@portfolio/mdx']`; turbo.json bỏ `.contentlayer`; root config bỏ allowBuilds/onlyBuiltDependencies liên quan contentlayer2.
- **D-10:** Gỡ deps đã lên `@portfolio/mdx` sau khi grep 0 import: 7 gói `rehype-*`, 4 gói `remark-*`, `unist-util-visit`, `mdast-util-to-string`, `hast-util-from-html-isomorphic`, `reading-time`, `github-slugger`, `probe-image-size`, `js-yaml` (nếu chỉ contentlayer dùng — grep trước).
- **D-11:** `mdx-components` cũ của 2025: xóa phần trùng với `@portfolio/mdx` (Pre, CodeTitle, TableWrapper…), GIỮ override đặc thù app (Image atom có zoom) và truyền qua prop `components` của `<MDXContent>`.
- **D-12:** CLAUDE.md: xóa ghi chú PowerShell/Git Bash contentlayer (hết lý do tồn tại) — sửa ngay trong phase này vì gate của phase chính là "build được từ Git Bash".
- **D-13:** Thi công trên branch `c5-drop-contentlayer`, merge main khi gate plan 04 xanh (main luôn deploy được).

### Claude tự quyết

- Tổ chức nội bộ `utils/content.ts` (giữ cả `pick`/`omit` hay chỉ cái được dùng — grep quyết).
- Có memo hóa `getAllPosts` trong packages/content không nếu log build cho thấy đọc fs lặp đáng kể (làm trong packages/content để 2026 hưởng).
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

**M-01 — utils/content.ts (eo biển giữ signature):**

```ts
import { getAllPosts, getPost, getAllAuthors, type PostMeta, type Post, type Author } from '@portfolio/content'

export type CoreContent<T> = Omit<T, 'content'>
export const coreContent = <T extends { content?: string }>(c: T) => omit(c, ['content'])
export function sortPosts<T extends { date: string }>(posts: T[]) {
  /* dateSortDesc giữ nguyên từ file cũ */
}
export function allCoreContent<T>(contents: T[]) {
  /* draft-filter production giữ nguyên */
}
export function mapLocale(lang: string): 'vi' | 'en' {
  return lang === 'en-US' ? 'en' : 'vi'
}
```

**M-02 — Map layout tĩnh thay new Function:**

```tsx
import { PostLayout, PostSimple, PostBanner } from '@/components/templates'
const layouts = { PostLayout, PostSimple, PostBanner } as const
const Layout = layouts[(post.layout ?? 'PostLayout') as keyof typeof layouts]
return (
  <Layout content={coreContent(post)} authorDetails={authors} next={next} prev={prev}>
    <MDXContent source={post.content} components={{ Image /* atom 2025 có zoom */ }} />
  </Layout>
)
```

**M-03 — scripts/generate-content-json.ts:**

```ts
import { writeFileSync } from 'fs'
import { getTagData, getSearchDocs } from '@portfolio/content'
writeFileSync('./json/tag-data.json', JSON.stringify(getTagData('vi')))
writeFileSync('./public/search.json', JSON.stringify(getSearchDocs('vi')))
```

**M-04 — Gate so sánh URL:** trước khi bắt đầu, chạy build cũ và lưu danh sách slug từ sitemap (hoặc `ls .contentlayer/generated`); sau plan 04, diff với sitemap mới — tập URL `/blog/<slug>` phải bằng nhau (D-05).
</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` §Phase C5 — goal, REQ-01/02/10, 3 success criteria
- `apps/2025/contentlayer.config.ts` — nguồn sự thật về computedFields + onSuccess đang thay
- `apps/2025/src/utils/contentlayer.ts` — signature phải giữ (109 dòng, đã đọc nguyên văn)
- `apps/2025/scripts/rss.ts` + `scripts/post-build.ts` — luồng RSS hiện tại
- `docs/plans/phases/C03-mdx-package/C03-CONTEXT.md` — hợp đồng MDXContent/pipeline mà phase này tiêu thụ
- `apps/2026/scripts/sync-content-assets.mjs` — nguồn port cho D-08
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh)

### 14 file import `contentlayer/generated` (danh sách grep đầy đủ)

3 page: `[lang]/(page)/blog/page.tsx`, `[lang]/(page)/blog/[...slug]/page.tsx`, `[lang]/(page)/tags/[tag]/page.tsx`; `app/sitemap.ts`; 5 template: `blog.tsx`, `tag.tsx`, `post-layout.tsx`, `post-simple.tsx`, `post-banner.tsx`; 2 organism: `grid-view.tsx`, `list-view.tsx`; 2 molecule: `post-card-grid-view.tsx`, `post-card-list-view.tsx`; 1 atom: `authors.tsx`. Ngoài ra `scripts/rss.ts` import `.contentlayer/generated/index.mjs` trực tiếp.

### Hạ tầng contentlayer đang thay

- `contentlayer.config.ts`: computedFields (readingTime, slug, path, filePath, toc) + structuredData; onSuccess ghi `json/tag-data.json` (Record<slug(tag), count> — slugify github-slugger) + `public/search.json` (allCoreContent(sortPosts(allBlogs))).
- `next.config.ts`: `withContentlayer` wrap (dòng 1, 59) + pageExtensions gồm md/mdx.
- `postbuild` script chạy `tsx ./scripts/post-build.ts` → gọi rss.
- Bug môi trường: contentlayer2 đọc `process.env.PWD ?? process.cwd()` → Git Bash vỡ (NoConfigFoundError) — lý do gate "build từ Git Bash phải chạy".

### Điểm nghi cần rà trước khi code

- Grep `_raw\|_id\|body\.` toàn apps/2025/src để bắt field contentlayer dùng ngoài 14 file đã biết — xử hết một lượt ở plan 01.
- Tag slugify: `/tags/<tag>` page dùng dạng slugified hay raw — đối chiếu trước khi chốt sửa getTagData (D-06).
- kbar đọc `public/search.json` shape `CoreContent[]` — `getSearchDocs()` của C2 đã khớp shape (PostMeta[]).
  </code_context>

<deferred>
## Ý tưởng hoãn

- Xóa `data/main.ts` + `site-metadata.ts` + alias `@data` — Phase C6 (plan C06-03)
- middleware→proxy, Next 16, Turbopack — Phase C7
- Memo hóa getAllPosts theo mtime — chỉ khi log build cho thấy chậm, backlog
- `getAllPostsAllLocales()` cho hành vi "mọi bài ở mọi lang" — chỉ nếu user muốn sau khi thấy D-04
</deferred>

---

_Phase: C05-2025-drop-contentlayer_
