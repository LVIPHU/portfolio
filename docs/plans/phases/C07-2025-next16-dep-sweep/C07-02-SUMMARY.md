---
phase: C07-2025-next16-dep-sweep
plan: 02
subsystem: deps-2025
tags: [dep-sweep, zod4, lucide-brands]
provides:
  - Sweep 28 gói lên latest; gỡ 7 gói chết (cross-env, autoprefixer, postcss-import, mini-svg-data-uri, lodash.debounce+@types, eslint-config-next) + script deploy
  - use-window-size dùng useDebounceCallback từ @portfolio/ui (bản trùng trong app xóa)
  - 1 version duy nhất toàn repo: react 19.2.7, next 16.2.10, zod 4.4.3, tailwindcss 4.3.2, lucide 1.24.0
key-decisions:
  - 'BREAKING BẮT ĐƯỢC: lucide-react 1.x XÓA brand icons (Github/Facebook/Linkedin) — app đã có sẵn bộ SVG tự vẽ trong @/utils/icons → swap 5 file, không thêm dep; prop size → width/height (SVGProps).'
  - 'react-github-calendar 5.x: default export → named { GitHubCalendar }.'
  - 'zod 4.4.3 + @hookform/resolvers latest + t3-env latest: env.mjs typecheck sạch không sửa gì (điểm nóng D-08 tắt êm). drizzle 0.45/kit 0.31: defineConfig giữ nguyên shape.'
  - 'GIỮ nguyên chủ đích (D-13): framer-motion/motion/@emotion (C9), radix/vaul/cva/clsx/tailwind-merge (C8), qss (còn dùng).'
status: complete — PHASE C7 ĐÓNG
completed: 2026-07-12
---

# C07-02 — Summary (đóng phase C7)

## 3 Success Criteria (ROADMAP)

1. ✅ SC1: pnpm why từng gói -r — react/next/typescript/zod/tailwind/lucide mỗi gói đúng 1 bản resolve.
2. ✅ SC2: build Turbopack cả 2 xanh (2025: 1m02 full, compile 24s; 2026: 19s); curl -I: CSP + X-Frame + HSTS nguyên vẹn trên Next 16.
3. ✅ SC3: 2 deploy Vercel của merge `5718356` đều READY production (web-2025 `dpl_7EWH…`, web-2026 `dpl_f1BQ…` bundler turbopack); curl production: /blog/portfolio-monorepo=200, 2026 /blog=200, /vi-VN/about=308.

## Smoke

9 route × dev Next 16 đều 200; redirect legacy 308 sống; typecheck root 5.6s sạch. Nợ cũ: contact modal intercept vẫn cần desktop viewport (pane mobile) — chuyển hẳn sang checkpoint C8 (phase đụng Dialog trực tiếp).

## Bug deploy bắt được khi poll SC3 (fix ngay trong đợt đóng phase)

Các commit docs-only trước đây làm deploy **web-2026 ERROR** (`ENOENT public/content/blog/*.jpg` ở buildStep): FULL TURBO cache hit bỏ qua `prebuild` sync-content-assets, mà `public/content/**` không nằm trong `outputs` nên không được restore từ cache. Fix: tạo `apps/2026/turbo.json` (outputs + `public/content/**`), bổ sung `public/content/**` + `json/tag-data.json` vào outputs của `apps/2025/turbo.json`. Đã kiểm chứng bằng dry-run: sửa file blog trong packages/content ĐỔI hash turbo của app (nội dung không bao giờ bị cache cũ — chỉ thiếu outputs).
