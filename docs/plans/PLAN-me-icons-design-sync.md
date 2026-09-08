# PLAN — `me` một nguồn · `@portfolio/icons` · animated lucide (GSAP) · bỏ entry design-sync

> Trạng thái: **chưa thực thi**. Tài liệu này là đặc tả đầy đủ để một agent khác (Cursor) thi công.
> Nguồn sự thật dữ liệu: `D:/Curriculum Vitae/domains/career/cv/luong-vi-phu.md`.
> Không bịa trường / job / con số không có trên CV.

## Mục lục

- [0. Bối cảnh](#0-bối-cảnh)
- [1. Phase 1 — `@portfolio/content`: object `me`](#1-phase-1--portfoliocontent-object-me)
- [2. Phase 2 — `packages/icons`](#2-phase-2--packagesicons)
- [3. Phase 3 — Trang import thẳng](#3-phase-3--trang-import-thẳng)
- [4. Phase 4 — Animated lucide → GSAP](#4-phase-4--animated-lucide--gsap)
- [5. Phase 5 — design-sync: bỏ file entry sinh ra](#5-phase-5--design-sync-bỏ-file-entry-sinh-ra)
- [6. Test](#6-test)
- [7. Verify](#7-verify)
- [8. Ranh giới / không được làm](#8-ranh-giới--không-được-làm)

---

## 0. Bối cảnh

Bốn vấn đề đang cùng tồn tại:

1. **Dữ liệu về Phú bị chẻ làm ba và phần lớn là placeholder.**
   `packages/content/src/profile.ts`, `resume.ts`, `projects.ts` vẫn là nội dung mẫu
   (`Company Name`, `Sample Project A`, `github.com/your-username`), trong khi dữ liệu thật rải ở
   `site-metadata2025.ts`, `experience2025.ts`, `projects2025.ts`, `skills2025.ts` — và cả ba nhóm
   đều **lệch CV** (còn ghi PVS Solution là công ty hiện tại, thiếu NEXSOFT, thiếu PTIT, avatar URL
   vỡ `?s…00`).
2. **Icon bị nhốt trong `apps/2025`.** 37 SVG + `iconsMap` nằm ở
   `apps/2025/src/components/atoms/icons/` và `atoms/social-icons.tsx`; `apps/2026` không dùng được.
   Một icon tên đúng bằng `React` gây shadow `React.createElement` trong bundle esbuild classic-JSX
   của design-sync, phải nuôi script vá `.design-sync/gen-icons-safe.mjs`.
3. **Icon lucide đang tĩnh.** 50 tên lucide-react riêng biệt trong 33 file.
4. **design-sync phải sinh file entry giả.** `cfg.pkg` trỏ vào hai Next app (`web-2025`/`web-2026`)
   — không phải package resolve được, không `exports`, không dist. Converter rơi xuống nhánh
   synth-from-src (`.ds-sync/lib/source-kit.mjs:72-78`) vốn `export *` cả cây và chết IIFE, nên đã
   chế ra `apps/*/.design-sync.entry.tsx` + 2 generator.

**Đối chiếu `D:\MI`** (project khác, `cfg.pkg = "@orbit/ui"`, **không có** field `entry`):
`resolveDistEntry` (`.ds-sync/lib/bundle.mjs:25-35`) tự giải entry từ `pkgJson.exports['.']` khi
`cfg.pkg` là package thật. `@portfolio/ui` đã đúng hình dạng đó (`exports: { ".": "./src/index.ts" }`),
chỉ thiếu field `types` — bẫy ghi ở `D:\MI\.design-sync\NOTES.md:19`: thiếu `types` thì ts-morph
không có entry → `exported PascalCase symbols: 0` → 0 component.

**Kết quả mong muốn:** một object `me` trong `@portfolio/content` khớp CV, dùng chung hai site;
mọi icon (brand/social/tech/lucide-animated) nằm trong `@portfolio/icons`; design-sync trỏ thẳng
`packages/ui/src/index.ts`, không còn file sinh ra trong `apps/`.

**Ngoại lệ đã chốt:** copy about/hobby của site 2025 (LoL, Wuthering Waves) giữ nguyên vì CV không
nói tới; link Facebook chỉ site cũ có nên giữ từ site cũ.

---

## 1. Phase 1 — `@portfolio/content`: object `me`

### 1.1 Kiểu — sửa `packages/content/src/types.ts`

Giữ `Localized = Record<Locale, string>` và `Locale` từ `@portfolio/i18n/locales`. Thêm/sửa:

```ts
export type SkillId = string // khớp key của ICONS trong @portfolio/icons

/** 9 heading trong mục Skills của CV — dùng CHUNG cho cả 2025 và 2026 */
export type SkillCategory =
  | 'languages'
  | 'frameworks'
  | 'state-data'
  | 'ui-styling'
  | 'performance'
  | 'accessibility'
  | 'testing'
  | 'ai-assisted'
  | 'tooling'

export interface Profile {
  name: string
  title: Localized // "Frontend Developer"
  tagline: Localized // rút từ Summary CV
  bio: Localized[] // [0] summary CV · [1] đang ở NEXSOFT · [2] hobby 2025
  email: string
  phone: string // "(+84) 528-307-775"
  phoneHref: string // "tel:+84528307775"
  location: Localized // "Bình Thới, TP. Hồ Chí Minh" / "Binh Thoi Ward, Ho Chi Minh City"
  avatar: string
  resumeUrl: string // https://rxresu.me/kenlock.lvp/luong-vi-phu
  company: { name: string; url: string } // NEXSOFT TECHNOLOGY · https://foundation.tb.ink
  socials: SocialLink[]
}

export interface SocialLink {
  id: SkillId
  label: string
  url: string
}

export interface Company {
  id: string
  name: string
  url?: string
  location: Localized
  role: Localized
  start: string
  end: string | null
  active: boolean
  products: Product[]
}

export interface Product {
  id: string
  name: string
  url?: string
  description: Localized
  role: Localized
  team?: Localized
  start: string
  end: string | null
  active: boolean
  stack: SkillId[]
  summary: Localized[]
  hidden?: boolean
}

export interface Education {
  id: string
  school: string
  degree: Localized
  field: Localized
  start: string
  end: string
}

export interface Skill {
  id: SkillId
  name: string
  category: SkillCategory
  level: 'beginner' | 'learning' | 'familiar' | 'proficient' | 'advanced' | 'expert'
  href?: string
  hidden?: boolean
  mostUsed?: boolean
}

export interface Project {
  slug: string
  name: string
  description: Localized
  type: 'work' | 'self'
  tech: SkillId[]
  year: number
  featured: boolean
  hidden?: boolean
  image?: string
  links: { demo?: string; source?: string }
}

export interface ResumeData {
  experience: Company[] // === me.experience
  education: Education[]
  skills: { id: SkillCategory; label: Localized; items: string[] }[]
}
```

Xoá `ExperienceItem`, `EducationItem` (kiểu cũ), `SkillGroup`.
Thêm hằng `SKILL_CATEGORIES: { id: SkillCategory; label: Localized }[]` (thứ tự y CV).

> **Quyết định 1 — category:** bỏ hẳn bộ 3 giá trị cũ
> `'Languages' | 'Web Dev' | 'DevOps & Tools'` của `skills2025.ts`. Cả tab kỹ năng của 2025 lẫn
> nhóm resume của 2026 đọc **cùng 9 category CV**.

### 1.2 Dữ liệu — file mới `packages/content/src/me.ts`

Không chạm `fs` (client-safe). Xuất:

```ts
export const me = { profile, education, experience, skills, projects }
```

`packages/content/src/index.ts` và `packages/content/src/data2025.ts` cùng re-export `me` và từng
mảnh (`profile`, `projects`, `featuredProjects`, `resume`, `SKILL_CATEGORIES`) để import cũ không gãy.

#### Profile

- `name: 'Lương Vĩ Phú'`, `title: 'Frontend Developer'` (vi = en).
- `tagline` + `bio[0]`: rút từ Summary CV — 4 năm production TypeScript, React/Next + Vue/Nuxt,
  LCP 4.1s→2.2s, JS 1.8MB→1.1MB, 7 feature/1 tháng.
- `bio[1]`: đang ở NEXSOFT TECHNOLOGY.
- `bio[2]`: hobby giữ nguyên từ copy 2025 (LoL, Wuthering Waves).
- `email: 'luongviphu0403@gmail.com'`, `phone: '(+84) 528-307-775'`, `phoneHref: 'tel:+84528307775'`.
- `location`: `{ vi: 'Phường Bình Thới, TP. Hồ Chí Minh', en: 'Binh Thoi Ward, Ho Chi Minh City' }`.
- `avatar: 'https://avatars.githubusercontent.com/u/84316006?s=400&u=2f5f6e6e02e5195fddbe9c1d73c387cc22151cc5&v=4'`
  — **sửa lỗi `?s…00`** đang có ở `site-metadata2025.ts:62` và `authors/default.mdx:3`.
- `resumeUrl: 'https://rxresu.me/kenlock.lvp/luong-vi-phu'`.
- `company: { name: 'NEXSOFT TECHNOLOGY', url: 'https://foundation.tb.ink' }`.
- `socials`: `github` → `https://github.com/LVIPHU`; `linkedin` →
  `https://www.linkedin.com/in/luong-vi-phu`; `facebook` → giá trị đang có ở `site-metadata2025.ts`.

#### Experience — 2 company, ngày dạng `YYYY-MM`

| Company                                                       | role                | start–end             | active | products                                                                                                                                                       |
| ------------------------------------------------------------- | ------------------- | --------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NEXSOFT TECHNOLOGY (`https://foundation.tb.ink`)              | Frontend Developer  | `2025-06` → `null`    | ✓      | TBchat (`https://im.tb.ink/`), TB Wallet (`https://wallet.tb.ink/`), TB Admin — cả 3 cùng `start: '2025-06'`, `end: null`, `active: true`                      |
| PVS SOFTWARE JOINT STOCK COMPANY (`https://pvssolution.com/`) | Mid-level Developer | `2022-09` → `2025-06` |        | Pinance (`https://app.pinance.vn/`, `end: '2025-06'`, **`active: false`**), Mobi 8 – Client (`start: '2022-09'` theo CV), Mobi 8 – Admin, Rainbow Kindergarten |

- Tên **"PVS Solution"** bỏ hẳn (đang ở `experience2025.ts` và `authors/default.mdx:5`).
- Ngày cũ trong `experience2025.ts` chỉ giữ khi nằm trong cửa sổ company tương ứng; ngoài cửa sổ
  thì lấy CV.
- `summary`: các gạch đầu dòng CV, **dịch tiếng Việt thật — không để `vi === en`**.
- `stack`: map từ dòng `Stack:` của mỗi product trên CV sang `SkillId`.

#### Education

Một mục: PTIT — `school: 'Posts and Telecommunications Institute of Technology (PTIT)'`,
`degree: { vi: "Cử nhân", en: "Bachelor's Degree" }`,
`field: { vi: 'Phát triển phần mềm', en: 'Software Development' }`, `start: '2018-08'`, `end: '2022-12'`.

#### Skills

Giữ toàn bộ 33 id đang có ở `packages/content/src/skills2025.ts`
(`javascript, typescript, react, vuejs, nextjs, tailwindcss, bootstrap, shadcn, antd, css, html,
prisma, python, nodejs, expressjs, nestjs, git, github, socketio, sql, nosql, mongodb, postgres,
mysql, postman, vercel, jira, vite, yarn, threejs, pnpm, framermotion, datadog`) để UI 2025 không
rụng, **bổ sung** từ CV: `nuxt, pinia, tanstack, zustand, zod, radix, gsap, playwright, vitest,
testinglibrary, storybook, nx, docker, redis, websocket, jwt, nitro, django, reactrouter,
reacthookform, scss, cursor, claudecode`, cùng các mục phi-icon của CV
(`lighthouse`, `wcag`, `aria`, `cicd` — `SkillIcon` trả `null`, không crash).
Mỗi skill gắn đúng **1** trong 9 `SkillCategory`.

#### Projects

| slug             | type | featured | hidden | demo                                     | nguồn                    |
| ---------------- | ---- | -------- | ------ | ---------------------------------------- | ------------------------ |
| `tbchat`         | work | ✓        |        | `https://im.tb.ink/`                     | CV NEXSOFT               |
| `tb-wallet`      | work | ✓        |        | `https://wallet.tb.ink/`                 | CV NEXSOFT               |
| `pinance`        | work | ✓        |        | `https://app.pinance.vn/`                | CV PVS                   |
| `portfolio-2026` | self | ✓        |        | `https://luongviphu.vercel.app/`         | repo này                 |
| `portfolio-2025` | self |          |        | `https://v1-luongviphu.vercel.app/about` | repo này, bản cũ         |
| `zerohomstay`    | self |          |        | `https://zerohomstay.vercel.app`         | mục **Projects** trên CV |
| `appchat`        | self |          |        |                                          | `projects2025.ts`        |
| `shopology`      | self |          |        |                                          | `projects2025.ts`        |
| `bac-ha`         | work |          | ✓      |                                          | `projects2025.ts`        |
| `hong-vi`        | work |          | ✓      |                                          | `projects2025.ts`        |

> **Quyết định 4 — tách portfolio:** `portfolio-monorepo` tách đôi; cả hai cùng
> `links.source: 'https://github.com/LVIPHU/portfolio'`. Bản 2026 `featured: true`, bản 2025
> `featured: false` (giữ đúng 4 featured).
> Đổi tên `packages/content/projects/portfolio-monorepo.en.mdx` → `portfolio-2026.en.mdx`
> và `.vi.mdx` tương ứng. Bản 2025 **không** viết MDX case study
> (`getProjectCase` trong `packages/content/src/projects-mdx.ts` đã có fallback).
> Bỏ `sample-project-a`, `sample-project-b`. Không viết case study dài cho project nào.

### 1.3 View dẫn xuất

- `packages/content/src/resume.ts` → chỉ còn dẫn xuất:
  `{ experience: me.experience, education: me.education, skills: <gom skill theo SKILL_CATEGORIES> }`.
  Không còn dữ liệu riêng.
- `packages/content/src/site-metadata2025.ts` → **chỉ giữ chrome**: `siteUrl`, `siteRepo`,
  `siteLogo`, `socialBanner`, `title`/`headerTitle`/`description`, `language`, `locale`, `theme`,
  `comments.giscusConfigs`, `search.kbarConfigs`. Mọi field danh tính (`email`, `phone`,
  `phoneHref`, `location`, `avatar`, `github`, `facebook`, `linkedIn`, `resume`, `author`)
  **derive từ `me.profile`**, không khai lại giá trị.
- `packages/content/src/data2025.ts` thành facade: re-export `me`, `skills`, `projects`,
  `SITE_METADATA_2025`, `SKILL_CATEGORIES`. Giữ tên `EXPERIENCES_2025` / `SKILLS_2025` /
  `PROJECTS_2025` như alias trỏ `me.*` **khi shape còn khớp**; chỗ lệch thì sửa consumer
  (danh sách §3.2) thay vì nuôi hai shape.
- `packages/content/authors/default.mdx`: `company` → `NEXSOFT TECHNOLOGY`,
  `occupation: Frontend Developer`, sửa `avatar` vỡ `?s…00` → `?s=400`.

---

## 2. Phase 2 — `packages/icons`

Package raw-TS mới, cùng khuôn `packages/ui`.

`packages/icons/package.json`:

- `"name": "@portfolio/icons"`, `"private": true`, `"type": "module"`, `"sideEffects": false`
- `"exports": { ".": "./src/index.ts", "./lucide": "./src/lucide/index.ts" }`
- **`"types": "./src/index.ts"`**
- `dependencies`: `@portfolio/utils` (workspace), `gsap`, `@gsap/react`, `lucide-react`
- `peerDependencies`: `react`, `react-dom`
- `devDependencies`: `@types/react`, `@types/react-dom`, `typescript`
- `scripts`: `{ "typecheck": "tsc --noEmit" }`

`packages/icons/tsconfig.json` kế `tsconfig.base.json`, `include: ["src"]`,
`exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"]`.

### 2.1 Brand / social / tech

- `src/brand.tsx`, `src/social.tsx`, `src/tech.tsx`: bê **nguyên văn** từ
  `apps/2025/src/components/atoms/icons/{brand,social,tech}.tsx` (chúng chỉ `import { SVGProps } from 'react'`,
  không phụ thuộc gì khác).
  **Một sửa duy nhất:** `export function React(` → `export function ReactIcon(` trong `tech.tsx`.
  **Không** giữ alias `export { ReactIcon as React }` — chính cái tên `React` là nguyên nhân của
  `.design-sync/gen-icons-safe.mjs`.
- **Bổ sung SVG mới lấy từ https://techicons.dev/** cho các id vừa thêm ở §1.2
  (`nuxt, pinia, tanstack, zustand, zod, radix, gsap, playwright, vitest, storybook, nx, docker,
redis, django, nitro, reactrouter, reacthookform, scss`) và cho `sql` / `nosql` (hai id này từ
  trước tới nay render `null`), cộng `sanity` / `stripe` (Zerohomstay trên CV) và map
  `facebook` / `linkedin` (component đã có trong `social.tsx`, `iconsMap` cũ thiếu — T1.4).
  Vendor vào `tech.tsx` theo đúng style hiện có:
  `export function X(svgProps: SVGProps<SVGSVGElement>) { return <svg {...svgProps}>…</svg> }`,
  dùng `currentColor` khi icon đơn sắc.
- `src/map.ts`: `export const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>>`
  — bê từ `iconsMap` trong `apps/2025/src/components/atoms/social-icons.tsx`, `react: ReactIcon`,
  giữ `gitfork`, `logodark`, `logolight`, thêm `facebook`, `linkedin`, `sanity`, `stripe`.
  Thêm `export type TypeOfIconsMap = keyof typeof ICONS`.
- `src/skill-icon.tsx`: `SkillIcon({ id, className })` — `ICONS[id]` không có thì `return null`.
- `src/social-icons.tsx`: chuyển `SocialIcons` vào package với 3 thay đổi:
  1. **Bỏ nhánh `iconType='button'`** — app runtime không dùng (chỉ `'icon'` và `'link'`).
     `.design-sync/previews/SocialIcons.tsx` còn story `button` — sửa preview sang `link`/`icon`
     ở Phase 5. Nhờ đó hết phụ thuộc `NavigationLink` và `Button` (`@portfolio/ui`).
  2. Nhánh `'link'` dùng `<a href target rel>` thuần — mọi href hiện tại đều là link ngoài nên
     không mất tính năng locale-aware.
  3. Sửa `h-${size} w-${size}` thành `style={{ width: size, height: size }}` (đơn vị **pixel**).
     Caller đang truyền unit Tailwind phải đổi: `size={4}` → `16`, `size={5}` → `20`, default
     `8` → `32`; `logo.tsx` `SIZE=96` giữ 96. Dời guard `if (!(kind in ICONS)) return null` lên
     **trước** khi tra map.
- `src/index.ts`: named export toàn bộ SVG + `ICONS` + `TypeOfIconsMap` + `SkillIcon` + `SocialIcons`.
  **Không dùng `export *`** (quy ước repo: `export *` qua ranh giới `'use client'` làm crash Turbopack).

**Xoá:** `apps/2025/src/components/atoms/icons/` (cả thư mục) và
`apps/2025/src/components/atoms/social-icons.tsx`.

### 2.2 Wiring

- Thêm `"@portfolio/icons": "workspace:*"` vào `apps/2025/package.json`, `apps/2026/package.json`,
  `packages/ui/package.json`, `packages/mdx/package.json`.
- Thêm `'@portfolio/icons'` vào `transpilePackages` trong `apps/2025/next.config.ts` và
  `apps/2026/next.config.ts`.
- Thêm `@source` cho package vào CSS của mỗi app nếu icon dùng class Tailwind
  (`apps/2026/src/app/globals.css`, tương ứng ở 2025).
- Ghi package mới vào `CLAUDE.md`, mục **Shared packages**.
- **Vitest:** project `packages` hiện chỉ `packages/*/src/**/*.test.ts` + `environment: 'node'`
  — không chạy được `icons.test.tsx` / `lucide.test.tsx`. Thêm project jsdom
  `packages/icons/src/**/*.test.tsx` (jsx automatic, giống `web-2025`).

---

## 3. Phase 3 — Trang import thẳng

### 3.1 Nguyên tắc

Hai việc khác nhau — đừng gộp:

1. **Đổi import (máy móc, mọi file):** gỡ hết re-export `@portfolio/ui` và `@portfolio/ui/motion`
   khỏi `apps/2025/src/components/atoms/index.ts`. Barrel chỉ còn atom riêng của app
   (`Authors`, `Blur`, `Boxes`, `Container`, `DiscussOnX`, `EditOnGithub`, `FadeContent`,
   `GridBackground`, `GritBackground`, `GrowingUnderline`, `Image`/`Zoom`, `LinkPreview`, `Logo`,
   `NavigationLink`, `SearchArticles`, `Timeline`*, `TableOfContents`, `VideoCard`, `ViewsCounter`,
   `PostViews`, `BlogStatsListProvider`) — không còn `SocialIcons`. Mọi file đang
   `from '@/components/atoms'` (~38) tách import `@portfolio/ui` / `@portfolio/ui/motion` /
   atom local. **Chỉ sửa dòng import**, không đụng JSX/logic (§8).
2. **Đổi nội dung (bảng §3.2):** data/icon/layout. Thêm `hover-effect.tsx` (key + type `Project`)
   và `messages/{vi,en}.json` `About.currentlyIAmWorking` (PVS → NEXSOFT) — plan gốc thiếu.

Trang tiêu thụ icon import **thẳng** `@portfolio/content`, `@portfolio/ui`, `@portfolio/icons`.

### 3.2 File `apps/2025` phải sửa

| File                                        | Sửa gì                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/utils/index.ts` (dòng 2)               | bỏ `export { Facebook, Github, Linkedin } from '@/components/atoms/icons'`                    |
| `src/components/molecules/contact-info.tsx` | icon từ `@portfolio/icons`; email/phone/location từ `me.profile`                              |
| `src/components/molecules/social-share.tsx` | icon từ `@portfolio/icons`                                                                    |
| `src/components/molecules/project-card.tsx` | `SkillIcon`/`SocialIcons` từ package; `Project` shape mới (`tech`, `links`, `type`, `hidden`) |
| `src/components/organisms/navbar.tsx`       | 10 icon lucide → `@portfolio/icons/lucide`; `resumeUrl` từ `me.profile`                       |
| `src/components/organisms/footer.tsx`       | icon từ package; social derive `me.profile.socials`                                           |
| `src/components/organisms/experience.tsx`   | render **Company → Product** theo shape mới                                                   |
| `src/components/organisms/technologies.tsx` | `me.skills` + `SkillIcon`; **tab đổi 3 → 9 category CV** (tab list cuộn ngang ở mobile)       |
| `src/components/organisms/search/*`         | icon lucide → package                                                                         |
| `src/components/atoms/logo.tsx`             | `LogoDark`/`LogoLight` từ `@portfolio/icons`                                                  |
| `src/components/templates/about.tsx`        | công ty hiện tại = `me.profile.company` (NEXSOFT); icon từ package                            |
| `src/components/templates/projects.tsx`     | shape `Project` mới, lọc `hidden`                                                             |

### 3.3 File `apps/2026` phải sửa

| File                                                                                                                                          | Sửa gì                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/[locale]/(main)/resume/page.tsx`                                                                                                     | `resume.experience` giờ là `Company[]` → render 2 tầng company → product; `education` dùng `degree` + `field`; phần Skills giữ nguyên (`{ label, items }`) |
| `src/app/[locale]/(main)/page.tsx` (dòng 30, 113)                                                                                             | `project.tech` là `SkillId[]` → dùng helper `skillNames(ids)` để hiển thị tên                                                                              |
| `src/app/[locale]/(showcase)/about/page.tsx` (dòng 27, 38)                                                                                    | như trên                                                                                                                                                   |
| `src/app/[locale]/(main)/projects/page.tsx`, `projects/[slug]/page.tsx`                                                                       | như trên                                                                                                                                                   |
| `src/components/chrome/site-footer.tsx`, `src/utils/seo.ts`, `src/app/manifest.ts`, `src/app/opengraph-image.tsx`, `src/app/api/og/route.tsx` | chỉ cần dữ liệu thật, không đổi code                                                                                                                       |
| 8 file dùng lucide (plan gốc ghi 7; code có thêm `(main)/page.tsx`)                                                                           | đổi sang `@portfolio/icons/lucide`                                                                                                                         |

Thêm helper `skillNames(ids: SkillId[]): string[]` vào `@portfolio/content`.

---

## 4. Phase 4 — Animated lucide → GSAP

> **Quyết định 5:** nguồn là registry shadcn của lucide-animated
> (`https://lucide-animated.com/r/<kebab-name>.json`, đọc field `files[].content`); icon nào không
> có thì lấy https://animateicons.in/icons/lucide. Cả hai đều dùng `motion/react` — **viết lại bằng
> GSAP**, không thêm `motion` vào dependency (repo đã có `gsap` + `@gsap/react` ở `packages/ui`).

### 4.1 Primitive dùng chung — `packages/icons/src/lucide/animated-icon.tsx`

- `'use client'`.
- `forwardRef` + `useImperativeHandle` phơi `{ startAnimation(): void; stopAnimation(): void }`
  — **giữ đúng API handle của lucide-animated** để chép variant sang 1-1.
- `useGSAP` (`@gsap/react`) tạo timeline `paused: true`; `onMouseEnter` → `play()`,
  `onMouseLeave` → `reverse()`. `onMouseEnter`/`onMouseLeave` do caller truyền **vẫn phải được gọi**.
- `gsap.matchMedia('(prefers-reduced-motion: reduce)')` → không chạy timeline, chỉ render tĩnh.
- Props: `size?: number` mặc định **24** (bằng lucide-react, **không** phải 28 của lucide-animated),
  `className`, spread `SVGProps<SVGSVGElement>`.

### 4.2 Mỗi icon một file `packages/icons/src/lucide/<kebab>.tsx`

Chứa path SVG + mô tả timeline. Barrel `packages/icons/src/lucide/index.ts` xuất **đúng tên
lucide-react** (`ArrowRight`, `ChevronDownIcon`, …) để 33 file consumer chỉ đổi module specifier.

### 4.3 Hai bẫy phải xử (ghi vào `packages/icons/README.md`)

1. **`pathLength`**: motion animate `pathLength` miễn phí; GSAP tương đương là `DrawSVGPlugin`
   — **plugin Club, không có trong repo**. Thay bằng cách chuẩn miễn phí: đọc
   `path.getTotalLength()` trong `useGSAP` rồi tween `strokeDasharray` / `strokeDashoffset`.
2. **Ease**: motion `[0.4, 0, 0.2, 1]` → `power2.inOut`; spring → `back.out(1.4)`.
   Ghi bảng quy đổi vào README. (Design system 2026 yêu cầu dùng token ease, nhưng các icon này là
   chrome dùng chung hai app nên dùng bảng quy đổi của package, không đọc token của app.)

### 4.4 Phạm vi thay — 50 tên lucide trong 33 file

```
ArrowLeft, ArrowRight, Book, Check, CheckIcon, ChevronDownIcon, ChevronLeft, ChevronLeftIcon,
ChevronRight, ChevronRightIcon, ChevronUpIcon, ChevronsUp, Clock, CloudSun, Command, Construction,
Copy, Dot, Download, Eye, FileUser, FolderGit, GalleryHorizontal, GitFork, House, Info, Layers,
LayoutGrid, Link, List, Mail, MailIcon, MapPinIcon, MessageSquareText, MonitorCog, Moon,
MoreHorizontalIcon, MoveLeft, PanelBottomClose, PanelBottomOpen, Paperclip, PhoneIcon, Search,
Share2, Signature, Sun, Tags, TriangleAlert, User, XIcon
```

Phân bố: `apps/2025` 18 file · `apps/2026` 7 file · `packages/ui` 4 file
(`src/components/select.tsx`, `dropdown-menu.tsx`, `pagination.tsx`, `dialog.tsx`) ·
`packages/mdx` 2 file.

Sau khi thay, `lucide-react` chỉ còn là dependency của `@portfolio/icons` (dự phòng cho glyph chưa
có bản animated); **gỡ khỏi** `apps/2025/package.json`, `apps/2026/package.json`,
`packages/ui/package.json`, `packages/mdx/package.json`.

> **Giả định nêu rõ:** 4 file trong `packages/ui` là indicator bên trong primitive Base UI
> (chevron của Select/DropdownMenu, dấu check, nút X của Dialog, mũi tên Pagination). Thay bằng bản
> animated nhưng giữ nguyên kích thước và `aria-hidden`. Nếu animation gây nhiễu trong menu đang
> mở, xử ở bước Verify (§7).

---

## 5. Phase 5 — design-sync: bỏ file entry sinh ra

### 5.1 Điều kiện tiên quyết

Thêm `"types": "./src/index.ts"` vào `packages/ui/package.json`.
`projectFor` (`.ds-sync/lib/dts.mjs:90`) đọc `pj.types || pj.typings || 'index.d.ts'`; thiếu nó →
ts-morph không có entry → 0 component.

### 5.2 Cấu hình mới — `.design-sync/config.json` và `.design-sync/config.2026.json`

- `"pkg": "@portfolio/ui"` (thay `web-2025` / `web-2026`). `globalName` giữ khác nhau
  (`Web2025UI` / `Web2026UI`).
  Đổi `pkg` cũng chính là thứ khiến preview `import … from '@portfolio/ui'` được shim về
  `window.<globalName>` — `pkgRx` dựng từ `PKG` (`.ds-sync/lib/story-imports.mjs:136`).
- `"entry": "packages/ui/src/index.ts"` — **giữ field này** (dù `D:\MI` không cần) để `PKG_DIR`
  là thư mục thật `packages/ui` thay vì symlink `node_modules/@portfolio/ui`; mọi `../../…` trong
  config nhờ đó đếm ổn định 2 cấp lên gốc repo.
- `"extraEntries"`:
  - `"@portfolio/icons"` — bare specifier ⇒ vào `pkgRx` ⇒ preview import được.
  - `"../../.design-sync/shims/app-2025.tsx"` (config 2025) /
    `"../../.design-sync/shims/app-2026.tsx"` (config 2026) — **file viết tay, có commit**, không
    sinh ra, không nằm trong `apps/`. Đường dẫn `../` đi qua kiểm tra containment
    `cfgPath(…, workspaceRoot)` (`.ds-sync/package-build.mjs:332-337`).
- `"cssEntry": ".ds-css/css2025.css"` / `".ds-css/css2026.css"` — nay resolve về
  `packages/ui/.ds-css/` (cssEntry bị chặn cứng trong `PKG_DIR`,
  `.ds-sync/package-build.mjs:282-292`).
- `"buildCmd"`: bỏ `gen-entry*.mjs` và `gen-icons-safe.mjs`, chỉ còn
  `node .design-sync/refresh-css.mjs` / `node .design-sync/refresh-css-2026.mjs`.
- `componentSrcMap`, `dtsPropsFor`, `readmeHeader` — rebase gốc từ `apps/<year>` sang `packages/ui`:
  - `../../packages/ui/src/components/x.tsx` → `src/components/x.tsx`
  - `src/components/effects/x.tsx` → `../../apps/2026/src/components/effects/x.tsx`
  - `.design-sync/conventions.md` → `../../.design-sync/conventions.md`
- config 2026 thêm `"guidelinesGlob": ["../../apps/2026/docs/*.md"]` — glob mặc định tính theo
  `PKG_DIR`; không đổi thì mất `apps/2026/docs/design-system.md` khỏi bundle.
- `"provider": { "component": "DsTheme2026" }` giữ nguyên; `DsTheme2026` do `app-2026.tsx`
  re-export nên vẫn là bundle export — thiếu là fail cứng `[PROVIDER_UNEXPORTED]`
  (`.ds-sync/package-build.mjs:644`).

### 5.3 Hai shim mới (viết tay, commit)

- `.design-sync/shims/app-2025.tsx` — re-export ~63 component app 2025 (đúng danh sách
  `.design-sync/gen-entry.mjs` đang sinh, trừ `SKIP_FILES` = `molecules/back-to-posts.tsx`,
  `atoms/social-icons.tsx`) + `export * from '@portfolio/icons'`.
- `.design-sync/shims/app-2026.tsx` — 4 export app
  (`brand/felix-mark`, `effects/list-item`, `effects/marquee`, `effects/appear-title`)
  - `export { Card as ShowcaseCard } from '../../apps/2026/src/components/effects/card'`
    (**alias bắt buộc**: `export *` sẽ đụng `Card` của `@portfolio/ui`, ESM biến star export nhập
    nhằng thành `undefined` → hỏng cả hai)
  - `export { DsTheme2026 } from './ds-provider-2026'`.

### 5.4 Xoá / sửa kèm

- **Xoá**: `.design-sync/gen-entry.mjs`, `.design-sync/gen-entry-2026.mjs`,
  `.design-sync/gen-icons-safe.mjs`, và hai file sinh ra
  `apps/2025/.design-sync.entry.tsx`, `apps/2026/.design-sync.entry.tsx`.
- `.design-sync/refresh-css.mjs` / `refresh-css-2026.mjs`: đích ghi đổi sang `packages/ui/.ds-css/`.
  (`refresh-css.mjs` còn comment đầu file sai — nó ghi `apps/2025/.ds-css/` chứ không phải
  `.design-sync/.cache/`; sửa luôn comment.)
- `.design-sync/tsconfig.dsync.json`: `@/components/atoms` trỏ thẳng barrel thật của app
  (bỏ `.cache/atoms-barrel-safe.ts`); `.design-sync/shims/utils-barrel.ts` bỏ dòng
  `export * from '../.cache/icons-safe'`.
- `.design-sync/tsconfig.dsync.2026.json`: xoá hai mapping `"web-2025"` và `"web-2026"` (dòng 16-17).
- `.design-sync/previews/*.tsx` (63 file): `from 'web-2025'` → `from '@portfolio/ui'`;
  preview nào dùng icon → `from '@portfolio/icons'`.
- `.gitignore` dòng 23 và 25: xoá 2 dòng entry; thêm `packages/ui/.ds-css/`.
- `.prettierignore` dòng 17: xoá dòng entry 2025.
- `.design-sync/NOTES.md` + `.design-sync/NOTES-2026.md`: ghi **vì sao không còn entry sinh ra**,
  `PKG_DIR` nay là `packages/ui`, `cssEntry` nằm đâu, và hai shim là thứ phải sửa tay khi thêm
  component (giống `componentSrcMap` vốn đã phải sửa tay).

---

## 6. Test

Thêm vào bộ vitest hiện có (`vitest.config.mts` ở gốc, đang có 7 file test, môi trường node/jsdom).

### T1 — `packages/content/src/me.test.ts` (node)

| #     | Case                                                                                                                                                | Kỳ vọng |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| T1.1  | `me.skills` id unique, khớp `/^[a-z0-9.+-]+$/`                                                                                                      | pass    |
| T1.2  | mọi `projects[].tech[]` tồn tại trong `me.skills`                                                                                                   | pass    |
| T1.3  | mọi `experience[].products[].stack[]` tồn tại trong `me.skills`                                                                                     | pass    |
| T1.4  | mọi `profile.socials[].id` tra được trong `me.skills` **hoặc** `ICONS`                                                                              | pass    |
| T1.5  | mỗi company `start <= end` (hoặc `end === null` khi `active`); mỗi product window ⊆ company window                                                  | pass    |
| T1.6  | đúng **một** company `active`, và đó là NEXSOFT; `pinance.active === false` và `end === '2025-06'`                                                  | pass    |
| T1.7  | education = PTIT, `start === '2018-08'`, `end === '2022-12'`                                                                                        | pass    |
| T1.8  | `JSON.stringify(me)` không chứa `your-username`, `Sample Project`, `Company Name`, `example.com`, `Tên trường`, `PVS Solution`, ký tự `…`           | pass    |
| T1.9  | mọi `Localized` có `vi` và `en` non-empty; `vi !== en` trừ whitelist danh từ riêng                                                                  | pass    |
| T1.10 | `profile.phoneHref === 'tel:+' + profile.phone.replace(/\D/g, '')` (khớp `tel:+84528307775`); `new URL(profile.avatar)` không ném và không chứa `…` | pass    |
| T1.11 | mọi `skills[].category` thuộc 9 giá trị `SkillCategory`; mỗi category có ≥1 skill                                                                   | pass    |
| T1.12 | có đúng 2 slug `portfolio-2026` / `portfolio-2025`, demo đúng 2 URL, cùng `links.source`                                                            | pass    |
| T1.13 | slug project unique; `featuredProjects.length === 4`                                                                                                | pass    |

### T2 — `packages/content/src/resume.test.ts` (node)

| #    | Case                                                                                                                                   | Kỳ vọng |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| T2.1 | `resume.experience === me.experience` (dẫn xuất, không sao chép)                                                                       | pass    |
| T2.2 | `resume.skills` có đúng 9 nhóm, thứ tự khớp `SKILL_CATEGORIES`                                                                         | pass    |
| T2.3 | hợp của mọi `resume.skills[].items` === tên các skill **không** `hidden`                                                               | pass    |
| T2.4 | `SITE_METADATA_2025.email/phone/phoneHref/location/avatar/github/facebook/linkedIn/resume/author` === giá trị dẫn xuất từ `me.profile` | pass    |

### T3 — `packages/icons/src/icons.test.tsx` (jsdom)

| #    | Case                                                                                                                                                                                            | Kỳ vọng |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| T3.1 | barrel **không** export tên `React`; có `ReactIcon`; `ICONS.react === ReactIcon`                                                                                                                | pass    |
| T3.2 | mọi `id` trong `me.skills` trừ phi-icon (`lighthouse`, `wcag`, `aria`, `cicd`, `testinglibrary`, `jwt`, `websocket`, `cursor`, `claudecode`) tra được `ICONS[id]`. `sanity`/`stripe` **có** SVG | pass    |
| T3.3 | `<SkillIcon id="khong-ton-tai" />` render `null`, không ném                                                                                                                                     | pass    |
| T3.4 | `<SocialIcons kind="khong-ton-tai" />` → `null`; `iconType='link'` → `<a href>` đúng, `target='_blank'` kèm `rel`                                                                               | pass    |
| T3.5 | `size` prop ra `style` width/height (không phải class `h-${n}`)                                                                                                                                 | pass    |
| T3.6 | smoke: render **mọi** entry của `ICONS` → mỗi cái ra đúng 1 `<svg>`                                                                                                                             | pass    |

### T4 — `packages/icons/src/lucide/lucide.test.tsx` (jsdom)

| #    | Case                                                                                                                                | Kỳ vọng |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| T4.1 | barrel `@portfolio/icons/lucide` export **đủ 50 tên** ở §4.4 (hằng danh sách trong test)                                            | pass    |
| T4.2 | smoke: render từng icon → 1 `<svg>`, `width`/`height` mặc định `24`                                                                 | pass    |
| T4.3 | `ref.current.startAnimation` và `.stopAnimation` là function                                                                        | pass    |
| T4.4 | `onMouseEnter` / `onMouseLeave` do caller truyền vẫn được gọi khi hover                                                             | pass    |
| T4.5 | với `matchMedia('(prefers-reduced-motion: reduce)')` = true, hover không tạo tween (`gsap.globalTimeline.getChildren()` không tăng) | pass    |
| T4.6 | không file nào trong `src/lucide/` import `motion` / `framer-motion` (đọc source)                                                   | pass    |

### T5 — `packages/icons/src/no-lucide-react.test.ts` (node)

Quét `apps/**`, `packages/ui/**`, `packages/mdx/**`: **không file nào** còn `from 'lucide-react'`.
Chỉ `packages/icons` được phép.

---

## 7. Verify

```bash
pnpm --filter @portfolio/icons typecheck && pnpm --filter @portfolio/content typecheck
```

```bash
pnpm ci-check
```

- **Grep sạch**: `.design-sync.entry` chỉ còn trong `ds-bundle*/` (artifact sinh lại được) và
  `docs/plans/phases/C12-ci-cleanup/C12-03-PLAN.md` (lịch sử).
  `@/components/atoms/icons`, `gen-icons-safe`, và `from 'lucide-react'` (ngoài `packages/icons`)
  không còn hit nào.
- **Chạy dev cả hai app** bằng preview tool (`.claude/launch.json`: `web-2026` → :3000,
  `web-2025` → :3001 — **không** chạy bằng Bash), đọc:
  - 2026: `/`, `/en`, `/resume`, `/projects`, `/about`, `/contact`
  - 2025: `/`, `/en`, `/about`, `/projects`, `/contact`

  Kiểm:
  - Công ty hiện tại là **NEXSOFT TECHNOLOGY** (không còn PVS ở thì hiện tại);
    PTIT `2018-08 → 2022-12`; phone `(+84) 528-307-775`; avatar trả 200 (không còn `?s…00`);
    không còn `Sample Project` / `your-username` / `Company Name`; `vi` và `/en` khác nhau thật.
  - Projects có cả `portfolio-2026` (luongviphu.vercel.app) và `portfolio-2025`
    (v1-luongviphu.vercel.app/about).
  - 2025 `/about`: tab kỹ năng hiện **9 nhóm CV**, mỗi nhóm có icon (kể cả `sql`/`nosql` vốn trống).
  - Console + network không có `undefined is not a component` hay 404 icon.

- **Kiểm animation icon bằng hover chuột thật** (`computer` → `hover`; **không** dùng synthetic
  scroll — nó cho false negative với animation, xem `CLAUDE.md`): nav 2025, nút Download ở
  `/resume`, chevron của Select/DropdownMenu trong `packages/ui`, nút X của Dialog. Xác nhận chạy
  khi hover, đảo chiều khi rời chuột, **không** tự chạy loop.
  Kiểm thêm `prefers-reduced-motion` (emulate qua browser tool) → icon đứng yên.
- **Bảng route của `pnpm build`**: các route `[locale]` vẫn static (`○` / `●`), **không có `ƒ`** —
  hồi quy `setRequestLocale` đã từng gây 500 trên Vercel (xem `CLAUDE.md`).
- `pnpm shots` nếu layout resume 2026 (2 tầng company → product) hoặc tab 2025 (3 → 9) đổi đáng kể.

---

## 8. Ranh giới / không được làm

- **Không chạy `/design-sync`** — skill này chỉ user gọi được. Phase 5 chỉ sửa config/script/shim
  cho lần user chạy sau.
- Phase 5 **không thể verify bằng `ci-check`**: entry/config design-sync nằm ngoài build graph
  (`apps/*/tsconfig.json` dùng include wildcard, bỏ qua file dot-prefix). Ghi rõ điểm chưa kiểm
  chứng vào `NOTES.md` / `NOTES-2026.md`.
- **Không tự xoá** `D:\portfolio\.claude\worktrees\init-7bf311\` — nó là bản sao cũ của đúng các
  file đang sửa, nằm ngoài prettier/eslint nên sẽ trôi lệch và làm nhiễu mọi lần grep sau. Báo lại
  cho user quyết.
- **Không** viết MDX case study dài cho project nào.
- **Không** viết lại mọi molecule của 2025; atom đặc thù app (`Container`, `Timeline`, …) vẫn ở local.
- **Không** thêm `motion` / `framer-motion` làm dependency — animation dùng GSAP.
- README và comment trong repo viết tiếng Việt; commit message tiếng Anh, conventional format.
