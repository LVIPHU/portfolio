---
phase: C06-2025-next-intl
plan: 03
type: execute
wave: 3
depends_on: [C06-02]
files_modified:
  - apps/2025/src/components/organisms/{navbar,experience,technologies,github-cal}.tsx
  - apps/2025/src/components/organisms/search/kbar-modal.tsx
  - apps/2025/src/components/molecules/{setting,locale-switch,contact-form,previous-page,project-card}.tsx
  - apps/2025/src/components/atoms/timeline.tsx
  - apps/2025/src/components/organisms/footer.tsx
  - apps/2025/src/app/robots.ts
  - apps/2025/src/app/sitemap.ts
  - apps/2025/scripts/rss.ts
  - apps/2025/src/providers/index.tsx
  - apps/2025/data/ # XÓA main.ts + site-metadata.ts
  - apps/2025/tsconfig.json # gỡ alias @data/*
autonomous: true
requirements: [REQ-06, REQ-01, REQ-10]
must_haves:
  truths:
    - 'grep -rl "@lingui" apps/2025/src chỉ còn 3 file runtime (i18n.ts, initLingui.tsx, providers/locale.tsx) chờ plan 04 xóa'
    - 'Experience/Technologies/Projects render từ *_2025 của @portfolio/content đúng bản dịch theo locale'
    - 'apps/2025/data/ không còn tồn tại; grep @data/ = 0'
  artifacts:
    - 'locale-switch.tsx bản viết lại 2 locale dùng @/i18n/navigation'
  key_links:
    - 'sitemap.ts sinh URL scheme mới (/, /en/*) từ SITE_METADATA_2025 + routing.locales'
    - 'ProviderRegistry hết prop linguiLocale — khung chuyển tiếp M-09 đã gỡ'
---

<objective>
Port nốt nhóm 2 (organisms/molecules/atom có logic), chuyển data tĩnh sang `@portfolio/content` và XÓA `apps/2025/data/` (D-05), gỡ khung chuyển tiếp hai runtime (D-09). Sau plan này Lingui chỉ còn là hạ tầng chết chờ plan 04 nhổ.
</objective>

<context>
@docs/plans/phases/C06-2025-next-intl/C06-CONTEXT.md
@apps/2025/messages/msgid-map.json
@packages/content/src/index.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Port 11 component nhóm 2</name>
  <files>apps/2025/src/components/organisms/navbar.tsx, apps/2025/src/components/organisms/experience.tsx, apps/2025/src/components/organisms/technologies.tsx, apps/2025/src/components/organisms/github-cal.tsx, apps/2025/src/components/organisms/search/kbar-modal.tsx, apps/2025/src/components/molecules/setting.tsx, apps/2025/src/components/molecules/locale-switch.tsx, apps/2025/src/components/molecules/contact-form.tsx, apps/2025/src/components/molecules/previous-page.tsx, apps/2025/src/components/molecules/project-card.tsx, apps/2025/src/components/atoms/timeline.tsx</files>
  <action>Port theo M-08 (D-08): useTranslations/useLocale cho client components; i18n._(descriptor) runtime trong contact-form/project-card/locale-switch bỏ hẳn descriptor. Riêng: (a) locale-switch.tsx VIẾT LẠI theo D-10 — 2 option vi/en, router.replace(pathname, { locale }) từ @/i18n/navigation + useLocale(), vứt logic split pathname 6 locale; (b) contact-form: message validate của schema đi qua t — cách truyền (factory nhận t hay validate tại call site) thuộc Claude tự quyết, ghi lựa chọn vào SUMMARY; (c) kbar-modal: actions build từ messages + SITE_METADATA_2025.search.kbarConfigs nếu có; (d) timeline.tsx: useLingui → useLocale, switch i18n.locale → switch locale ('vi'|'en' — 2 case, không còn vi-VN).</action>
  <verify>grep -rl "@lingui" apps/2025/src/components | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>components/ sạch @lingui; switch locale giữ nguyên trang; form validate đúng ngôn ngữ.</done>
</task>

<task type="auto">
  <name>Task 2: Data chung *_2025 + xóa apps/2025/data</name>
  <files>apps/2025/src/components/organisms/{experience,technologies,footer}.tsx, apps/2025/src/components/templates/projects.tsx, apps/2025/src/components/molecules/project-card.tsx, apps/2025/src/app/robots.ts, apps/2025/src/app/sitemap.ts, apps/2025/src/app/[locale]/layout.tsx, apps/2025/scripts/rss.ts, apps/2025/data/, apps/2025/tsconfig.json</files>
  <action>Theo D-05: grep -rln "from '@data/" apps/2025/src apps/2025/scripts (hiện trạng 22 file — một phần đã được C5 xử phần blog/authors) — với từng file còn lại: import SKILLS_2025/EXPERIENCES_2025/PROJECTS_2025/SITE_METADATA_2025 từ @portfolio/content (export sẵn dòng 19-22 của index), render field[locale] với locale từ useLocale()/getLocale(). generateMetadata layout + robots.ts + sitemap.ts + RSS_CONFIG trong scripts/rss.ts trỏ SITE_METADATA_2025; sitemap sinh URL scheme mới (/, /en/*) — phòng bị SEO của D-05. Xong hết: XÓA apps/2025/data/main.ts + data/site-metadata.ts (thư mục data/ biến mất), gỡ alias @data/* khỏi tsconfig.json.</action>
  <verify>grep -rn "@data/" apps/2025/src apps/2025/scripts | wc -l = 0; test ! -d apps/2025/data && echo gone; pnpm build --filter=web-2025 thoát 0</verify>
  <done>data/ đã xóa; mọi data hiển thị đến từ @portfolio/content; sitemap URL mới.</done>
</task>

<task type="auto">
  <name>Task 3: Gỡ khung chuyển tiếp hai runtime</name>
  <files>apps/2025/src/providers/index.tsx, apps/2025/src/app/[locale]/layout.tsx</files>
  <action>Theo D-09 (khung M-09 gỡ ở plan 03 khi hết call site macro): ProviderRegistry bỏ prop linguiLocale, bỏ await initLingui + LocaleProvider bọc trong; layout bỏ biến linguiLocale. 3 file runtime (i18n/i18n.ts, initLingui.tsx, providers/locale.tsx) thành mồ côi — CHƯA xóa file (plan 04 xóa cùng cụm hạ tầng D-06) nhưng không còn ai import.</action>
  <verify>grep -rn "initLingui\|LocaleProvider\|linguiLocale" apps/2025/src --include="*.tsx" | grep -v "src/i18n/\|providers/locale" | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Runtime app chỉ còn next-intl; 3 file Lingui mồ côi xác nhận 0 importer.</done>
</task>

</tasks>

<verification>
Build xanh; dev :3001: đủ trang `/` + `/en/*` không lộ key; experience/projects đúng bản dịch; switch locale 2 chiều giữ trang; `grep -rl "@lingui" apps/2025/src | wc -l` = 3 (đúng 3 file mồ côi).
</verification>

<success_criteria>
100% call site đã port; data/ đã chết; app chạy thuần next-intl (hạ tầng Lingui chỉ còn xác).
</success_criteria>

<output>
Commit (branch c6-next-intl): `feat(2025): port remaining components, shared content data, drop apps/2025/data`
Sau khi xong: viết C06-03-SUMMARY.md.
</output>
