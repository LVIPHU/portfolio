# Phase C7: 2025 Next 16.2.10 + dep sweep toàn bộ — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Phase này đưa `apps/2025` lên **đúng version core mà `apps/2026` đang dùng** (Next 16.2.10, React 19.2.7, TS ~5.9, Tailwind 4.3.x), sweep **mọi** dependency còn lại lên latest ổn định, gỡ các gói không còn lý do tồn tại (svgr, bundle-analyzer, `next lint`, cross-env, autoprefixer/postcss-import, dep chết), và chuẩn hóa theo Next 16: `middleware.ts` → `proxy.ts`, build Turbopack. Từ đây 2 app khóa chung version core — "nâng 1 là nâng cho cả 2" (REQ-05, REQ-10).

KHÔNG thuộc phase này: gỡ Radix/vaul/cva/clsx/tailwind-merge (C8), gỡ framer-motion/motion/@emotion/is-prop-valid (C9), React Compiler + ESLint react-hooks flat config (C10). Phụ thuộc: C5 + C6 đã gỡ 2 blocker (contentlayer2, @lingui/swc-plugin). Phase này chặn C8 (shadcn Base UI cần stack mới) và C10. Ước lượng ~2–4h.
</domain>

<decisions>
## Quyết định đã khóa

### Core & chuẩn Next 16

- **D-01:** 2025 lên **đúng version 2026 đang dùng**: `next@^16.2.10` (khớp hệt range của 2026 để lockfile dedupe về 1 bản; **cấm canary 16.3**), `react@^19.2.7`, `react-dom@^19.2.7`, `typescript@~5.9`, `@types/node@^24`, `@types/react*` latest. Quy ước **version pinning theo anchor app**: 2026 là mỏ neo version core (next/react/tailwind/lucide), 2025 khớp theo — không tự do trôi.
- **D-02:** Chạy codemod `npx @next/codemod@latest upgrade` trong `apps/2025` TRƯỚC khi sửa tay — để codemod lo async request APIs (`params`/`searchParams` Promise — đã là Promise từ Next 15 nên ít việc) và rename middleware. Sau codemod phải review diff.
- **D-03:** `src/middleware.ts` → `src/proxy.ts` (convention Next 16, giống 2026) bằng `git mv` nếu codemod chưa làm; nội dung/export giữ nguyên (sau C6 file này là `createMiddleware` của next-intl — C7 chỉ đổi tên file).
- **D-04:** `next.config.ts` về **object thuần** (không còn reduce qua plugin wrapper): xóa `withBundleAnalyzer`, xóa toàn bộ block `webpack` (rule svgr hết lý do; rule `.po` đã xóa ở C6), xóa `experimental.turbo.rules` (không còn `.po`) và `experimental.swcPlugins` (lingui đã gỡ ở C6). **GIỮ nguyên văn**: 7 security headers (gồm Content-Security-Policy), `images.remotePatterns` (api.microlink.io + drive.google.com), `env` (version/owner/email từ package.json), `pageExtensions`, `reactStrictMode`. Sau khi bỏ wrapper phải xác nhận CSP vẫn áp lên response (checkpoint cuối phase).
- **D-05:** Gỡ `@svgr/webpack` — chỉ `grid-background.tsx` import SVG qua svgr → inline SVG đó thành JSX ngay trong component (theo mẫu M-01), giữ prop `className` và các class fill/stroke như cũ; không xóa file svg nguồn trong phase này (dọn xác ở C12).
- **D-06:** Build **Turbopack** (mặc định Next 16), không thêm cấu hình webpack mới. Điểm nghi Turbopack: format postcss config, import `.css` từ node_modules. Nếu Turbopack lỗi với 1 dep: fix tại chỗ hoặc pin gói lỗi và ghi nợ C8/C9 (2 nhóm dep lớn chưa đụng là radix và framer-motion — cả 2 đều Turbopack-safe).

### Chiến lược sweep & gỡ

- **D-07:** Trình tự sweep trên branch `c7-next16`: **delete before upgrade** (gỡ gói chết trước khi nâng — mỗi gói gỡ là một nguồn breaking biến mất); nâng **1 lần `pnpm up` theo danh sách** rồi build ngay, lỗi đâu sửa đó (không nâng từng gói build từng lần — danh sách dài, đa số patch/minor an toàn); nhưng **build sau mỗi nhóm** (core → thường → gỡ) + commit WIP cục bộ trên branch để bisect được khi nâng cả chùm.
- **D-08:** `zod 3 → 4` ngay trong sweep này — `@portfolio/content` đã zod 4 từ C2, đưa 2025 về cùng version để chỉ còn **1 bản zod trong node_modules**. Nâng đồng bộ `@hookform/resolvers 4→5` + `@t3-oss/env-nextjs 0.12→latest` (cả 2 bản mới đều hỗ trợ zod 4). Chỗ dùng phải rà: env schema t3-env (`env.mjs`), contact-form resolver, API validate. Nếu kẹt domino: tách riêng commit `chore: zod 4 migration`, dùng subpath `zod/v3` compat cho t3-env trong lúc chờ.
- **D-09:** `drizzle-orm 0.41→latest` + `drizzle-kit 0.30→latest`, đọc breaking notes — schema chỉ có bảng views/reactions đơn giản, không đổi, nên breaking thường chỉ ở format `drizzle.config.ts` (đổi theo docs mới) hoặc đổi import. DB client lazy — build không kết nối, lỗi chỉ lộ khi chạy thật → **bắt buộc smoke views counter ở checkpoint** (cần DATABASE_URL thật, hoặc chấp nhận fail-safe tĩnh).
- **D-10:** Các gói khóa theo anchor: `lucide-react 0.475→^1.24` (khớp packages/ui — **1 version cả repo**), `tailwindcss` + `@tailwindcss/postcss` `4.1→^4.3.2` (khớp 2026), `@tailwindcss/typography` + `tw-animate-css` latest, `next-themes→^0.4.6` (khớp 2026). Nhóm nâng thường còn lại (đọc changelog bản major trước khi nâng): `dayjs`, `swr`, `react-hook-form ^7`, `@octokit/graphql`, `@giscus/react`, `react-share`, `react-medium-image-zoom`, `react-github-calendar`, `kbar` (vẫn beta — lấy beta mới nhất), `postgres`, `tsx`, `eslint 9` + họ hàng (`@eslint/eslintrc`), và mọi dep còn sót khác lên latest ổn định.
- **D-11:** Gỡ hẳn `@next/bundle-analyzer` + script `analyze` (khi cần đo: `next build --profile` hoặc thêm lại tạm). Gỡ `eslint-config-next` + script `lint`/`lint:fix` (`next lint` deprecated ở Next 16) — 2025 theo 2026: **gate = typecheck**; dep `eslint` 9 giữ và nâng latest, ESLint quay lại ở C10 với react-hooks plugin, cấu hình flat ở root.
- **D-12:** Gỡ `cross-env` cùng script `deploy` cũ (chỉ còn 2 chỗ dùng trong scripts: `deploy` + `analyze` — cả 2 script đều xóa). Gỡ `autoprefixer` + `postcss-import` (Tailwind v4 qua `@tailwindcss/postcss` tự lo prefix/import; `postcss.config.mjs` đã xác minh chỉ dùng `@tailwindcss/postcss`). Gỡ `mini-svg-data-uri` (0 tham chiếu đã xác minh). Gỡ `lodash.debounce` + `@types/lodash.debounce` khỏi app: chuyển `src/hooks/use-window-size.ts` sang `useDebounceCallback` của `@portfolio/ui` rồi xóa bản trùng `src/hooks/use-debounce-callback.ts` (packages/ui đã có hook y hệt và tự khai báo lodash.debounce). **GIỮ `qss`** — còn 1 tham chiếu thật (`link-preview.tsx`), chỉ nâng latest. Nguyên tắc chung: grep từng gói trước khi xóa khỏi package.json, xác nhận 0 import.
- **D-13:** **Giữ nguyên có chủ đích, KHÔNG nâng/gỡ**: `framer-motion`, `motion`, `@emotion/is-prop-valid` (C9 mới gỡ); `@radix-ui/*`, `vaul`, `class-variance-authority`, `clsx`, `tailwind-merge` (C8 mới gỡ).
- **D-14:** 2026 tiện tay: `next-intl` lên `^4.13.2` (patch), xác nhận không kéo lệch version core của 2026.
- **D-15:** Đóng phase chỉ khi: push → **cả 2 deploy Vercel xanh** (điểm nghi: khác biệt Turbopack trên CI so với local). Rollback = revert merge; không có migration dữ liệu (drizzle schema không đổi trong phase này).

### Claude tự quyết

- Phiên bản "latest" chính xác của nhóm nâng thường tại thời điểm chạy (dayjs, swr, octokit, giscus, react-share, react-medium-image-zoom, react-github-calendar, kbar beta, react-hook-form, postgres, tsx, dotenv, @types/\*, họ remark/rehype nếu còn) — miễn đọc changelog các bản major trước khi nâng, ghi version chốt vào SUMMARY.
- Chi tiết inline SVG: tên id pattern, thuộc tính aria — miễn giữ prop `className` và class fill/stroke như M-01.
- Thứ tự sửa lỗi build khi sweep (lỗi đâu sửa đó theo D-07).
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

### M-01 — Inline SVG cho `grid-background.tsx` (thay import svgr)

Nguồn `apps/2025/public/static/images/backgrounds/grid.svg` hiện tại:

```xml
<svg>
  <defs>
    <pattern id="pt" width="72" height="56" patternUnits="userSpaceOnUse" x="50%" y="16">
      <path d="M.5 56V.5H72" fill="none"></path>
    </pattern>
  </defs>
  <rect width="100%" height="100%" stroke-width="0" fill="url(#pt)"></rect>
  <svg x="50%" y="16" className="overflow-visible">
    <rect stroke-width="0" width="73" height="57" x="0" y="56"></rect>
    <rect stroke-width="0" width="73" height="57" x="72" y="168"></rect>
  </svg>
</svg>
```

Component đích `apps/2025/src/components/atoms/grid-background.tsx` (bỏ `import Grid from '@public/...grid.svg'`, giữ nguyên wrapper div + toàn bộ class):

```tsx
import { cn } from '@/utils'

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn(['absolute overflow-hidden [mask-image:linear-gradient(white,transparent)]', className])}>
      <svg
        aria-hidden='true'
        className={cn([
          'h-[160%] w-full',
          'absolute inset-x-0 inset-y-[-30%] skew-y-[-18deg]',
          'dark:fill-white/[.01] dark:stroke-white/[.025]',
          'fill-black/[0.02] stroke-black/5',
        ])}
      >
        <defs>
          <pattern id='grid-bg-pattern' width='72' height='56' patternUnits='userSpaceOnUse' x='50%' y='16'>
            <path d='M.5 56V.5H72' fill='none' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' strokeWidth='0' fill='url(#grid-bg-pattern)' />
        <svg x='50%' y='16' className='overflow-visible'>
          <rect strokeWidth='0' width='73' height='57' x='0' y='56' />
          <rect strokeWidth='0' width='73' height='57' x='72' y='168' />
        </svg>
      </svg>
    </div>
  )
}
```

### M-02 — Lệnh nâng nhóm core (chạy trong `apps/2025`)

```bash
cd apps/2025
pnpm up "next@^16.2.10" "react@^19.2.7" "react-dom@^19.2.7" \
  "typescript@~5.9.0" "@types/node@^24" "@types/react@latest" "@types/react-dom@latest"
npx @next/codemod@latest upgrade
```

### M-03 — `next.config.ts` đích (object thuần, CSP giữ nguyên văn)

```ts
import { version, author } from './package.json'
import type { NextConfig } from 'next'

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src * blob: data:;
  media-src 'self' http://localhost:3000 blob: data:;
  connect-src *;
  font-src 'self' fonts.gstatic.com;
  frame-src giscus.app;
`

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  env: {
    version: version,
    owner: author.name,
    email: author.email,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.microlink.io' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
```

(Nếu C5/C6 đã sửa file này khác đi thì lấy hiện trạng lúc thi công làm gốc — phần bất biến là: object thuần, đủ 7 header, remotePatterns, env, pageExtensions.)

### M-04 — Lệnh sweep nhóm nâng thường (chạy trong `apps/2025`, theo bảng D-08/D-09/D-10)

```bash
cd apps/2025
pnpm up dayjs@latest swr@latest drizzle-orm@latest drizzle-kit@latest \
  react-hook-form@latest "@hookform/resolvers@latest" zod@latest \
  "@octokit/graphql@latest" "@giscus/react@latest" react-share@latest \
  react-medium-image-zoom@latest react-github-calendar@latest kbar@beta \
  "next-themes@^0.4.6" "@t3-oss/env-nextjs@latest" \
  "tailwindcss@^4.3.2" "@tailwindcss/postcss@^4.3.2" "@tailwindcss/typography@latest" \
  tw-animate-css@latest "lucide-react@^1.24.0" postgres@latest tsx@latest \
  dotenv@latest qss@latest eslint@latest "@eslint/eslintrc@latest"

# 2026 tiện tay (patch, theo D-14):
pnpm --filter web-2026 up "next-intl@^4.13.2"
```

(Dep còn sót ngoài danh sách tại thời điểm chạy — ví dụ github-slugger, js-yaml, probe-image-size, reading-time, @types/\* — nâng latest cùng đợt; gói đã rời đi ở C5/C6 thì bỏ qua; @types mồ côi của gói đã rời thì gỡ.)

### M-05 — Lệnh gỡ nhóm chết (chạy trong `apps/2025`, theo D-11/D-12)

```bash
cd apps/2025
pnpm remove @next/bundle-analyzer eslint-config-next cross-env \
  autoprefixer postcss-import mini-svg-data-uri lodash.debounce @types/lodash.debounce
```

(Kèm xóa scripts trong package.json: `analyze`, `deploy`, `lint`, `lint:fix`. `@svgr/webpack` đã gỡ ở plan 01.)
</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` — Phase C7: Goal, REQ-05/REQ-10, 3 success criteria (1-version-per-package, Turbopack + CSP, 2 deploy Vercel xanh).
- `docs/plans/STATE.md` — quyết định toàn cục: pin Next 16.2.10 stable (không canary), React 19.2.7, zod 4; 1 commit/plan; main phải luôn build được (auto-deploy).
- `docs/plans/archive/C7-2025-next16-dep-sweep.md` — plan chi tiết gốc: bảng sweep đầy đủ, điểm nóng 4.1–4.3, bảng rủi ro→phòng bị, 5 gate nghiệm thu.
- `apps/2025/package.json` — hiện trạng dependency (chụp trước C5/C6 — xem code_context).
- `apps/2025/next.config.ts` — CSP + 7 security headers phải bảo toàn nguyên văn.
- `apps/2026/package.json` — anchor version core (next/react/tailwind/@types/node/next-themes).
- `packages/ui/package.json` — anchor `lucide-react ^1.24.0`, nơi ở mới của `lodash.debounce`.
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh 2026-07-11)

### Tài sản tái dùng

- `packages/ui/src/hooks/` đã có `use-debounce-callback.ts` (export qua `packages/ui/src/hooks/index.ts`) — bản y hệt hook cùng tên của 2025; packages/ui tự khai báo `lodash.debounce ^4.0.8` → app 2025 gỡ được dep này (D-12).
- `apps/2026` là anchor: `next ^16.2.10`, `react`/`react-dom ^19.2.7`, `tailwindcss` + `@tailwindcss/postcss ^4.3.2`, `@types/node ^24.0.0`, `next-themes ^0.4.6`, `next-intl ^4.13.1`, `lucide-react ^1.23.0`, `typescript ^5.6.0` (các range caret đều phủ bản đích — gate 1-version dựa trên bản resolve trong lockfile).

### Pattern đã có

- 2026 dùng `src/proxy.ts` (convention Next 16) — 2025 rename theo (D-03).
- 2026 không có eslint/prettier trong package.json app — gate = typecheck (D-11 theo pattern này).
- Cả 2 app SSG thuần → semantics `revalidate`/`dynamic` không đổi với Next 16 (điểm rà 4.1 của plan gốc).

### Điểm tích hợp

- `apps/2025/package.json` (chụp 2026-07-11, TRƯỚC C5/C6): 69 dependencies + 28 devDependencies. Version chốt hiện tại: `next 15.2.8`, `react ^19.0.0`, `zod ^3.25.76`, `lucide-react ^0.475.0`, `tailwindcss ^4.1.0`, `drizzle-orm ^0.41.0`, `drizzle-kit ^0.30.6`, `@hookform/resolvers ^4.1.3`, `@t3-oss/env-nextjs ^0.12.0`, `@types/node ^20`, `typescript ^5`. **Lưu ý:** tại thời điểm C7, các gói contentlayer2/next-contentlayer2/@lingui\*/negotiator (+@types) và có thể họ remark/rehype đã rời đi ở C3/C5/C6 — sweep áp lên phần còn lại thực tế, grep lại package.json lúc thi công.
- `apps/2025/next.config.ts` hiện là hàm reduce 2 plugin `[withContentlayer, withBundleAnalyzer]`; block `webpack` có 2 rule (`.po` lingui + `.svg` svgr); `experimental.swcPlugins` (@lingui/swc-plugin) + `experimental.turbo.rules` (`*.po`); 7 security headers; `images.remotePatterns`: api.microlink.io + drive.google.com; `env`: version/owner/email. C5/C6 gỡ phần contentlayer/lingui — C7 gỡ nốt `withBundleAnalyzer` + rule svgr + block webpack trống (D-04).
- `apps/2025/src/middleware.ts` tồn tại (hiện export `function middleware` dùng negotiator; sau C6 là `createMiddleware` next-intl) — C7 chỉ rename giữ export.
- Grep svgr: `grid-background.tsx` là file **duy nhất** import `.svg` qua svgr (`import Grid from '@public/static/images/backgrounds/grid.svg'`). Nguồn SVG: pattern 72×56 + 2 rect 73×57 (đã chép vào M-01).
- `apps/2025/postcss.config.mjs` chỉ dùng `'@tailwindcss/postcss'` → `autoprefixer` + `postcss-import` là dep khai báo thừa, 0 tham chiếu config.
- `cross-env`: đúng 2 chỗ, đều trong scripts (`deploy`, `analyze`), 0 trong code.
- Grep dep nghi chết: `mini-svg-data-uri` **0** tham chiếu trong src; `qss` **1** tham chiếu (`src/components/atoms/link-preview.tsx` — `import { encode } from 'qss'`) → GIỮ; `lodash.debounce` **1** tham chiếu (`src/hooks/use-debounce-callback.ts`, được `src/hooks/use-window-size.ts` tiêu thụ qua `src/hooks/index.ts`) → thay bằng @portfolio/ui.
- zod hiện trạng 2025: import duy nhất ở `apps/2025/env.mjs` (`createEnv` của t3-env + `z.string().refine(...)` cho NODE_ENV/DATABASE_URL); `contact-form.tsx` hiện CHƯA dùng react-hook-form/zodResolver (chỉ `atoms/form.tsx` import react-hook-form) — C5/C6 có thể thay đổi, grep lại `zodResolver`/`from 'zod'` lúc thi công (điểm nóng D-08 giữ nguyên phạm vi rà của plan gốc: env schema, contact-form resolver, API validate).
- `apps/2025/drizzle.config.ts` tồn tại, dùng `defineConfig` từ drizzle-kit — nơi hứng breaking format của D-09.
- `apps/2025/turbo.json`: build khai `env: [DATABASE_URL, GITHUB_API_TOKEN]`, outputs còn `.contentlayer/**` (C5 dọn) — C7 không đụng trừ khi build đỏ.
- Vercel: 2 project (`web-2026`, `web-2025`), push main auto-deploy cả 2 — main phải luôn build được; KHÔNG dùng `vercel build` local trên Windows (CLAUDE.md).
  </code_context>

<deferred>
## Ý tưởng hoãn

- Gỡ `@radix-ui/*`, `vaul`, `class-variance-authority`, `clsx`, `tailwind-merge` — Phase C8.
- Gỡ `framer-motion`, `motion`, `@emotion/is-prop-valid` — Phase C9.
- ESLint quay lại: eslint-plugin-react-hooks flat config ở root (tận dụng dep `eslint` 9 đang giữ) — Phase C10.
- Ghi quy ước "version pinning theo anchor app 2026" vào CLAUDE.md — Phase C12.
- Xóa asset mồ côi `apps/2025/public/static/images/backgrounds/grid.svg` sau khi inline — Phase C12 (dọn xác code).
- Bundle analyzer: khi cần đo lại bundle thì dùng `next build --profile` hoặc thêm lại `@next/bundle-analyzer` tạm — backlog, không thuộc phase nào.
</deferred>

---

_Phase: C07-2025-next16-dep-sweep_
