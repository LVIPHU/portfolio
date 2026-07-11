---
phase: C03-mdx-package
plan: 03
subsystem: mdx
tags: [2026-adoption, tailwind-source, katex]
provides:
  - 2026 render blog qua <MDXContent> của @portfolio/mdx (bỏ MDXRemote inline không pipeline)
  - globals.css += @source packages/mdx/src + @import '@portfolio/mdx/styles.css'
  - katex CSS chỉ import ở route blog [slug] (D-08)
  - Demo <Callout pitfall + deep-dive> trong portfolio-monorepo.{vi,en}.mdx (fixture SC2)
key-files:
  modified:
    - apps/2026/next.config.ts (transpilePackages += @portfolio/mdx)
    - apps/2026/src/app/[locale]/blog/[slug]/page.tsx (MDXContent + katex css)
    - apps/2026/src/app/globals.css
    - apps/2026/package.json (+@portfolio/mdx workspace, +katex)
    - packages/content/blog/portfolio-monorepo.{vi,en}.mdx (demo Callout)
    - packages/mdx/src/styles.css (fix: bỏ underline prose trên <a> autolink)
key-decisions:
  - 'katex thêm vào deps 2026 (CSS import per-route cần resolve từ app; pnpm dedupe cùng bản với packages/mdx).'
  - 'BUG BẮT KHI TỰ TEST: prose underline của typography kẻ gạch dưới <a> autolink (icon trong suốt) → vệt "_" trước heading; vá trong styles.css package (.content-header > a:first-child).'
  - 'Callout label mặc định tiếng Việt kể cả trên bài en — override được qua prop title (demo en đã dùng); i18n label là backlog.'
  - 'KaTeX: pipeline + CSS đã nối nhưng CHƯA bài nào có công thức — sẽ được exercise ở bài demo C11 hoặc bài toán học tương lai.'
  - 'Console error "script tag while rendering" có TỪ TRƯỚC trên mọi trang (script init next-themes, dev-only React 19.2) — không phải regression C3, ghi nợ theo dõi.'
status: complete
completed: 2026-07-11
---

# C03-03: 2026 adoption + tự test browser — Summary

**SC phase C3 verify bằng browser thật (user ủy quyền tự test):**

1. ✅ Bài Promise.all: CodeTitle "promises.js" + badge lang, line numbers (showLineNumbers), dual-theme đổi live khi toggle dark (solarized-light ↔ github-dark-dimmed qua --shiki-light/dark).
2. ✅ Copy button hiện khi hover, click → icon Check + data-copied=true (reset 2s).
3. ✅ Callout: pitfall (aside, icon TriangleAlert, tint destructive) + deep-dive (details/summary 0 JS, mở/đóng được, title override).
4. ✅ Anchor heading: <a href="#id"> prepend + icon hover; id đúng slug; fix vệt underline.
5. ✅ Smartypants: "I'll" ra apostrophe cong trong bài en.
6. ✅ Build 60/60 trang SSG + typecheck root xanh.
