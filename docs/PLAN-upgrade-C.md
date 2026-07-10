# Kế hoạch C — Tách packages dùng chung + nâng cấp toàn diện 2 app

## Context

Monorepo có apps/2025 (Next 15.2 + Contentlayer2 + Lingui 6-locale + Radix + framer-motion, đã hoàn thiện nội dung) và apps/2026 (Next 16 + next-intl, mới có khung + 3 component). User muốn: **tách hooks/utils/models/UI/content dùng chung ra packages** ("nâng 1 là nâng cho cả 2"), nâng cấp **cả hai app** lên stack mới nhất: shadcn mới nhất trên **Base UI** (user chọn bỏ Radix), motion→**GSAP 3.15** (free 100%), MD renderer học **react.dev** (callouts + Sandpack; đã research: pipeline compile tự chế + CodeMirror highlight của họ là overkill, KHÔNG port), Tailwind/Next/React mới nhất, React Compiler, i18n hợp nhất (Lingui→next-intl, 6 locale→vi+en), CI/tooling. Kế hoạch này **thay thế Giai đoạn B** của docs/PLAN-apps-2025.md.

Research 2026-07 đã chốt: shadcn CLI 4.13 (Base UI default, `-b base`, không codemod Radix→Base — nhưng chỉ có 15 chỗ `asChild`/10 file); contentlayer2 gần chết (Windows yếu, không Turbopack) → **content layer THỦ CÔNG** (gray-matter + Zod + next-mdx-remote/rsc — mở rộng pattern packages/content sẵn có, vì content-collections là codegen per-app không hợp share); bỏ rehype-prism-plus giữ rehype-pretty-code+Shiki; Next 16.2.10 stable (không dùng 16.3 canary); React Compiler = option stable trong Next 16, eslint rules đã merge vào eslint-plugin-react-hooks.

**Nguyên tắc:** mỗi phase 1 commit (phase lớn 2 commit), build xanh CẢ 2 app mới sang phase kế, main luôn deploy được (2 project Vercel auto-deploy). Ước lượng tổng ~35–45h, rải được nhiều phiên.

## Kiến trúc packages đích (3 package — không hơn)

```
packages/
├── content/   @portfolio/content (MỞ RỘNG): blog/<slug>.<locale>.mdx hợp nhất,
│              authors/, assets/, src/ = types + Zod schema + skills/experience/projects
│              (hút từ apps/2025/data/main.ts, dịch MessageDescriptor→Localized{vi,en}
│              lấy bản dịch từ 2 catalog .po sẵn có) + blog loader + derive tag/search
├── ui/        @portfolio/ui (MỚI): shadcn Base UI (data-slot, giữ custom 2025:
│              button icon-sm/icon-lg, badge [a&]:hover) + motion/ (GSAP primitives)
│              + hooks/ (9 hook từ 2025) + lib/utils.ts (cn)
└── mdx/       @portfolio/mdx (MỚI): pipeline.ts (remark/rehype chung) + components/
               (Callout kiểu react.dev, Pre+Copy, CodeTitle, TerminalBlock, YouTube,
               Sandpack lazy) + render.tsx (<MDXContent> RSC bọc next-mdx-remote/rsc)
```

Cả 3 theo pattern hiện có: `exports: "./src/index.ts"`, không build step, app khai `transpilePackages` + Tailwind `@source "../../packages/{ui,mdx}/src"` trong globals.css. **Theme KHÔNG ship trong ui** — component dùng semantic tokens, mỗi app tự định nghĩa giá trị (giữ cá tính từng version). `hooks` nhét vào ui; không cần packages/config (prettier/tsconfig base ở root).

## Các phase

```
C0 tooling → C1 ui+2026 → C2 content-v2 → C3 mdx+2026 → C4 2025 trim locale
→ C5 2025 bỏ contentlayer → C6 2025 next-intl → C7 2025 Next16 + dep sweep
→ C8 UI hợp nhất (bỏ Radix) → C9 GSAP → C10 React Compiler → C11 Sandpack → C12 CI + dọn
```

Ràng buộc thứ tự: packages trước consumer; 2026 ăn trước (ít nợ, thấy giá trị sớm); C5+C6 (2 blocker webpack/SWC) TRƯỚC C7 Next 16.

### C0 — Tooling nền móng (~1h)

Root: prettier + prettier-plugin-tailwindcss (hút config từ apps/2025/.prettierrc, xóa config con), husky + lint-staged (chỉ prettier, <5s), tsconfig.base.json (apps+packages extends), thêm `typecheck` script cho web-2025. Commit format tách riêng (`style:`) nếu diff lớn.
**Gate:** `pnpm typecheck` + `pnpm build` cả 2 (2025 từ PowerShell).

### C1 — packages/ui (Base UI) + 2026 tiêu thụ (~2-3h)

`pnpm dlx shadcn@latest init -b base` trong packages/ui (components.json: new-york, zinc — khớp 2025) → add **button, badge, card, separator** + port custom variants 2025 + 9 hooks + cn(). 2026: xóa 3 file src/components/ui/, đổi import `@portfolio/ui`, transpilePackages + `@source`.
**Gate:** build web-2026 + smoke :3000 (home/blog card/badge/dark mode). Rủi ro: shadcn init trong package con ghi nhầm path → `--dry-run` kiểm trước.

### C2 — packages/content v2: Zod + hút data 2025 (~3-4h)

`schema.ts` (Zod, chuẩn field theo 2025): `{title, date, lastmod?, tags[], draft?, summary, images?, authors?, layout?, canonicalUrl?}`; sửa 4 MDX 2026 (`description`→`summary`); blog.ts validate + computed (readingTime, structuredData) + `getTagData()`/`getSearchDocs()` (shape khớp search.json cũ cho kbar); authors loader. **Copy** (chưa xóa nguồn): 4 blog 2025 → `blog/<slug>.<locale thật>.mdx` (bỏ tag vietnamese/english), 5 authors, ảnh banner → assets/blog + sửa frontmatter images. Dịch data/main.ts (29 msg) + site-metadata (3 msg) → Localized (lấy từ .po) vào content/src.
**Gate:** build web-2026, :3000/blog thấy đủ 6 bài + fallback locale + tags gộp; 2025 xanh không đổi. Quy ước: từ đây `apps/2025/data` READ-ONLY chờ xóa.

### C3 — packages/mdx + 2026 dùng (~3-4h)

pipeline.ts — remark: gfm, math, **smartypants**, alert(blockquote), port code-titles + img-to-jsx từ apps/2025/src/libs/remark, port header-id `{/*id*/}` của react.dev; rehype: slug, autolink(prepend icon), katex, **pretty-code** (dual theme github-dark-dimmed/solarized-light — giữ look 2025). **BỎ:** rehype-prism-plus (chồng chéo), preset-minify, citation (0 bài dùng). Components: Callout (port ExpandableCallout: note/pitfall/deep-dive/wip qua variantMap), Pre+CopyCode/CodeTitle/TableWrapper (port từ 2025 mdx-components), YouTube, TerminalBlock; render.tsx `<MDXContent>` RSC + extractTocHeadings. 2026 blog page đổi sang `<MDXContent>`; katex CSS; style code block chuyển sang data-attributes của pretty-code (`data-line`, `data-highlighted-line`) — CSS đi kèm package.
**Gate:** build 2026, bài portfolio-monorepo render dual-theme + copy button + 1 `<Callout>` demo.

### C4 — 2025: 6 locale → vi-VN + en-US (giữ Lingui tạm) (~1h)

lingui.config locales 2; xóa 4 thư mục catalog; locale-switch bỏ 4 option; extract+compile.
**Gate:** build 2025; grep `ja-JP|ko-KR|zh-` = 0; chỉ còn /vi-VN + /en-US.

### C5 — 2025: bỏ Contentlayer2 (BLOCKER #1) (~4-6h)

1. next.config bỏ withContentlayer, thêm @portfolio/content+mdx vào transpilePackages.
2. `src/utils/content.ts` **giữ nguyên signature** allCoreContent/sortPosts (nguồn mới) — templates gần như không sửa; đổi ~10 file import `contentlayer/generated`.
3. XÓA layout-renderer.tsx (`new Function`) → blog page render `<MDXContent source>` truyền children vào 3 template post-* (vốn chỉ nhận children).
4. Side-effects: script mới sinh tag-data.json + search.json (prebuild); rss.ts viết lại đọc @portfolio/content (giữ output feed.xml + tags/*/feed.xml); sync assets như 2026.
5. XÓA: contentlayer.config.ts, data/blog, data/authors, deps contentlayer2 + toàn bộ remark/rehype (đã sang mdx pkg); turbo.json bỏ .contentlayer; allowBuilds bỏ contentlayer2; CLAUDE.md bỏ ghi chú PowerShell.
   **Gate:** **build từ Git Bash phải chạy** (hết bug PWD); build cả 2; smoke :3001 blog (highlight+KaTeX+TOC+reading time), tags, Cmd+K, feed.xml; giữ nguyên slug/URL bài viết.

### C6 — 2025: Lingui → next-intl + data chung (BLOCKER #2) (~5-7h)

1. Script convert 2 catalog .po → messages/{vi,en}.json (namespaced theo mẫu 2026).
2. Setup y hệt 2026: i18n/{routing,request,navigation}.ts (`['vi','en']`, as-needed, vi không prefix), createMiddleware; **git mv `[lang]` → `[locale]`**; Link/router → @/i18n/navigation.
3. Port 94 macro/21 file: t/msg → useTranslations/getTranslations; Trans → t()/t.rich(); useLingui runtime (contact-form, project-card, locale-switch) → useTranslations.
4. Import SKILLS/COMPANIES/PROJECTS + site-metadata từ @portfolio/content; **XÓA data/main.ts**.
5. Redirects permanent: `/vi-VN/:path*`→`/:path*`, `/en-US/:path*`→`/en/:path*`.
6. Gỡ 7 gói @lingui/* + negotiator + lingui.config + locales/ + swcPlugins + rule .po.
   **Gate:** grep `@lingui` = 0; build cả 2; smoke vi (không prefix) + /en/*, không lộ key, contact modal (@modal parallel route) sống, redirect chạy. Rủi ro: giscus thread cũ tách theo URL mới → chấp nhận hoặc mapping specific.

### C7 — 2025: Next 16.2.10 + React 19.2.7 + dep sweep (~2-4h)

next/react khóa cùng version 2026 (KHÔNG canary); middleware.ts → proxy.ts; `npx @next/codemod@latest upgrade`; **bỏ svgr** (chỉ grid-background.tsx dùng — inline SVG thành TSX), bỏ @next/bundle-analyzer, bỏ next lint (dựa typecheck như 2026); sweep: dayjs, swr, drizzle*, react-hook-form, @hookform/resolvers@5, **zod@4** (nếu vướng resolvers/env → tách commit hoặc zod/v4 compat), octokit, giscus, react-share, react-medium-image-zoom, react-github-calendar, kbar, next-themes, t3-env, tailwindcss@4.3.x + họ hàng + tw-animate-css, lucide (1 version cả repo), @types/node@24, typescript; 2026 patch next-intl@4.13.2.
**Gate:** build Turbopack cả 2 + typecheck; CSP headers còn áp; **đợi 2 deploy Vercel xanh** mới đóng phase.

### C8 — UI hợp nhất: full Base UI, 2025 bỏ Radix (~5-7h, 2 commit)

**8a:** shadcn add avatar dialog dropdown-menu hover-card input label popover scroll-area select tabs textarea toggle toggle-group tooltip form pagination (+ port drawer/vaul recipe vào ui); rà `--diff` với 12 atoms data-slot của 2025 giữ custom.
**8b:** xóa atoms shadcn-derived trong 2025; **atoms/index.ts thành shim re-export từ @portfolio/ui** (organisms/templates giữ import `@/components/atoms` — churn tối thiểu); convert 15 chỗ asChild → `render={...}`; grep `data-[state=` → attr Base UI (`data-[open]`...); gỡ 14 gói @radix-ui + vaul + cva/clsx/tailwind-merge khỏi 2025. Atoms ở lại app: logo, grid-background, video-card, views-counter, authors, social-icons, toc, search-articles, image, container, blur, boxes, grit-background, navigation-link, discuss-on-x, edit-on-github.
**Gate:** grep `@radix-ui` = 0 trong 2025; build+typecheck cả 2; smoke TỪNG overlay: contact modal, select/dropdown (setting/locale-switch), tabs, tooltip, drawer mobile, form aria-invalid. Chỗ dễ vỡ nhất: select/dropdown.

### C9 — motion → GSAP (~4-6h)

gsap@3.15 + @gsap/react vào packages/ui; port vào `ui/src/motion/` theo bảng:

| File                               | Port sang                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| floating-dock (khó nhất, làm CUỐI) | `gsap.quickTo()` width/height + mapRange trong pointermove; nav indicator: đo rect đích + `gsap.to({x,width})` (không cần Flip); tooltip CSS; whileTap → `:active` |
| link-preview                       | quickTo(x,y) theo pointer; enter/exit fromTo + state closing + onComplete unmount                                                                                  |
| timeline                           | 1 tween scaleY 0→1 transformOrigin top + ScrollTrigger scrub                                                                                                       |
| parallax-scroll                    | ScrollTrigger scrub, yPercent khác dấu 3 cột                                                                                                                       |
| hover-effect                       | 1 div highlight, gsap.to theo rect card hover (Flip = dự phòng)                                                                                                    |
| animated-content                   | useGSAP + gsap.from + ScrollTrigger once (xóa IO thủ công)                                                                                                         |
| theme-switch                       | CSS thuần (ở lại app)                                                                                                                                              |
| grid-view/list-view                | CSS fade-in, bỏ exit animation (ở lại app)                                                                                                                         |

Giữ framer-motion trong deps đến khi CẢ 8 xong → gỡ framer-motion + motion + @emotion/is-prop-valid 1 lần.
**Gate:** grep framer-motion = 0; build cả 2; **user nghiệm thu bằng mắt** (dock magnify, photos parallax, timeline beam, hover highlight); test chuyển trang nhiều lần (ScrollTrigger cleanup — useGSAP lo).

### C10 — React Compiler cả 2 app (~1-2h)

`reactCompiler: true` + babel-plugin-react-compiler mỗi app; eslint flat root với eslint-plugin-react-hooks@latest (rules compiler đã merge). KHÔNG gỡ useMemo/useCallback thủ công trong phase này.
**Gate:** build cả 2 (compile chậm hơn — chấp nhận); smoke kbar, dock GSAP, contact-form, theme switch. Component lỗi → `"use no memo"` cục bộ.

### C11 — Sandpack + block còn lại của react.dev (~3-4h)

packages/mdx: sandpack.tsx (`"use client"` + next/dynamic ssr:false + `initMode:'user-visible'` rootMargin 1400px, createFileMap từ code fence con — pattern react.dev); Terminal/Console/Diagram nếu chưa vào C3; 1 bài blog demo playground. Pin @codesandbox/sandpack-react@2.20 (cadence chậm — không dựa API mới). KHÔNG port: compileMDX tự chế, CodeMirror highlight, DocSearch, satori OG.
**Gate:** build cả 2; demo chạy trên :3000 + :3001; verify chunk Sandpack chỉ tải ở trang dùng (Network tab).

### C12 — CI + dọn dẹp + hậu kỳ (~2-3h)

Root scripts/check-dead-links.mjs (crawl build local 2 app — ý tưởng react.dev); `ci-check` = prettier --check + turbo typecheck + build + dead-link; dọn: xóa fade-content.tsx (mồ côi), bản trùng back-to-posts.tsx, hooks/utils mồ côi; cập nhật CLAUDE.md (kiến trúc 3 package, bỏ ghi chú PowerShell/contentlayer) + đánh dấu PLAN-apps-2025.md superseded; **hậu kỳ .design-sync**: re-sync cấu trúc mới, xóa shim lingui/env đã thừa.
**Gate:** `pnpm ci-check` xanh; 2 deploy Vercel xanh; đi tay 1 vòng cả 2 site.

## Tổng dependency (tóm tắt)

- **apps/2025 XÓA 31+ gói** (contentlayer2×2, @lingui×7, radix×14, framer-motion/motion, svgr, bundle-analyzer, toàn bộ remark/rehype→mdx pkg, negotiator...).
- **packages/ui**: @base-ui-components/react, cva, clsx, tailwind-merge, lucide, vaul, react-hook-form, gsap, @gsap/react (peer react 19).
- **packages/mdx**: next-mdx-remote@6, remark-{gfm,math,smartypants,github-blockquote-alert}, rehype-{slug,autolink-headings,katex,pretty-code}, katex, probe-image-size, sandpack-react@2.20...
- **packages/content**: + zod@4, reading-time, github-slugger.
- **Root**: prettier, prettier-plugin-tailwindcss, husky, lint-staged, eslint + eslint-plugin-react-hooks.

## Verification tổng thể

- Mỗi phase: `pnpm typecheck` + `pnpm build` (cả 2 app từ C5 trở đi chạy được cả Git Bash) + smoke cụ thể theo gate của phase.
- Phase chạm UI/animation (C8, C9): user nghiệm thu bằng mắt trước khi commit đóng phase.
- Push main mỗi phase → xác nhận 2 deploy Vercel xanh (get_deployment/logs như quy trình cũ).
- Kết thúc: `pnpm ci-check` root, đi tay cả 2 site, re-sync design-sync.

## Rủi ro xuyên suốt

| Rủi ro                               | Phòng bị                                              |
| ------------------------------------ | ----------------------------------------------------- |
| Phase nặng (C5/C6/C8) kẹt giữa chừng | Mỗi phase 1 branch, merge main khi gate xanh          |
| Trùng lặp content C2→C5/C6           | apps/2025/data read-only từ C2, xóa dứt điểm C5/C6    |
| Base UI khác hành vi Radix           | smoke từng overlay 8b; --diff/--dry-run trước khi ghi |
| GSAP khác cảm giác spring            | port từng file, giữ framer đến cuối, user duyệt mắt   |
| URL 2025 đổi                         | redirect permanent; giscus chấp nhận tách thread      |
| zod@4 đụng resolvers/env             | tách commit riêng hoặc zod/v4 compat path             |
