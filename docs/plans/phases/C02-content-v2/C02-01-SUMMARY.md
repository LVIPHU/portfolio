---
phase: C02-content-v2
plan: 01
subsystem: content
tags: [zod, localized, i18n-data]
provides:
  - SKILLS_2025 (32 skill, literal thuần — nguồn không có chuỗi dịch)
  - PROJECTS_2025 (5 project, description Localized)
  - EXPERIENCES_2025 (1 company PVS + 4 role, title/type/roleType/description Localized)
  - SITE_METADATA_2025 (title/headerTitle/description Localized; env đọc process.env trực tiếp)
  - deps zod@^4 + reading-time@^1.5 trong packages/content
affects: [C06-2025-next-intl]
key-files:
  created:
    - packages/content/src/skills2025.ts
    - packages/content/src/experience2025.ts
    - packages/content/src/projects2025.ts
    - packages/content/src/site-metadata2025.ts
  modified:
    - packages/content/package.json
key-decisions:
  - 'PHÁT HIỆN: catalog vi-VN KHÔNG chứa msgid nào của data/main.ts (Lingui chỉ extract src/) → production hiện tại cũng hiện tiếng Anh cho experience/projects ở locale vi. Theo D-05: vi = en + TODO dịch.'
  - 'Số TODO dịch: 11 (experience2025: 8, projects2025: 3) — plan kỳ vọng 0, thực tế 11; đây là nợ dịch thuật CÓ TỪ TRƯỚC, không phải regression.'
  - 'headerTitle vi = en KHÔNG đánh TODO (brand name, không phải thiếu dịch — Claude tự quyết được khai trong CONTEXT).'
  - 'site-metadata: field env (siteUrl, email, author, giscus) đọc process.env trực tiếp thay vì import @env của app — tránh vòng phụ thuộc package→app; giá trị resolve lúc app build.'
  - "Project.description kiểu Localized | undefined: 2 project description rỗng ('') chuyển thành bỏ field (undefined) — consumer render điều kiện, hành vi không đổi."
  - 'zod 4: z.string().url() trong schema.ts vẫn typecheck sạch (deprecated nhưng chưa removed) — KHÔNG sửa theo điều kiện D-04.'
status: complete
completed: 2026-07-11
---

# C02-01: Data 2025 → Localized — Summary

**Gỡ xong trạng thái vỡ typecheck của packages/content: 4 file data mà index.ts export đã tồn tại, dịch máy móc từ catalog .po theo D-05.**

## Verify đã chạy

- `pnpm --filter @portfolio/content typecheck` → **exit 0** (trước đó đỏ vì 4 module thiếu).
- `pnpm typecheck` root: content/ui/2025 xanh; web-2026 còn đúng 2 lỗi `description` không tồn tại trên Post/PostMeta ([slug]/page.tsx:23, post-card.tsx:22) — **đây là việc của C02-03 Task 1**, vỡ sẵn từ khi types.ts đổi ở phiên trước, không phải regression của plan này.
- Đếm TODO: 11 (bảng ở key-decisions).

## Next Phase Readiness

C02-02 (copy blog/authors/assets) chạy được ngay — không phụ thuộc plan này (wave 1 song song). C02-03 sẽ xử 2 lỗi typecheck 2026 còn lại.
