# Portfolio Monorepo

Monorepo chứa các version portfolio theo thời gian. Mỗi version là một app trong `apps/`, nội dung (bio, projects, resume, blog, ảnh) dùng chung nằm trong `packages/content` — làm lại giao diện không phải nhập lại data.

## Cấu trúc

```
portfolio/
├── apps/
│   └── 2026/              # Version 2026 — Next.js 16 + Tailwind v4, song ngữ vi/en
├── packages/
│   └── content/           # Nội dung dùng chung giữa mọi version
│       ├── src/           # profile, projects, resume, gallery (TypeScript, song ngữ)
│       ├── blog/          # Bài viết MDX: <slug>.<locale>.mdx
│       └── assets/        # Ảnh (gallery...) — tự động sync vào public/ của app
├── pnpm-workspace.yaml
└── turbo.json
```

## Chạy dự án

Yêu cầu: Node >= 20, pnpm >= 9 (`npm install -g pnpm` hoặc `corepack enable`).

```bash
pnpm install
pnpm dev          # chạy tất cả apps
pnpm dev:2026     # chỉ chạy version 2026 → http://localhost:3000
pnpm build        # build tất cả (Turborepo chỉ build app có thay đổi)
```

## Cập nhật nội dung

| Muốn sửa | Sửa ở đâu |
|---|---|
| Tên, chức danh, bio, social links | `packages/content/src/profile.ts` |
| Projects | `packages/content/src/projects.ts` |
| Resume (kinh nghiệm, học vấn, skills) | `packages/content/src/resume.ts` |
| Ảnh gallery | Thêm ảnh vào `packages/content/assets/gallery/` + khai báo trong `packages/content/src/gallery.ts` |
| Viết blog | Tạo `packages/content/blog/<slug>.vi.mdx` và `<slug>.en.mdx` |
| File resume PDF | Đặt `resume.pdf` vào `apps/2026/public/` |

Mọi text đều song ngữ dạng `{ vi: "...", en: "..." }`. URL tiếng Việt không có prefix, tiếng Anh có `/en`.

## Thêm version mới (ví dụ 2027)

1. Tạo `apps/2027` (stack tùy ý — Next, Astro...)
2. Thêm dependency `"@portfolio/content": "workspace:*"` để dùng lại toàn bộ nội dung
3. Version cũ vẫn giữ nguyên trong `apps/2026`, deploy song song (ví dụ `2026.your-domain.com`)

## Deploy (Vercel)

Mỗi app tạo 1 Vercel project, đặt **Root Directory** = `apps/2026`. Vercel tự nhận diện Turborepo và chỉ build khi app đó (hoặc `packages/content`) thay đổi.
