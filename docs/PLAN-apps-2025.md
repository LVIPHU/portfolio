# Kế hoạch: Đưa portfolio 2025 vào monorepo + nâng cấp công nghệ

> **Chiến lược đã chốt:** move nguyên trạng cho xanh trước (Giai đoạn A), sau đó nâng cấp theo từng đợt có kiểm soát (Giai đoạn B). Mỗi đợt một commit, build xanh mới sang đợt kế — gặp lỗi luôn biết thủ phạm.

**Phạm vi nâng cấp đã chốt:** Next 15→16 + React mới nhất · thay Contentlayer2 · thu gọn i18n còn vi+en · đồng bộ tooling với 2026 · motion → GSAP · tiếp thu công nghệ hay từ react.dev.

---

# GIAI ĐOẠN A — MOVE NGUYÊN TRẠNG (~1–1.5 giờ)

## Phase A0 — Chuẩn bị & điểm rollback

| Bước | Việc                                        | Lệnh / chi tiết                                                                                     |
| ---- | ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| A0.1 | Init git cho monorepo                       | `cd D:\portfolio && git init && git add -A && git commit -m "chore: scaffold monorepo + apps/2026"` |
| A0.2 | Thêm `.contentlayer/` vào `.gitignore` root | Contentlayer sinh cache này lúc build                                                               |
| A0.3 | Xác nhận baseline                           | `pnpm build` xanh (apps/2026 OK) — điểm quay về nếu hỏng                                            |

## Phase A1 — Đưa source vào `apps/2025`

Repo có nhiều media lớn (5 video .mp4, 7 file .wav, ~20 ảnh) — bản clone trong sandbox Claude thiếu file >100KB, nên **bạn clone trên máy** (1 lệnh duy nhất bạn cần chạy):

```bash
git clone https://github.com/LVIPHU/portfolio D:\portfolio\apps\2025
```

Claude xử lý tiếp: xóa `apps/2025/.git` (tránh git lồng nhau — lịch sử vẫn an toàn trên GitHub), xóa `.cursor/`, xóa lockfile con nếu có. Giữ nguyên toàn bộ `src/`, `data/`, `public/`, `scripts/`, `supabase/`, configs, `.env.example`.

## Phase A2 — Chỉnh để sống trong workspace

1. **`apps/2025/package.json`**: đổi `"name": "portfolio"` → `"web-2025"` (trùng tên root sẽ lỗi); `"dev": "next dev"` → `"next dev -p 3001"` (tránh trùng port). **Chưa nâng version gì ở giai đoạn này.**
2. **Root `package.json`**: thêm `"dev:2025": "turbo dev --filter=web-2025"`.
3. **Tạo `apps/2025/turbo.json`** — bản 2025 build ra nhiều hơn `.next/`:

```json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        ".contentlayer/**",
        "public/feed.xml",
        "public/search.json",
        "public/tags/**"
      ]
    }
  }
}
```

4. **Tạo `apps/2025/.env.local`** (bắt buộc — t3-env fail build nếu thiếu `NEXT_PUBLIC_APP_URL`):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_NODE_ENV=development
# Tùy chọn: DATABASE_URL (views/reactions), GITHUB_API_TOKEN (repo cards), NEXT_PUBLIC_GISCUS_* (comments)
```

## Phase A3 — Install, build, sửa tương thích

| Bước                            | Lỗi có thể gặp → cách xử                                                                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install` ở root           | `ERR_PNPM_IGNORED_BUILDS` (esbuild, @tailwindcss/oxide...) → `pnpm approve-builds --all`                                                              |
| `pnpm dev:2025` → :3001         | Contentlayer generate lần đầu hơi lâu — bình thường                                                                                                   |
| `pnpm build --filter=web-2025`  | Script build dùng `INIT_CWD=$PWD` (POSIX) → trên Windows đổi thành `"next build && next build"`; thử bỏ double-build xem Contentlayer còn flaky không |
| Module not found                | pnpm strict hơn npm → thêm dep thiếu vào `dependencies` của web-2025, không dùng shamefully-hoist                                                     |
| Peer warning React 19.0 vs 19.2 | Vô hại — pnpm cô lập deps từng app                                                                                                                    |

## Phase A4 — Kiểm thử song song & chốt Giai đoạn A

`pnpm dev` chạy cả 2 app (:3000 + :3001). Smoke test 2025: redirect `/`→`/vi-VN`, blog + KaTeX/code highlight, photos parallax, contact mở dạng modal từ navbar (parallel route) và dạng trang khi vào thẳng, đổi locale, Cmd+K, dark mode. Xác nhận 2026 không bị ảnh hưởng. Commit `feat: add 2025 portfolio as apps/2025`.

**✅ Gate: Giai đoạn A xanh hoàn toàn mới bắt đầu Giai đoạn B.**

---

# GIAI ĐOẠN B — NÂNG CẤP TỪNG ĐỢT (~15–25 giờ, rải ra được)

Thứ tự các đợt **có chủ đích** — 2 blocker của Next 16 là Contentlayer (webpack plugin) và Lingui (SWC plugin bám version Next), nên phải gỡ cả hai (B3, B4) **trước khi** lên Next 16 (B5):

```
B1 tooling → B2 gọn locale → B3 bỏ Contentlayer → B4 bỏ Lingui → B5 Next 16 → B6 GSAP → B7 react.dev goodies
   (0.5-1h)      (~1h)           (3-5h)              (4-6h)         (2-3h)      (3-5h)       (3-6h)
```

## Đợt B1 — Đồng bộ tooling với 2026 (rủi ro thấp, làm trước để có nền sạch)

- Tailwind `4.1` → `4.3.x` (minor, gần như drop-in); đồng bộ luôn version `tailwind-merge`, `tw-animate-css`
- Thêm `"typecheck": "tsc --noEmit"` cho web-2025 (root `turbo typecheck` tự nhận)
- Prettier config chung ở root (2025 đang có config riêng + prettier-plugin-tailwindcss — nâng lên bản mới, apply toàn monorepo)
- Dọn: README con (đang là default create-next-app) → viết README riêng cho apps/2025
- **Verify:** build + typecheck xanh cả 2 app. Commit `chore(2025): sync tooling with monorepo`.

## Đợt B2 — Thu gọn i18n: 6 locale → vi-VN + en-US (vẫn giữ Lingui tạm)

Bước trung gian có chủ đích: giảm khối lượng dịch TRƯỚC khi đổi engine i18n ở B4 (chỉ còn 2 catalog phải port thay vì 6).

- `lingui.config.js`: `locales: ['vi-VN', 'en-US']`; xóa 4 thư mục catalog ja/ko/zh trong `src/i18n/locales/`
- Middleware negotiator + `generateStaticParams` tự theo config — kiểm tra không còn sinh route ja/ko/zh
- Locale-switch UI: bỏ 4 option
- **Verify:** build xanh, chỉ còn `/vi-VN/*` + `/en-US/*`. Commit `feat(2025): reduce locales to vi+en`.

## Đợt B3 — Thay Contentlayer2 → **Velite** (gỡ blocker #1 của Next 16)

**Vì sao Velite:** cùng triết lý schema + computed fields như Contentlayer (migration cost thấp nhất), type-safe bằng Zod, chạy như build step độc lập — không phải webpack plugin → hết cảnh `next build` hai lần, tương thích Turbopack.

| Bước | Chi tiết                                                                                                                                                                                                    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B3.1 | Cài `velite`, tạo `velite.config.ts`: port 2 collection `Blog` + `Authors` từ `contentlayer.config.ts` — schema fields giữ nguyên tên để templates ít phải sửa                                              |
| B3.2 | Port computed fields: `slug`, `path`, `readingTime`, `toc` (hàm `extractTocHeadings` tái dùng được)                                                                                                         |
| B3.3 | Port pipeline remark/rehype **nguyên vẹn** (Velite nhận cùng plugin array): remark-gfm, math, alert, code-titles, img-to-jsx / rehype-slug, autolink, katex, prism-plus, pretty-code, citation, minify      |
| B3.4 | Port 2 side-effect trong config cũ: `createTagCount()` → `json/tag-data.json` và `createSearchIndex()` → `public/search.json` (Velite có hook `complete`, hoặc chuyển vào `scripts/post-build.ts` sẵn có)   |
| B3.5 | Sửa import trong ~10 file: `contentlayer/generated` → `.velite`; utils `allCoreContent/sortPosts` trong `src/utils/contentlayer.ts` giữ nguyên signature, chỉ đổi nguồn data — templates gần như không đụng |
| B3.6 | `next.config.ts`: bỏ `withContentlayer`; script build → `velite && next build` (một lần!); dev → `velite --watch & next dev` hoặc dùng plugin dev của Velite                                                |
| B3.7 | Gỡ deps: `contentlayer2`, `next-contentlayer2`                                                                                                                                                              |

- **Rủi ro:** MDX body — Contentlayer serialize sẵn code, Velite trả raw/compiled khác → `mdx-components/layout-renderer.tsx` cần đổi cách render (dùng `next-mdx-remote` hoặc Velite MDX output). Đây là điểm tốn thời gian nhất của đợt.
- **Verify:** blog list, 4 bài chi tiết (code highlight + KaTeX + TOC + reading time), tags, search Cmd+K, RSS. So HTML output trước/sau bằng mắt. Commit `feat(2025): replace contentlayer with velite`.

## Đợt B4 — Lingui → **next-intl** (gỡ blocker #2, đồng bộ engine i18n với 2026)

Việc lớn nhất giai đoạn B — macro `msg`/`t`/`Trans` rải khắp components + `data/main.ts`.

| Bước | Chi tiết                                                                                                                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B4.1 | Convert 2 catalog `.po` → `messages/vi.json` + `en.json` (viết script nhỏ parse .po, ~30 phút)                                                                                                                                                          |
| B4.2 | Setup next-intl y hệt 2026: `src/i18n/routing.ts` (locales `['vi','en']` — nhân tiện bỏ suffix `-VN`/`-US` cho URL gọn), `request.ts`, `navigation.ts`; middleware negotiator cũ → `createMiddleware(routing)` (next-intl tự negotiate accept-language) |
| B4.3 | Thay từng nhóm component: `useLingui()`/`t` → `useTranslations()`; `<Trans>` → `t()` hoặc `t.rich()`; `initLingui`/`setI18n` → `setRequestLocale`                                                                                                       |
| B4.4 | **`data/main.ts` (skills/projects/experience) — cơ hội vàng:** thay vì port MessageDescriptor sang next-intl, chuyển hẳn data này vào `packages/content` dạng `{vi, en}` — 2026 dùng chung được ngay, đúng mục tiêu monorepo                            |
| B4.5 | Gỡ deps: 6 package `@lingui/*`, `negotiator`; bỏ `experimental.swcPlugins` + turbo rules `.po` trong `next.config.ts`                                                                                                                                   |

- **Verify:** đổi ngôn ngữ mọi trang, không còn key lộ (missing translation), URL `/en/...` + vi không prefix. Commit `feat(2025): migrate lingui to next-intl, share data via packages/content`.

## Đợt B5 — Next 15 → 16 + React mới nhất (giờ mới an toàn)

- `next@^16`, `react@^19.2`, `react-dom@^19.2`, types tương ứng — đồng bộ version với 2026
- `src/middleware.ts` → đổi tên `src/proxy.ts` (convention mới của Next 16)
- `next lint` đã bị bỏ ở Next 16 → thay script lint bằng ESLint trực tiếp hoặc dựa vào `typecheck` như 2026
- Turbopack là default: kiểm tra `@svgr/webpack` (nếu đang dùng loader này cho SVG → chuyển sang turbopack rules hoặc import SVG như component thủ công)
- `params` đã là Promise từ Next 15 — code 2025 đã `await params` sẵn, không phải sửa
- Chạy `npx @next/codemod@latest` cho các API rename còn lại
- **Verify:** build Turbopack xanh, so sánh vài trang trước/sau. Commit `feat(2025): upgrade to next 16 + react 19.2`.

## Đợt B6 — framer-motion/motion → **GSAP**

GSAP hiện đã miễn phí 100% kể cả plugin premium (Webflow mua lại) — dùng thoải mái. Cài `gsap` + `@gsap/react` (hook `useGSAP` quản lý cleanup đúng chuẩn React).

| Component đang dùng motion                                       | Port sang                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `fade-content`, `animated-content` (fade/slide khi vào viewport) | `gsap.from()` + `ScrollTrigger`                                            |
| `parallax-scroll` (trang photos)                                 | `ScrollTrigger` với `scrub: true` — đúng sở trường GSAP                    |
| `hover-effect`, `growing-underline`                              | `gsap.to()` trên mouse events hoặc CSS thuần (cân nhắc — nhiều cái CSS đủ) |
| `floating-dock` (magnify kiểu macOS)                             | `gsap.quickTo()` — mượt hơn bản motion                                     |
| `modal`/`drawer`                                                 | Giữ nguyên — đang dùng `vaul` + Radix, không phải motion                   |

- Làm từng component, so hiệu ứng bằng mắt; xong hết mới gỡ `framer-motion` + `motion` khỏi deps
- **Verify:** không còn import `framer-motion`/`motion`; 60fps trên trang photos. Commit `feat(2025): replace motion with gsap`.

## Đợt B7 — Tiếp thu từ react.dev (chọn lọc!)

Đã soi `package.json` của react.dev — **lưu ý quan trọng:** stack nền của nó KHÔNG mới (Next 15.1, Tailwind 3.4, ESLint 7, Prettier 2, Yarn 1 — cũ hơn đồ bạn đang dùng). Đáng lấy là các "vũ khí đặc biệt":

| Lấy                                          | Là gì / vì sao                                                                                                                                                        |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sandpack** (`@codesandbox/sandpack-react`) | Code playground chạy được ngay trong bài blog — nâng tầm blog dev rõ rệt nhất. Tích hợp làm MDX component `<Sandpack>` trong `mdx-components/`                        |
| **React Compiler**                           | Next 16: bật `reactCompiler: true` trong `next.config.ts` + `eslint-plugin-react-compiler` — auto-memo, bỏ dần `useMemo`/`useCallback` thủ công. Bật cho cả 2026 luôn |
| **Scripts CI hay**                           | `deadLinkChecker` (quét link chết toàn site) + heading-id linter — port ý tưởng thành script node ở root, chạy trong `ci-check`                                       |
| **husky + lint-staged**                      | Ở root monorepo: pre-commit chạy prettier + typecheck file thay đổi                                                                                                   |

| Bỏ qua                                 | Lý do                                                               |
| -------------------------------------- | ------------------------------------------------------------------- |
| DocSearch (Algolia)                    | Cần server Algolia + crawl; kbar hiện có đã đủ cho quy mô portfolio |
| Toolchain của họ (yarn 1, eslint 7...) | Cũ hơn đồ bạn đang có                                               |
| Custom RSC worker build                | Giải pháp riêng cho quy mô react.dev, không cần                     |

- **Verify:** 1 bài blog demo có Sandpack chạy được; `ci-check` script chạy xanh ở root. Commit theo từng tính năng.

---

# DEPLOY (sau khi A xong là deploy được, B nâng tới đâu deploy tới đó)

1. Push monorepo lên GitHub (repo mới), archive repo cũ (giữ nguyên lịch sử + link)
2. Vercel 2 project cùng repo: `apps/2026` (domain chính) và `apps/2025` (`2025.<domain>`) — project 2025 khai báo đủ env production
3. Turborepo + Vercel tự skip build app không thay đổi

# TÓM TẮT RỦI RO

| Rủi ro                                 | Mức        | Phòng bị                                                                 |
| -------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| Thiếu media nếu copy từ sandbox        | Cao        | Bạn clone trực tiếp trên máy (A1)                                        |
| MDX render đổi khi bỏ Contentlayer     | Trung bình | B3 tách riêng, so output trước/sau, templates giữ nguyên interface       |
| Sót macro Lingui khi port              | Trung bình | Grep `@lingui` phải về 0 trước khi gỡ deps; test đổi ngôn ngữ từng trang |
| Nâng Next 16 kéo theo Turbopack loader | Trung bình | Đã gỡ 2 blocker ở B3/B4 trước; svgr xử lý ở B5                           |
| Hiệu ứng GSAP khác motion về cảm giác  | Thấp       | Port từng component, so bằng mắt, giữ motion đến khi xong hết            |
| pnpm strict lộ dependency ngầm         | Trung bình | Sửa từng module-not-found, thêm dep đúng chỗ                             |

**Phân công:** bạn chạy 1 lệnh clone (A1) + cho env thật nếu muốn bật đủ tính năng + nghiệm thu hiệu ứng GSAP bằng mắt; Claude làm toàn bộ phần còn lại, verify từng phase/đợt.
