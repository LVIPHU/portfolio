# C5 — apps/2025: bỏ Contentlayer2, đọc blog từ @portfolio/content + render @portfolio/mdx

> **Phụ thuộc:** C2 + C3 (nguồn data + renderer phải sẵn sàng). **Chặn:** C6, C7. Đây là **blocker #1** của Next 16 (contentlayer2 không chạy Turbopack, vỡ PWD trên Windows).
> **Ước lượng:** ~4–6h, phase lớn — cho phép 2 commit. **Commit:** `feat(2025)!: drop contentlayer2, read blog from @portfolio/content` (+ `chore(2025): remove contentlayer deps & config` nếu tách).

## 1. Mục tiêu & phạm vi

Gỡ toàn bộ contentlayer2 khỏi 2025: blog/authors đọc từ `@portfolio/content`, MDX render bằng `<MDXContent>` của `@portfolio/mdx`, side-effect (tag-data.json, search.json, RSS) tái lập bằng script thường. **URL bài viết giữ nguyên** (`/[lang]/blog/<slug>`). i18n vẫn là Lingui (C6 mới đổi).

## 2. Hiện trạng (facts đã xác minh)

- **14 file import `contentlayer/generated`**: 3 page (`blog/page`, `blog/[...slug]/page`, `tags/[tag]/page`), `sitemap.ts`, 4 template (`blog`, `tag`, `post-layout`, `post-simple`, `post-banner`), 2 organism (`grid-view`, `list-view`), 2 molecule (`post-card-{grid,list}-view`), atom `authors.tsx`.
- **`src/utils/contentlayer.ts`**: cung cấp `sortPosts`, `allCoreContent`, `coreContent`, `pick`, `omit`, `CoreContent<T>` — cả codebase gọi qua đây, đây là **eo biển** cần giữ signature.
- **`contentlayer.config.ts` `onSuccess`**: ghi `json/tag-data.json` (Record<slugifiedTag, count>) + `public/search.json` (allCoreContent sorted — kbar đọc).
- **`scripts/rss.ts`** import `.contentlayer/generated/index.mjs` trực tiếp, chạy qua `postbuild` (`scripts/post-build.ts`); sinh `feed.xml` + `tags/*/feed.xml`.
- **`layout-renderer.tsx`** dùng `new Function` để chọn template theo `post.layout` — xóa, thay bằng map tĩnh.
- **`next.config.ts`**: `withContentlayer` wrap + pageExtensions gồm md/mdx.
- Blog page hiện render `post.body.code` (MDX đã compile của contentlayer) — sẽ đổi sang raw `post.content` + `<MDXContent>`.

## 3. Cấu trúc file đích (thay đổi trong apps/2025)

```
apps/2025/
├── contentlayer.config.ts        # XÓA
├── data/blog/, data/authors/     # XÓA (đã copy sang packages/content ở C2)
├── next.config.ts                 # bỏ withContentlayer; transpilePackages += content, mdx
├── scripts/
│   ├── generate-content-json.ts   # MỚI: ghi json/tag-data.json + public/search.json (prebuild)
│   ├── rss.ts                     # SỬA: nguồn getAllPosts() thay .contentlayer
│   ├── post-build.ts              # giữ, gọi rss như cũ
│   └── sync-content-assets.mjs    # MỚI: copy packages/content/assets → public/content (như 2026)
└── src/
    ├── utils/content.ts           # MỚI (đổi tên từ contentlayer.ts): giữ nguyên MỌI signature,
    │                              #   type nền đổi từ Document → PostMeta/Author của @portfolio/content
    ├── utils/contentlayer.ts      # XÓA (re-export tạm nếu muốn đổi dần — không, đổi 1 lần dứt điểm)
    └── components/.../             # 14 file đổi import; layout-renderer.tsx XÓA
```

## 4. Hướng code chi tiết

### Bước 1 — `src/utils/content.ts`: adapter giữ nguyên API

Chiến lược **giữ eo biển**: templates/organisms gọi `sortPosts`, `allCoreContent`, `CoreContent<T>` — giữ nguyên tên + hành vi, chỉ đổi kiểu nền:

```ts
import { getAllPosts, getPost, getAllAuthors, type PostMeta, type Post, type Author } from '@portfolio/content'

export type CoreContent<T> = Omit<T, 'content'> // trước là Omit<., 'body'|'_raw'|'_id'>
export const coreContent = <T extends { content?: string }>(c: T) => omit(c, ['content'])
export function sortPosts<T extends { date: string }>(posts: T[]) {
  /* giữ nguyên dateSortDesc */
}
export function allCoreContent<T>(contents: T[]) {
  /* draft filter production — giữ nguyên */
}
```

Mapping field khi rà 14 file: `post.body.code` → `post.content` (render khác đi, xem Bước 3), `post._raw.flattenedPath`/`post.path` → `post.path` (C2 đã tạo `path = blog/<slug>` **đúng shape cũ**), `toc` → `extractTocHeadings(post.content)` từ `@portfolio/mdx`, `structuredData` → `getStructuredData(post, siteUrl)`.

Locale: 2025 đang là 1 kho bài trộn 2 ngôn ngữ (tag vietnamese/english cũ). Sau C2, nguồn là per-locale. Trong C5 (còn Lingui, URL `/[lang]/`), map `vi-VN → 'vi'`, `en-US → 'en'` ngay tại chỗ gọi `getAllPosts(mapLocale(lang))`. Trang blog theo lang chỉ hiện bài locale đó + fallback — **đúng hành vi mong muốn mới**; ghi rõ trong PR là thay đổi có chủ đích (trước đây mọi lang thấy cả 8 bài).

### Bước 2 — Thay side-effects của `onSuccess`

`scripts/generate-content-json.ts` (chạy bằng tsx ở `predev`/`prebuild`):

```ts
import { getTagData, getSearchDocs } from '@portfolio/content'
writeFileSync('./json/tag-data.json', JSON.stringify(getTagData('vi'))) // shape cũ: Record<slug(tag), count>
writeFileSync('./public/search.json', JSON.stringify(getSearchDocs('vi')))
```

Chú ý: tag-data cũ **slugify tag bằng github-slugger** — `getTagData` của C2 chưa slugify; kiểm chỗ tiêu thụ (`tags/page`, `tags/[tag]/page`) đang dùng dạng nào rồi thống nhất (khả năng cao phải slugify để URL `/tags/<slug>` khớp). Nếu cần sửa, sửa **trong packages/content** để 2026 hưởng chung.

### Bước 3 — Render MDX + xóa `new Function`

`blog/[...slug]/page.tsx`:

```tsx
const layouts = { PostLayout, PostSimple, PostBanner } as const   // map tĩnh thay layout-renderer
const Layout = layouts[post.layout ?? 'PostLayout']
return (
  <Layout content={coreContent(post)} authorDetails={...} next={...} prev={...}>
    <MDXContent source={post.content} components={{ Image, /* atoms 2025 override */ }} />
  </Layout>
)
```

3 template `post-*` vốn nhận `children` — không phải sửa template. Xóa `layout-renderer.tsx`. `mdx-components` cũ của 2025 (Pre, CodeTitle…) — xóa phần đã lên `@portfolio/mdx`, chỉ giữ override đặc thù app (Image atom có zoom).

### Bước 4 — RSS + sitemap

`scripts/rss.ts`: thay `import { allBlogs } from '.contentlayer/generated'` → `getAllPosts('vi')` + `getAllPosts('en')` (hoặc union theo yêu cầu feed); giữ template XML + escape + đường ra `feed.xml`, `tags/<tag>/feed.xml` y nguyên. `sitemap.ts` đổi nguồn tương tự.

### Bước 5 — Assets + config + dọn deps

1. Port `sync-content-assets.mjs` từ 2026 (copy `packages/content/assets` → `public/content`, wipe trước khi copy) + hook `predev`/`prebuild`; ảnh banner cũ trong `public/static/images/banners` xóa sau khi xác nhận không còn tham chiếu.
2. `next.config.ts`: bỏ `withContentlayer`; `transpilePackages: ['@portfolio/content', '@portfolio/mdx']`; giữ CSP/headers.
3. Xóa: `contentlayer.config.ts`, `data/blog`, `data/authors`, `.contentlayer` khỏi `turbo.json` outputs/inputs, `contentlayer2`+`next-contentlayer2` khỏi deps, entry allowBuilds/onlyBuiltDependencies liên quan ở root, **ghi chú PowerShell/Git Bash trong CLAUDE.md** (hết lý do tồn tại).
4. Deps gỡ thêm (đã lên `@portfolio/mdx`): `rehype-*` (7 gói), `remark-*` (4 gói), `unist-util-visit`, `mdast-util-to-string`, `hast-util-from-html-isomorphic`, `reading-time`, `github-slugger`, `probe-image-size`, `js-yaml` (nếu chỉ contentlayer dùng — grep trước).

## 5. Design pattern áp dụng

- **Strangler fig qua eo biển API**: toàn bộ codebase đi qua `utils/content.ts` với signature cũ — thay ruột, giữ vỏ; 14 file consumer chỉ đổi dòng import.
- **Static registry thay meta-programming**: map `layouts` tĩnh thay `new Function` — type-safe, tree-shake được, hết lỗ hổng eval.
- **Side-effect tách khỏi build graph**: tag/search/rss là script tường minh trong `package.json` thay vì hook `onSuccess` ẩn trong plugin — nhìn thấy được, chạy lại được độc lập.

## 6. Tối ưu

- Hết contentlayer → build 2025 nhanh hơn rõ (bỏ 1 vòng compile MDX riêng + watcher), mở đường Turbopack ở C7.
- MDX giờ render RSC (trước: `useMDXComponent` client-side với `body.code`) → bundle client trang blog giảm mạnh; xác nhận bằng report kích thước build trước/sau.
- `getAllPosts` gọi nhiều nơi trong 1 build — nếu log build cho thấy đọc fs lặp đáng kể, thêm memo Map trong packages/content (làm ở đây, cả 2 app hưởng).

## 7. Testing & gate nghiệm thu

1. **Build từ Git Bash phải chạy** (`pnpm build --filter=web-2025` không cần `env -u PWD`) — bằng chứng hết bug contentlayer/PWD.
2. `pnpm typecheck` + `pnpm build` cả 2 app xanh; `grep -r "contentlayer" apps/2025 --include="*.ts*"` = 0.
3. Smoke `:3001` từng hạng mục:
   - `/vi-VN/blog`: danh sách bài vi (+fallback), grid/list view switch, pagination.
   - Mở `kien-truc-react-fiber`: highlight dual-theme, KaTeX, TOC đúng heading, reading time, authors panel, prev/next nav; thử cả 3 layout nếu có bài dùng (`layout:` frontmatter).
   - `/vi-VN/tags` + `/tags/<tag>`: đếm khớp, URL slug khớp (điểm nghi slugify ở Bước 2).
   - Cmd+K (kbar): search index mới hoạt động, click kết quả điều hướng đúng.
   - `feed.xml` + 1 `tags/<tag>/feed.xml`: XML valid (mở trong browser), item link đúng slug cũ.
   - So sánh URL: lấy danh sách slug từ sitemap trước/sau — **tập URL bài viết không đổi**.
4. Push → cả 2 deploy Vercel xanh.

## 8. Rủi ro & rollback

| Rủi ro                                                        | Phòng bị                                                                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Shape `CoreContent` lệch ngầm (field `_id`… được dùng đâu đó) | grep `_raw\|_id\|body\.` trong apps/2025/src trước khi bắt đầu — xử hết một lượt                         |
| Tag slugify lệch → 404 `/tags/x`                              | gate 3 có mục riêng; sửa tại packages/content                                                            |
| Bài viết hiển thị khác đi do tách locale                      | chủ đích — ghi vào commit message; nếu user muốn "mọi bài ở mọi lang" thì thêm `getAllPostsAllLocales()` |
| Phase lớn kẹt giữa chừng                                      | làm trên branch `c5-drop-contentlayer`, merge khi gate xanh                                              |

Rollback: revert merge commit; `data/` + config cũ nằm trong git.
