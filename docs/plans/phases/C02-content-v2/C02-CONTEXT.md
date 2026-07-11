# Phase C2: packages/content v2 — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Đang thi công (dở — xem code_context)

<domain>
## Ranh giới phase

`@portfolio/content` trở thành nguồn sự thật duy nhất: schema Zod hợp nhất cho blog/authors, hút 4 bài blog + 5 authors + ảnh banner từ `apps/2025/data/` (COPY, chưa xóa nguồn), dịch data tĩnh 2025 (skills/experience/projects/site-metadata) sang `Localized{vi,en}`, chuẩn hóa 4 bài 2026 theo schema mới. KHÔNG thuộc phase: render MDX (C3), sửa app 2025 (C5/C6), xóa `apps/2025/data` (C5/C6).
</domain>

<decisions>
## Quyết định đã khóa

### Kiến trúc content

- **D-01:** Content layer THỦ CÔNG (gray-matter + Zod), không content-collections/contentlayer — mọi data hiển thị của cả 2 app nằm trong `packages/content`.
- **D-02:** Schema chuẩn hóa theo field của 2025: `summary` (không phải `description`), `lastmod`, `images`, `authors`, `layout`, `canonicalUrl`; validate `safeParse` ném Error kèm **đường dẫn file** (fail-fast lúc build).
- **D-03:** Locale nằm trong TÊN FILE `<slug>.<locale>.mdx` (vi|en), không trong frontmatter; `getPost` fallback sang locale còn lại khi thiếu bản dịch.
- **D-04:** Dùng `zod@^4` ngay từ phase này (C7 sweep khỏi đụng lại); nếu `z.string().url()` deprecated gây lỗi → đổi `z.url()` trong schema.ts.

### Dịch data 2025

- **D-05:** Dịch MÁY MÓC từ 2 catalog .po: mỗi `` msg`X` `` → `en = X` (msgid), `vi = msgstr` tra trong `apps/2025/src/i18n/locales/vi-VN/messages.po`; msgstr rỗng → `vi = X` + comment `// TODO dịch`. Field không phải text (date, logo, url, imgSrc, builtWith, items) giữ literal.
- **D-06:** Shape 4 file data phải KHỚP chỗ tiêu thụ hiện tại (`organisms/technologies.tsx`, `organisms/experience.tsx`, `templates/projects.tsx`, site-metadata callers) — đối chiếu consumer TRƯỚC khi chốt interface, để C6 chỉ đổi import. Interface định nghĩa ngay trong từng file data, không phình types.ts.

### Copy content

- **D-07:** `apps/2025/data/` là READ-ONLY từ phase này (xóa dứt điểm C5/C6); copy một chiều sang packages/content.
- **D-08:** Khi copy blog: bỏ tag `vietnamese`/`english` (locale đã ở tên file); `images: /static/images/banners/x.jpg` → `/content/blog/x.jpg`; body MDX giữ nguyên 100%.
- **D-09:** Frontmatter author: XÓA key `layout` khi copy (không ai dùng); Zod strip unknown key là hành vi chấp nhận.
- **D-10:** Derive functions giữ shape cũ của 2025 để C5 thay nguồn không đổi code: `getTagData()` → `Record<tag, count>` (json/tag-data.json), `getSearchDocs()` → PostMeta[] (public/search.json cho kbar).

### Claude tự quyết

- Tên biến/interface trong 4 file data (miễn export đúng `SKILLS_2025`, `EXPERIENCES_2025`, `PROJECTS_2025`, `SITE_METADATA_2025` như index.ts đã khai).
- Cách tổ chức assets con (`assets/blog/`, `assets/authors/`).
- Có memo hóa loader hay không (mặc định: không — 8 bài, fs sync đủ nhanh).
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

**M-01 — Khuôn file data (skills2025.ts):**

```ts
import type { Localized } from './types'

export interface Skill2025 {
  label: Localized
  items: { name: string; icon?: string }[] // khớp shape main.ts hiện tại
}
export const SKILLS_2025: Skill2025[] = [/* dịch từ apps/2025/data/main.ts theo D-05 */]
```

**M-02 — Bảng copy blog (nguồn → đích):**

| `apps/2025/data/blog/`                               | `packages/content/blog/`                                |
| ---------------------------------------------------- | ------------------------------------------------------- |
| `kien-truc-react-fiber.mdx`                          | `kien-truc-react-fiber.vi.mdx`                          |
| `cac-component-element-va-instance-trong-react.mdx`  | `cac-component-element-va-instance-trong-react.vi.mdx`  |
| `does-promise-all-run-in-parallel-or-sequential.mdx` | `does-promise-all-run-in-parallel-or-sequential.en.mdx` |
| `guide-to-using-images-in-nextjs.mdx`                | `guide-to-using-images-in-nextjs.en.mdx`                |

**M-03 — Test tiêu cực fail-fast:** đặt tạm `date: banana` vào 1 file MDX → `pnpm build --filter=web-2026` phải ĐỎ với message chứa đường dẫn file → hoàn lại. Đây là bằng chứng D-02 hoạt động.
</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` §Phase C2 — goal, REQ-01/REQ-10, success criteria
- `apps/2025/data/main.ts` — nguồn skills/experience/projects (29 chuỗi msg)
- `apps/2025/data/site-metadata.ts` — nguồn site metadata (3 chuỗi msg)
- `apps/2025/src/i18n/locales/vi-VN/messages.po` + `en-US/messages.po` — catalog tra bản dịch (D-05)
- `packages/content/src/index.ts` — hợp đồng export đã khai sẵn (4 export *_2025)
- `apps/2026/scripts/sync-content-assets.mjs` — cơ chế copy assets → public/content
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh)

### Đã xong trong working tree (KHÔNG tạo task viết lại)

- `packages/content/src/schema.ts` — postFrontmatterSchema + authorFrontmatterSchema (Zod)
- `packages/content/src/types.ts` — PostMeta/Post mở rộng + Author + TagCount
- `packages/content/src/blog.ts` — contentDir/listFiles/toPost/getAllPosts/getPost/getAllSlugs/getAllTags/getPostsByTag/getTagData/getSearchDocs/getStructuredData
- `packages/content/src/authors.ts` — getAllAuthors/getAuthor
- `packages/content/src/index.ts` — barrel ĐÃ export 4 module data 2025

### ĐANG VỠ

- index.ts export từ `./skills2025`, `./experience2025`, `./projects2025`, `./site-metadata2025` — **4 file chưa tồn tại** → `pnpm --filter @portfolio/content typecheck` ĐỎ. (Subagent dịch chết vì session limit, chưa tạo file nào.)
- `packages/content/package.json` deps mới có `gray-matter` — blog.ts import `reading-time`, schema.ts import `zod` → thiếu 2 deps.

### Content nguồn

- 4 bài blog 2025 (2 vi, 2 en — tag vietnamese/english đánh dấu); frontmatter 2025 ĐÃ dùng `summary`, có lastmod/images/authors.
- 5 authors: `default, leohuynh, danabramov, andrewclark, sparrowhawk`.
- 4 MDX 2026 (`hello-world.{vi,en}`, `portfolio-monorepo.{vi,en}`) đang dùng `description:` → cần đổi `summary:`; code 2026 đọc `post.description` ở `components/post-card.tsx`, `app/[locale]/blog/page.tsx`, `app/[locale]/blog/[slug]/page.tsx` (generateMetadata) — grep lại khi sửa.

### Điểm tích hợp

- 2026 tiêu thụ qua `transpilePackages` (đã khai) + `sync-content-assets.mjs` (predev/prebuild, wipe rồi copy `packages/content/assets` → `public/content`) — KIỂM script copy đệ quy được thư mục con mới `blog/`, `authors/`.
  </code_context>

<deferred>
## Ý tưởng hoãn

- Xóa `apps/2025/data/blog` + `data/authors` — Phase C5
- Xóa `apps/2025/data/main.ts` + `site-metadata.ts` — Phase C6
- Render MDX (pipeline, components) — Phase C3
- Memo hóa loader theo mtime — chỉ khi >50 bài, backlog
</deferred>

---

_Phase: C02-content-v2_
