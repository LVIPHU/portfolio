# C2 — packages/content v2: Zod schema + hút toàn bộ data 2025

> **Phụ thuộc:** C1 (đã xong). **Chặn:** C3, C5, C6.
> **Ước lượng:** ~3–4h. **Commit:** `feat(content): unified zod schema, absorb 2025 blog/authors/main-data`

## 1. Mục tiêu & phạm vi

Biến `@portfolio/content` thành **nguồn sự thật duy nhất** cho mọi dữ liệu hiển thị của cả 2 app:

- Frontmatter blog hợp nhất, validate bằng Zod, **fail-fast lúc build** (thay vai trò schema của contentlayer).
- Hút 4 bài blog + 5 author + ảnh banner từ `apps/2025/data/` (copy, chưa xóa nguồn — xóa ở C5).
- Dịch data tĩnh 2025 (`main.ts`: skills/experience/projects, `site-metadata.ts`) từ `MessageDescriptor` (Lingui) sang `Localized {vi, en}` — bản dịch lấy từ 2 catalog `.po` sẵn có.
- Chuẩn hóa 4 bài blog 2026 theo schema mới (`description` → `summary`).

**Không thuộc phạm vi:** render MDX (C3), sửa app 2025 (C5/C6).

## 2. Hiện trạng (cập nhật giữa chừng — QUAN TRỌNG)

Đã làm xong (working tree, chưa commit):

- `src/schema.ts` — `postFrontmatterSchema` + `authorFrontmatterSchema` (Zod).
- `src/types.ts` — `PostMeta`/`Post` mở rộng (lastmod, images, authors, layout, canonicalUrl, path, readingTime), thêm `Author`, `TagCount`.
- `src/blog.ts` — viết lại: `contentDir()`, đọc `<slug>.<locale>.mdx`, Zod safeParse ném lỗi kèm đường dẫn file, `getAllPosts/getPost` (fallback locale) `/getAllSlugs/getAllTags/getPostsByTag/getTagData/getSearchDocs/getStructuredData`.
- `src/authors.ts` — `getAllAuthors()/getAuthor()` đọc `authors/*.mdx`.
- `src/index.ts` — đã export cả 4 module data 2025.

**⚠️ Đang vỡ typecheck:** `index.ts` export từ `./skills2025`, `./experience2025`, `./projects2025`, `./site-metadata2025` — **4 file này chưa tồn tại** (subagent dịch bị chết vì session limit). Đây là việc đầu tiên phải làm khi resume.

## 3. Cấu trúc file đích

```
packages/content/
├── package.json            # + deps: zod@^4, reading-time@^1.5
├── blog/
│   ├── hello-world.{vi,en}.mdx                # sẵn có — sửa description→summary
│   ├── portfolio-monorepo.{vi,en}.mdx         # sẵn có — sửa description→summary
│   ├── kien-truc-react-fiber.vi.mdx           # copy từ 2025
│   ├── cac-component-element-va-instance-trong-react.vi.mdx
│   ├── does-promise-all-run-in-parallel-or-sequential.en.mdx
│   └── guide-to-using-images-in-nextjs.en.mdx
├── authors/                                    # MỚI — copy 5 file từ apps/2025/data/authors/
│   └── {default,leohuynh,danabramov,andrewclark,sparrowhawk}.mdx
├── assets/
│   └── blog/                                   # banner JPG các bài 2025
└── src/
    ├── schema.ts  types.ts  blog.ts  authors.ts   # xong
    ├── skills2025.ts        # MỚI: SKILLS_2025
    ├── experience2025.ts    # MỚI: EXPERIENCES_2025 (COMPANIES + role/description Localized)
    ├── projects2025.ts      # MỚI: PROJECTS_2025
    ├── site-metadata2025.ts # MỚI: SITE_METADATA_2025
    └── index.ts             # đã export sẵn
```

## 4. Hướng code chi tiết

### Bước 1 — 4 file data 2025 (mở khóa typecheck)

Nguồn: `apps/2025/data/main.ts` (29 chuỗi `msg\`...\``) + `apps/2025/data/site-metadata.ts` (3 chuỗi). Cách dịch **máy móc, không sáng tác**:

1. Đọc `apps/2025/src/i18n/locales/en-US/messages.po` và `vi-VN/messages.po`.
2. Mỗi `msg\`X\``: `msgid = X`(source tiếng Anh) →`en = X`, `vi = msgstr`tra trong catalog vi-VN. Nếu msgstr rỗng →`vi = X`(fallback, đánh dấu`// TODO dịch` để rà sau).
3. Field không phải text (date, logo path, url, imgSrc, builtWith, `items`…) giữ nguyên literal.

Kiểu dữ liệu — định nghĩa ngay trong từng file data (không phình `types.ts` với type chỉ 2025 dùng):

```ts
// skills2025.ts
import type { Localized } from './types'

export interface Skill2025 {
  label: Localized
  items: { name: string; icon?: string }[] // khớp shape main.ts hiện tại
}
export const SKILLS_2025: Skill2025[] = [/* dịch từ main.ts */]
```

Tương tự `Experience2025` (company, role: Localized, date range, logo, items: Localized[]), `Project2025` (title/description Localized, imgSrc, builtWith, links), `SiteMetadata2025` (title/description/headerTitle Localized + các field literal). **Đối chiếu shape với chỗ tiêu thụ** (`apps/2025/src/components/organisms/{technologies,experience}.tsx`, `templates/projects.tsx`) để C6 chỉ việc đổi import.

### Bước 2 — deps

```jsonc
// packages/content/package.json → dependencies
"gray-matter": "^4.0.3",   // sẵn có
"reading-time": "^1.5.0",  // THÊM
"zod": "^4.0.0"            // THÊM — zod 4 luôn (C7 sweep khỏi đụng lại)
```

Chạy `pnpm install` ở root. Lưu ý zod 4: `z.string().url()` deprecated → nếu typecheck kêu, đổi `schema.ts` sang `z.url()`; `.default([])` trên array vẫn OK.

### Bước 3 — copy blog 2025 (4 file, đổi tên theo locale thật)

| Nguồn (`apps/2025/data/blog/`)                       | Đích (`packages/content/blog/`)                         |
| ---------------------------------------------------- | ------------------------------------------------------- |
| `kien-truc-react-fiber.mdx`                          | `kien-truc-react-fiber.vi.mdx`                          |
| `cac-component-element-va-instance-trong-react.mdx`  | `cac-component-element-va-instance-trong-react.vi.mdx`  |
| `does-promise-all-run-in-parallel-or-sequential.mdx` | `does-promise-all-run-in-parallel-or-sequential.en.mdx` |
| `guide-to-using-images-in-nextjs.mdx`                | `guide-to-using-images-in-nextjs.en.mdx`                |

Sửa frontmatter mỗi file khi copy:

- Bỏ tag đánh dấu ngôn ngữ `vietnamese` / `english` (locale giờ nằm trong tên file).
- `images: ['/static/images/banners/x.jpg']` → `['/content/blog/x.jpg']` (đường dẫn sau khi sync-assets copy vào `public/content/`).
- Giữ nguyên: title, date, summary (2025 đã dùng `summary` sẵn), authors, layout, draft, lastmod.

Copy các banner JPG được tham chiếu → `packages/content/assets/blog/` (giữ tên file). Body MDX giữ nguyên 100% — kể cả cú pháp chưa render được (C3 lo).

### Bước 4 — copy authors

Copy nguyên 5 file `apps/2025/data/authors/*.mdx` → `packages/content/authors/`. Sửa `avatar: /static/images/...` → `/content/authors/...` + copy ảnh avatar tương ứng vào `assets/authors/`. Field `layout` trong frontmatter author cũ: schema Zod hiện không khai — thêm `.loose()`? **Không** — xóa hẳn key `layout` khỏi frontmatter author khi copy (không ai dùng), giữ schema strict-by-default của Zod (unknown key bị strip, không lỗi — chấp nhận strip).

### Bước 5 — chuẩn hóa 4 MDX 2026 + code tiêu thụ

- 4 file `hello-world.*.mdx`, `portfolio-monorepo.*.mdx`: đổi key frontmatter `description:` → `summary:`.
- Grep `apps/2026/src` mọi chỗ đọc `post.description` / destructure `{ description }` từ post → đổi `summary`. Chỗ đã biết: `components/post-card.tsx`, `app/[locale]/blog/page.tsx`, `app/[locale]/blog/[slug]/page.tsx` (`generateMetadata`), trang tags nếu có.

### Bước 6 — sync assets

`apps/2026/scripts/sync-content-assets.mjs` copy đệ quy `packages/content/assets/*` → `public/content/*` — kiểm tra nó copy được thư mục con mới (`blog/`, `authors/`); nếu script chỉ copy nông thì sửa thành đệ quy.

## 5. Design pattern áp dụng

- **Parse, don't validate** (Zod ở biên): frontmatter chỉ được đụng tới sau khi qua `safeParse`; phía trong package mọi thứ là type đã hẹp (`PostFrontmatter`), không còn `any`/optional-chaining rải rác.
- **Fail-fast với ngữ cảnh**: lỗi schema ném `Error` kèm **đường dẫn file** — build đỏ ngay tại bài viết sai, thay vì undefined lan xuống UI.
- **Computed-fields as pure functions**: `readingTime`, `structuredData`, `tagData` là hàm thuần trên dữ liệu đã parse (thay computedFields của contentlayer) — dễ test, không cache ẩn.
- **Filename-as-metadata**: locale nằm trong tên file (`<slug>.<locale>.mdx`), không trong frontmatter → không thể lệch nhau.
- **Adapter shape tương lai**: `getTagData()` trả `Record<tag, count>` và `getSearchDocs()` trả mảng meta — **cùng shape** `json/tag-data.json` + `public/search.json` của 2025, để C5 thay nguồn mà kbar/tags page không đổi code.

## 6. Tối ưu

- Mọi hàm loader chỉ chạy **lúc build/SSG** (fs sync là chấp nhận được, không cần async). Không thêm cache layer — Next tự dedupe module trong 1 lần build; nếu sau này chậm mới thêm memo Map theo `file + mtime`.
- Không đưa `content` (body MDX) vào `PostMeta`/search docs — giữ search.json nhỏ.
- `getAllPosts` sort 1 lần; các hàm derive (`getAllTags`, `getPostsByTag`) đi qua `getAllPosts` để dùng chung logic draft-filter.

## 7. Testing & gate nghiệm thu

Không có test framework trong repo — gate = typecheck + build + smoke có kịch bản:

1. `pnpm --filter @portfolio/content typecheck` — xanh (hết lỗi 4 file thiếu).
2. `pnpm build --filter=web-2026` — xanh.
3. Smoke `:3000/blog` (dev hoặc `next start`):
   - Đủ **6 bài** ở cả 2 locale (vi: 4 bài vi + 2 bài en fallback; en: ngược lại).
   - Bài `kien-truc-react-fiber` mở được, ảnh banner load từ `/content/blog/…`.
   - Trang tags: tag gộp từ cả 2 nguồn, **không còn** tag `vietnamese`/`english`.
   - `generateMetadata` ra description = summary (view-source kiểm `<meta name="description">`).
4. Kiểm tra hồi quy tiêu cực: frontmatter cố tình sai (`date: banana`) → build đỏ, message chứa đường dẫn file. Sửa lại trước khi commit.
5. `pnpm build --filter=web-2025` (PowerShell) — xanh, **không đổi hành vi** (2025 chưa đọc package này).

## 8. Rủi ro & rollback

| Rủi ro                                               | Phòng bị                                                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Dịch `.po` thiếu msgstr → data vi lộ tiếng Anh       | fallback + `// TODO dịch`, rà lại ở gate C6                                                          |
| zod 4 breaking (`.url()`)                            | sửa schema tại chỗ; nếu kẹt sâu → pin zod 3 tạm, ghi nợ C7                                           |
| Shape data 2025 lệch chỗ tiêu thụ → C6 phải refactor | đối chiếu consumer ngay ở Bước 1 (đọc technologies/experience/projects.tsx trước khi chốt interface) |
| 2 nguồn blog trùng (data/ và packages/)              | quy ước READ-ONLY từ C2, xóa ở C5; không sửa bài ở `apps/2025/data` nữa                              |

Rollback: phase chỉ **thêm file + sửa 4 MDX 2026** — `git checkout` working tree là sạch; chưa app nào phụ thuộc phần mới ngoài field `summary`.
