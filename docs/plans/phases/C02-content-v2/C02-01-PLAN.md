---
phase: C02-content-v2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/content/src/skills2025.ts
  - packages/content/src/experience2025.ts
  - packages/content/src/projects2025.ts
  - packages/content/src/site-metadata2025.ts
  - packages/content/src/schema.ts # chỉ khi zod4 bắt đổi z.url()
  - packages/content/package.json
  - pnpm-lock.yaml
autonomous: true
requirements: [REQ-01, REQ-10]
must_haves:
  truths:
    - 'pnpm --filter @portfolio/content typecheck thoát 0 (hết lỗi 4 module thiếu)'
    - 'SKILLS_2025/EXPERIENCES_2025/PROJECTS_2025/SITE_METADATA_2025 import được từ @portfolio/content với field Localized {vi, en}'
  artifacts:
    - 'packages/content/src/{skills2025,experience2025,projects2025,site-metadata2025}.ts'
    - 'packages/content/package.json có zod@^4 + reading-time@^1.5'
  key_links:
    - 'Shape 4 export khớp chỗ tiêu thụ 2025 (technologies/experience/projects templates) để C6 chỉ đổi import'
---

<objective>
Gỡ trạng thái vỡ typecheck của packages/content: tạo 4 file data 2025 mà index.ts đã export sẵn (dịch MessageDescriptor→Localized từ catalog .po), bổ sung 2 dependency thiếu. Output: package typecheck xanh, hợp đồng data cho C6 chốt xong.
</objective>

<context>
@docs/plans/phases/C02-content-v2/C02-CONTEXT.md
@apps/2025/data/main.ts
@apps/2025/data/site-metadata.ts
@apps/2025/src/i18n/locales/vi-VN/messages.po
@apps/2025/src/components/organisms/technologies.tsx
@apps/2025/src/components/organisms/experience.tsx
@apps/2025/src/components/templates/projects.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Tạo 4 file data 2025 dịch từ .po</name>
  <files>packages/content/src/skills2025.ts, packages/content/src/experience2025.ts, packages/content/src/projects2025.ts, packages/content/src/site-metadata2025.ts</files>
  <action>Đọc apps/2025/data/main.ts (29 chuỗi msg) + site-metadata.ts (3 chuỗi msg), rồi ĐỌC TRƯỚC 3 file consumer trong context để chốt interface khớp shape theo D-06. Dịch máy móc theo D-05: mỗi msg`X` thành Localized với en = X (msgid nguyên văn), vi = msgstr tra trong vi-VN/messages.po; msgstr rỗng thì vi = X kèm comment TODO dịch trên dòng đó. Field không phải text (date range, logo path, url, imgSrc, builtWith, icon) giữ literal nguyên bản. Khuôn file theo mẫu M-01 trong CONTEXT; export đúng 4 tên SKILLS_2025, EXPERIENCES_2025, PROJECTS_2025, SITE_METADATA_2025 (hợp đồng index.ts đã khai — không sửa index.ts). Interface (Skill2025, Experience2025, Project2025, SiteMetadata2025) định nghĩa ngay trong từng file, export kèm để C6 dùng.</action>
  <verify>node -e "['skills2025','experience2025','projects2025','site-metadata2025'].forEach(f=>{if(!require('fs').existsSync('packages/content/src/'+f+'.ts'))throw f})" thoát 0; grep -rn "TODO dịch" packages/content/src --include="*2025.ts" | wc -l (ghi con số vào SUMMARY — kỳ vọng 0 vì catalog vi-VN đầy đủ)</verify>
  <done>4 file tồn tại, đủ 32 chuỗi dịch, field non-text giữ literal, interface khớp consumer 2025.</done>
</task>

<task type="auto">
  <name>Task 2: Bổ sung deps + chốt typecheck xanh</name>
  <files>packages/content/package.json, pnpm-lock.yaml, packages/content/src/schema.ts</files>
  <action>Thêm vào dependencies của packages/content: zod ^4 và reading-time ^1.5 (theo D-04 — zod 4 ngay bây giờ, C7 khỏi đụng). Chạy pnpm install ở root. Nếu typecheck báo z.string().url() deprecated/lỗi trong schema.ts thì đổi sang z.url() theo D-04; ngoài ra KHÔNG sửa gì khác trong schema.ts (file đã đúng thiết kế — xem code_context). Chạy pnpm --filter @portfolio/content typecheck tới xanh; lỗi phát sinh chỉ được sửa trong 4 file mới tạo hoặc schema.ts theo phạm vi trên.</action>
  <verify>pnpm --filter @portfolio/content typecheck thoát 0; node -p "Object.keys(require('./packages/content/package.json').dependencies).join(',')" chứa zod và reading-time</verify>
  <done>Typecheck package xanh; 2 deps có mặt trong package.json + lockfile.</done>
</task>

</tasks>

<verification>
1. `pnpm --filter @portfolio/content typecheck` thoát 0 — Success Criteria 1 của Phase C2.
2. `pnpm typecheck` root vẫn xanh các package khác (không phá gì ngoài phạm vi).
</verification>

<success_criteria>
packages/content hết trạng thái vỡ; 4 export *_2025 sẵn sàng cho C6; zod 4 là bản duy nhất package này dùng.
</success_criteria>

<output>
Commit: `feat(content): add 2025 static data translated to Localized + zod/reading-time deps`
Sau khi xong: viết C02-01-SUMMARY.md + cập nhật STATE.md (gỡ blocker "C2 dở dang") + tick ROADMAP.
</output>
