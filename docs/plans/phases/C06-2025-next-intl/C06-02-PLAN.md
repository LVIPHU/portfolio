---
phase: C06-2025-next-intl
plan: 02
type: execute
wave: 2
depends_on: [C06-01]
files_modified:
  - apps/2025/src/app/[locale]/(page)/about/page.tsx
  - apps/2025/src/app/[locale]/(page)/blog/page.tsx
  - apps/2025/src/app/[locale]/(page)/contact/page.tsx
  - apps/2025/src/app/[locale]/(page)/photos/page.tsx
  - apps/2025/src/app/[locale]/(page)/projects/page.tsx
  - apps/2025/src/app/[locale]/(page)/tags/page.tsx
  - apps/2025/src/app/[locale]/@modal/(.)contact/page.tsx
  - apps/2025/src/app/[locale]/layout.tsx
  - apps/2025/src/components/templates/*.tsx # 7 template
autonomous: true
requirements: [REQ-06]
must_haves:
  truths:
    - '8 file app + 7 template hết sạch import @lingui, chuỗi hiển thị qua useTranslations/getTranslations'
    - 'Build xanh; trang đã port hiển thị đúng cả vi lẫn /en'
  artifacts:
    - 'messages/{vi,en}.json có thể được bổ sung key mới phát sinh khi port (đối xứng vi/en)'
  key_links:
    - 'generateMetadata layout đọc messages qua getTranslations, không còn i18n._(msg`...`)'
---

<objective>
Port nhóm 1 theo trình tự D-09: 8 file app (layout + 6 page + @modal contact) và 7 template (`about, blog, contact, not-found, photos, projects, tag`) từ macro Lingui sang next-intl, tra key qua msgid-map.json.
</objective>

<context>
@docs/plans/phases/C06-2025-next-intl/C06-CONTEXT.md
@apps/2025/messages/msgid-map.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Port 8 file app router</name>
  <files>apps/2025/src/app/[locale]/layout.tsx, apps/2025/src/app/[locale]/(page)/{about,blog,contact,photos,projects,tags}/page.tsx, apps/2025/src/app/[locale]/@modal/(.)contact/page.tsx</files>
  <action>Port đúng bảng M-08 (theo D-08): page/server component dùng const t = await getTranslations('Ns'); mọi t`X`/msg`X` → t('key') với key tra từ msgid-map.json (msgid = X). generateMetadata layout bỏ i18n._(msg`...`) → getTranslations. <Trans> có rich text → t.rich với render prop từng tag. KHÔNG port file nào ngoài danh sách — organisms/molecules do các trang này import vẫn chạy qua bridge Lingui (D-09). Key thiếu trong messages (macro chưa từng extract) → thêm vào CẢ vi.json và en.json giữ đối xứng.</action>
  <verify>grep -l "@lingui" "apps/2025/src/app" -r | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Toàn bộ src/app hết @lingui; build xanh.</done>
</task>

<task type="auto">
  <name>Task 2: Port 7 template</name>
  <files>apps/2025/src/components/templates/about.tsx, apps/2025/src/components/templates/blog.tsx, apps/2025/src/components/templates/contact.tsx, apps/2025/src/components/templates/not-found.tsx, apps/2025/src/components/templates/photos.tsx, apps/2025/src/components/templates/projects.tsx, apps/2025/src/components/templates/tag.tsx</files>
  <action>Port theo M-08: template là client hay server tùy file — client dùng useTranslations('Ns'), server dùng getTranslations. useLingui() lấy locale (có trong 6 template — xem code_context) → useLocale() theo D-08. Chuỗi content (mô tả project, tên công ty) KHÔNG lấy từ messages — nếu template đang render từ @data/main.ts thì GIỮ NGUYÊN import @data ở plan này (data chung là việc plan 03, nằm trong phạm vi D-05); chỉ port chuỗi chrome UI. Link/router nội bộ trong các template này nếu đang import next/link|next/navigation → đổi sang @/i18n/navigation (locale-aware).</action>
  <verify>grep -l "@lingui" apps/2025/src/components/templates | wc -l = 0; pnpm build --filter=web-2025 thoát 0; grep -rn "from 'next/link'" apps/2025/src/components/templates | wc -l = 0</verify>
  <done>7 template sạch @lingui, điều hướng locale-aware, build xanh, trang hiển thị đúng 2 ngôn ngữ.</done>
</task>

</tasks>

<verification>
`grep -rl "@lingui" apps/2025/src | wc -l` giảm từ 29 xuống còn đúng 14 (5 organism + 5 molecule + 1 atom + 3 runtime — danh sách code_context); build + dev smoke nhanh /about, /en/about không lộ key thô.
</verification>

<success_criteria>
Nhóm app + template port xong, số file @lingui còn lại khớp dự kiến, không regression hiển thị.
</success_criteria>

<output>
Commit (branch c6-next-intl): `feat(2025): port app routes and templates from lingui macros to next-intl`
Sau khi xong: viết C06-02-SUMMARY.md.
</output>
