# Phase C6: 2025 Lingui → next-intl + data chung — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Phase này chuyển toàn bộ i18n của `apps/2025` từ Lingui (macro + catalog `.po` + middleware negotiator tự viết) sang next-intl **y hệt kiến trúc 2026**: locale `vi` mặc định không prefix + `/en/...`, `localePrefix: 'as-needed'`; URL cũ `/vi-VN/*` → `/*` và `/en-US/*` → `/en/*` redirect permanent 308. Đồng thời data tĩnh (skills/experience/projects/site-metadata) chuyển sang đọc từ `@portfolio/content` (các export `*_2025` của C2) và `apps/2025/data/` bị xóa hẳn. Kết thúc phase: `grep -r "@lingui" apps/2025` = 0 kể cả package.json — đây là blocker #2 của Next 16 (Lingui SWC plugin), mở đường cho C7.

KHÔNG thuộc phase này: đổi tên `middleware.ts` → `proxy.ts` (convention Next 16 — thuộc C7), nâng Next 16/dep sweep (C7), đụng vào UI components ngoài phần chuỗi i18n (C8), tối ưu client bundle messages bằng `pick` (hoãn, xem deferred). Phụ thuộc: C4 (còn 2 locale vi-VN/en-US), C5 (hết contentlayer — build chạy được từ Git Bash), C2 (data `*_2025` đã dịch sẵn trong packages/content).
</domain>

<decisions>
## Quyết định đã khóa

### Kiến trúc i18n đích (convention mirroring 2026)

- **D-01:** Copy nguyên xi pattern i18n của 2026 sang 2025, chỉ đổi đường dẫn: `src/i18n/routing.ts` (`locales: ['vi','en']`, `defaultLocale: 'vi'`, `localePrefix: 'as-needed'`), `request.ts` (`getRequestConfig` load `messages/${locale}.json`), `navigation.ts` (`createNavigation(routing)` export `Link/redirect/usePathname/useRouter/getPathname`). Từ giờ "học 1 lần, áp 2 app" — đây chính là giá trị "nâng 1 là nâng cho cả 2". Theo mẫu M-01, M-02, M-03.
- **D-07:** Middleware: thay TOÀN BỘ middleware negotiator tự viết bằng `createMiddleware(routing)` nhưng **giữ tên file `src/middleware.ts`** trong C6 (app còn Next 15.2); đổi tên sang `proxy.ts` là việc của C7. Theo mẫu M-04.
- **D-13:** Chuyển `src/app/[lang]/api/{github,stats}` ra **ngoài** segment locale thành `src/app/api/{github,stats}` — vì (a) matcher middleware next-intl loại trừ `/api`, (b) mọi call site fetch hiện có đã gọi `/api/github`, `/api/stats` KHÔNG prefix locale (project-card.tsx:19, use-blog-stats.ts:7,26 — hiện chỉ chạy được nhờ middleware negotiator redirect thêm prefix; sau migration sẽ 404 nếu không move). API response không có nội dung cần dịch.

### Catalog & phân loại chuỗi

- **D-03:** Convert catalog `.po` → `messages/{vi,en}.json` bằng script tự viết `apps/2025/scripts/po-to-messages.ts` (chạy 1 lần bằng tsx — đã có `tsx ^4.19.3` trong devDeps): parse msgid/msgstr tay bằng regex (format PO của Lingui đơn giản), sinh JSON **namespaced theo file chứa macro** giống cấu trúc messages 2026 (vd `{"Navbar": {"home": "Trang chủ"}}`). Vấn đề then chốt: Lingui key = câu tiếng Anh nguyên văn, next-intl key = id ngắn — script không tự đặt tên đẹp được → sinh key máy (slug hóa 3-4 từ đầu hoặc hash) kèm file mapping `messages/msgid-map.json` (`msgid → Namespace.key`) để tra khi sửa call site. Map file→namespace thủ công trong script (danh sách file dùng macro đã biết — xem code_context). Script + mapping là **đồ dùng 1 lần** — xóa ở plan 04, không giữ trong repo.
- **D-04:** Phân loại chuỗi theo quy ước sẵn của 2026 (content/UI-string separation): chuỗi chrome UI → `messages/*.json`; chuỗi nội dung (skills, projects, experience, metadata) → `Localized{vi,en}` trong `@portfolio/content`. Khi port, mỗi msgid phải được phân vào đúng 1 trong 2 — KHÔNG nhét content vào messages.

### Cách port macro

- **D-08:** Port đúng theo bảng quy đổi M-08, không chế biến khác: `` t`...` `` client → `useTranslations('Ns')`; server/page → `await getTranslations('Ns')`; `<Trans>` có rich text → `t.rich('key', {...})`; `i18n._(msgDescriptor)` runtime → bỏ hẳn descriptor vì data giờ là `Localized`, lấy `value[locale]` trực tiếp; `useLingui()` lấy locale → `useLocale()`. Đã grep xác nhận: KHÔNG có `plural(` trong src (0 kết quả) — không cần lo ICU plural khi port.
- **D-09:** Trình tự port ít rủi ro + khung chuyển tiếp: **layout + providers trước** (khung chạy được), rồi page/template từng file, cuối cùng molecules có logic. Vì luật GSD "mỗi plan 1 commit, kết thúc plan build phải xanh", trong các plan giữa chừng **hai runtime chạy song song**: `NextIntlClientProvider` bọc ngoài theo pattern 2026, `LocaleProvider` (Lingui) giữ lại bên trong với catalog map `vi → vi-VN`, `en → en-US` cho các component chưa port (theo mẫu M-09). Khung chuyển tiếp gỡ ở plan 03 (khi hết call site macro), hạ tầng Lingui gỡ ở plan 04.
- **D-10:** `locale-switch.tsx` viết lại từ đầu: chỉ còn 2 lựa chọn vi/en, dùng `router.replace(pathname, { locale })` của `@/i18n/navigation` + `useLocale()` — vứt bỏ logic path-munging 6 locale hiện tại (split pathname tay).

### Data chung

- **D-05:** `experience.tsx`, `technologies.tsx` (organisms), `projects.tsx` (template) + `project-card.tsx` import `SKILLS_2025`, `EXPERIENCES_2025`, `PROJECTS_2025` từ `@portfolio/content`, render `field[locale]` (locale từ `useLocale()`/`getLocale()`). Site metadata (`generateMetadata` layout, footer, `RSS_CONFIG` trong scripts/rss.ts, robots.ts, sitemap.ts) → `SITE_METADATA_2025`. **Xóa `apps/2025/data/main.ts` + `data/site-metadata.ts`** (data/ biến mất hoàn toàn — blog/authors đã rời từ C5) + gỡ alias `@data/*` trong tsconfig.json; gate `grep -rn "@data/" apps/2025/src apps/2025/scripts` = 0. Sitemap phải sinh URL theo scheme mới ngay trong phase (phòng bị SEO).

### URL & SEO

- **D-02:** Redirect URL cũ bằng `redirects()` trong next.config.ts, `permanent: true` (308), đủ 4 rule: `/vi-VN` → `/`, `/vi-VN/:path*` → `/:path*`, `/en-US` → `/en`, `/en-US/:path*` → `/en/:path*`. Theo mẫu M-06. Không giữ URL cũ song song.
- **D-12:** giscus comment thread sẽ tách theo URL mới — **chấp nhận** (đã quyết ở master plan); mapping giscus theo pathname cũ chỉ là option nếu user phàn nàn sau này (deferred).

### Gỡ Lingui & tối ưu

- **D-06:** Gỡ trọn bộ, không giữ gì "phòng hờ": 7 gói `@lingui/{core,macro,react,cli,conf,loader,swc-plugin}` + `negotiator` + `@types/negotiator`; trong next.config.ts xóa `experimental.swcPlugins` (dòng 64) + rule `'*.po'` turbopack (dòng 67-68) + rule webpack `/\.po$/` (dòng 101-102); xóa `lingui.config.js`, `src/i18n/locales/`, `src/i18n/i18n.ts`, `src/i18n/initLingui.tsx`, `src/providers/locale.tsx`, 2 script `lingui:extract`/`lingui:compile` trong package.json. Root package.json/pnpm-workspace.yaml đã kiểm: KHÔNG có pin nào cho swc-plugin (pin `^5.6.1` nằm ngay devDeps của apps/2025). Hết `.po` loader + swc plugin → build nhanh hơn và mở khóa Turbopack/Next 16 — mục đích tồn tại của phase.
- **D-11:** Client bundle: chấp nhận ship toàn bộ messages xuống client qua `NextIntlClientProvider` (không `pick`) ở bước đầu; tối ưu sau khi đo (deferred). next-intl + `setRequestLocale` giữ static rendering — Lingui runtime provider trước đây kéo client bundle.

### Quy trình

- **D-14:** Thi công trên branch `c6-next-intl`, mỗi plan 1 commit trên branch, **merge vào main chỉ khi gate plan 04 xanh** — vì push main auto-deploy cả 2 Vercel project, mà từ plan 01 URL scheme đã đổi nhưng redirect chỉ có ở plan 04 (URL cũ sẽ 404 nếu deploy giữa chừng). Rollback: revert merge; catalog `.po` và `data/*.ts` còn trong git history.

### Claude tự quyết

- Tên key/namespace cụ thể khi slug máy xấu hoặc msgid trùng giữa nhiều file (gợi ý: msgid dùng chung nhiều file → namespace `Common`); ghi lựa chọn vào SUMMARY.
- Cách truyền message đã dịch vào schema validate của contact-form (factory nhận `t` hay validate tại call site) — miễn message hiển thị đúng ngôn ngữ.
- Vị trí chính xác của `NextIntlClientProvider` so với `ProviderRegistry` trong layout, miễn theo semantics M-05/M-09.
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

### M-01 — `src/i18n/routing.ts` (copy từ apps/2026/src/i18n/routing.ts, đã verify)

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  // vi không có prefix (/about), en có prefix (/en/about)
  localePrefix: 'as-needed',
})
```

### M-02 — `src/i18n/request.ts` (copy từ apps/2026/src/i18n/request.ts, đã verify)

```ts
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

### M-03 — `src/i18n/navigation.ts` (copy từ apps/2026/src/i18n/navigation.ts, đã verify)

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
```

### M-04 — `src/middleware.ts` mới (nội dung như apps/2026/src/proxy.ts nhưng giữ tên middleware.ts theo D-07)

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next 15.2 dùng convention middleware.ts; đổi tên proxy.ts ở C7
export default createMiddleware(routing)

export const config = {
  // Match mọi path trừ /api, /_next, /_vercel và file tĩnh (có dấu chấm)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
```

### M-05 — Pattern layout của 2026 (rút gọn từ apps/2026/src/app/[locale]/layout.tsx, đã verify)

```tsx
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>{/* providers + nav + children + modal */}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### M-06 — `redirects()` trong next.config.ts (nguyên văn từ plan cũ)

```ts
async redirects() {
  return [
    { source: '/vi-VN', destination: '/', permanent: true },
    { source: '/vi-VN/:path*', destination: '/:path*', permanent: true },
    { source: '/en-US', destination: '/en', permanent: true },
    { source: '/en-US/:path*', destination: '/en/:path*', permanent: true },
  ]
}
```

### M-07 — Cây cấu trúc file đích của phase (từ plan cũ, đã hiệu chỉnh `lingui.config.js` + api)

```
apps/2025/
├── lingui.config.js               # XÓA (plan 04) — chú ý: .js chứ không phải .ts
├── messages/                      # MỚI (plan 01)
│   ├── vi.json                    #   convert từ src/i18n/locales/vi-VN/messages.po
│   ├── en.json                    #   convert từ src/i18n/locales/en-US/messages.po
│   └── msgid-map.json             #   mapping msgid → Namespace.key (đồ 1 lần, XÓA ở plan 04)
├── data/                          # XÓA HẲN (plan 03: main.ts, site-metadata.ts — mọi thứ đã ở packages/content)
├── scripts/
│   └── po-to-messages.ts          # MỚI (plan 01), XÓA ở plan 04
└── src/
    ├── i18n/
    │   ├── routing.ts  request.ts  navigation.ts    # MỚI — copy pattern 2026 (plan 01)
    │   └── locales/, i18n.ts, initLingui.tsx        # XÓA (plan 04)
    ├── middleware.ts                                 # createMiddleware(routing) — giữ tên, đổi proxy.ts ở C7
    ├── providers/locale.tsx                          # XÓA (plan 03 — NextIntlClientProvider thay)
    └── app/
        ├── api/                                      # git mv từ [lang]/api/ ra ngoài segment (plan 01)
        └── [locale]/...                              # git mv từ [lang]/ (plan 01)
```

### M-08 — Bảng quy đổi macro Lingui → next-intl (nguyên văn từ plan cũ)

| Lingui                                                                      | next-intl                                                                                                  |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `` t`Hello` `` trong client component                                       | `const t = useTranslations('Ns')` → `t('hello')`                                                           |
| `` t`...` `` / `` msg`...` `` trong server/page                             | `const t = await getTranslations('Ns')`                                                                    |
| `<Trans>Xem <a>tại đây</a></Trans>`                                         | `t.rich('key', { a: (chunks) => <a ...>{chunks}</a> })`                                                    |
| `plural(n, {...})`                                                          | ICU trong message: `{count, plural, ...}` → `t('key', { count })` — đã grep: KHÔNG có trong src            |
| `i18n._(msgDescriptor)` runtime (contact-form, project-card, locale-switch) | `useTranslations` thường — vì data giờ là `Localized`, lấy `value[locale]` trực tiếp, không cần descriptor |
| `useLingui()` lấy locale hiện tại                                           | `useLocale()`                                                                                              |

### M-09 — Khung chuyển tiếp hai runtime trong layout (plan 01→03, gỡ ở plan 03 theo D-09)

```tsx
const { locale } = await params // 'vi' | 'en' (đã qua hasLocale + notFound)
const linguiLocale = locale === 'en' ? 'en-US' : 'vi-VN' // KHUNG CHUYỂN TIẾP — gỡ ở plan 03

return (
  <html lang={locale} suppressHydrationWarning>
    <body>
      <NextIntlClientProvider>
        {/* ProviderRegistry bên trong vẫn gọi initLingui(linguiLocale) + LocaleProvider
            với allMessages[linguiLocale] cho các component CHƯA port */}
        <ProviderRegistry linguiLocale={linguiLocale}>...</ProviderRegistry>
      </NextIntlClientProvider>
    </body>
  </html>
)
```

</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` — mục Phase C6: goal, REQ-06/REQ-01/REQ-10, 3 success criteria (grep @lingui=0, đủ trang + contact modal sống, curl 308).
- `docs/plans/archive/C6-2025-next-intl.md` — plan chi tiết cũ, nguồn gốc của mọi quyết định D-NN và facts trong file này.
- `docs/plans/STATE.md` — quyết định toàn cục (i18n đích 2 locale, 1 commit/plan, main luôn build được) + blockers.
- `apps/2026/src/i18n/routing.ts`, `apps/2026/src/i18n/request.ts`, `apps/2026/src/i18n/navigation.ts`, `apps/2026/src/proxy.ts`, `apps/2026/src/app/[locale]/layout.tsx` — pattern chuẩn để copy (nguồn của M-01…M-05).
- `apps/2025/src/middleware.ts`, `apps/2025/lingui.config.js`, `apps/2025/src/i18n/i18n.ts`, `apps/2025/src/providers/index.tsx` — hiện trạng cần thay.
- `packages/content/src/index.ts` — điểm export `SKILLS_2025`/`EXPERIENCES_2025`/`PROJECTS_2025`/`SITE_METADATA_2025` (dòng 19-22).
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh 2026-07-11 — trước khi C4/C5 chạy; số liệu có thể giảm nhẹ sau C4/C5, KHÔNG tăng)

### Tài sản tái dùng

- 2026 là mẫu chuẩn hoàn chỉnh: `src/i18n/{routing,request,navigation}.ts`, `messages/{vi,en}.json`, `src/proxy.ts` dùng `createMiddleware(routing)`, layout với `hasLocale` + `setRequestLocale` + `NextIntlClientProvider` (đã đọc nguyên văn — M-01…M-05).
- `packages/content/src/index.ts` ĐÃ khai báo export `SKILLS_2025`, `EXPERIENCES_2025`, `PROJECTS_2025`, `SITE_METADATA_2025` (dòng 19-22; file nguồn tạo ở C2 — C6 chỉ tiêu thụ).
- `tsx ^4.19.3` có sẵn trong devDeps apps/2025 (script `postbuild` đang dùng) — chạy được po-to-messages.ts không cần cài thêm.

### Hiện trạng Lingui (cái phải gỡ)

- `grep -rl "@lingui" apps/2025/src` = **29 file**: 8 file app (`[lang]/layout.tsx`, 6 page `(page)/{about,blog,contact,photos,projects,tags}/page.tsx`, `@modal/(.)contact/page.tsx`), 7 template (`about,blog,contact,not-found,photos,projects,tag`), 5 organism (`navbar`, `experience`, `technologies`, `github-cal`, `search/kbar-modal`), 5 molecule (`setting`, `locale-switch`, `contact-form`, `previous-page`, `project-card`), 1 atom (`timeline.tsx`), 3 runtime (`i18n/i18n.ts`, `i18n/initLingui.tsx`, `providers/locale.tsx`). (Plan cũ ghi "~94 macro trên 21 file" — 21 là file UI dùng macro, 29 gồm cả runtime.)
- Catalog: `src/i18n/locales/{vi-VN,en-US}/messages.po` mỗi file **60 msgid** (grep -c "^msgid"). Sau C4 chỉ còn 2 thư mục locale này.
- `useLingui` trong 10 file: timeline, contact-form, project-card, experience + 6 template (about, blog, contact, not-found, photos, projects). `<Trans` trong 14 file. `plural(` = **0** (không có).
- Deps (apps/2025/package.json): `@lingui/{core,macro,react}` ^5.2.0 (deps), `@lingui/cli` ^5.2.0, `@lingui/conf` 5.9.5, `@lingui/loader` ^5.2.0, `@lingui/swc-plugin` ^5.6.1 (devDeps — pin theo memory known-issues), `negotiator` ^1.0.0, `@types/negotiator` ^0.6.3; scripts `lingui:extract`, `lingui:compile` (dòng 22-23). Root package.json/pnpm-workspace.yaml KHÔNG có pin/override lingui nào khác.
- `next.config.ts`: `experimental.swcPlugins: [['@lingui/swc-plugin', {}]]` (dòng 64), rule turbopack `'*.po'` → `@lingui/loader` (dòng 67-68), rule webpack `test: /\.po$/` (dòng 101-102). CHƯA có `redirects()`.
- Config là `lingui.config.js` (CommonJS, **không phải .ts** như plan cũ ghi), `sourceLocale: 'en-US'`, fallback `vi-VN`.
- `src/middleware.ts`: tự viết, dùng `Negotiator` + `linguiConfig.locales`, redirect thêm prefix locale khi thiếu.
- `src/providers/index.tsx` (`ProviderRegistry`): `await initLingui(lang)` + `<LocaleProvider initialLocale={lang} initialMessages={allMessages[lang]!}>` bọc ThemeProvider/AppProvider. `providers/locale.tsx` = `setupI18n` + `I18nProvider` của Lingui.

### Điểm tích hợp

- App router segment hiện là `[lang]`: `(page)/{about,blog,blog/[...slug],contact,photos,projects,tags,tags/[tag]}`, `@modal/(.)contact/page.tsx` + `@modal/default.tsx` (parallel + intercepting route — điểm dễ vỡ khi mv), `[...rest]/page.tsx` (catch-all 404), `api/{github,stats}/route.ts` (nằm TRONG segment — phải move ra, xem D-13), `layout.tsx`, `loading.tsx`, `not-found.tsx`, `page.tsx`.
- `[lang]/layout.tsx`: `generateStaticParams` từ `linguiConfig.locales`, `generateMetadata` dùng `i18n._(msg\`...\`)`+`SITE_METADATA`từ`@data/site-metadata`, render `<Navbar lang={lang}/>`+ slot`{modal}`+`KBarSearchProvider`.
- Call site fetch API không prefix locale: `project-card.tsx:19` (`/api/github?repo=`), `hooks/use-blog-stats.ts:7,26` (`/api/stats`) — cơ sở của D-13.
- Data: alias `@data/*` → `./data/*` (tsconfig.json dòng 14). **22 file** trong src+scripts import `@data/` (grep -rln "from '@data/"): 3 app (`blog/[...slug]/page.tsx`, `tags/[tag]/page.tsx`, `layout.tsx`) + `robots.ts` + `sitemap.ts` + 9 molecule/atom (comments, edit-on-github, hover-effect, post-card-grid-view, post-card-list-view, project-card…) + organisms (experience, footer, navbar, technologies) + templates (about, contact, post-banner, post-layout, post-simple, projects) + `utils/github.ts`. Một phần (blog/authors) sẽ được C5 xử lý trước; phần còn lại thuộc C6.
- `data/main.ts` export `SKILLS` (dòng 54), `PROJECTS` (dòng 344), `EXPERIENCES` (dòng 386) + interfaces `Skill/Project/Experience/Company`; `data/site-metadata.ts` export `SITE_METADATA` (dòng 5, chứa cả `search.kbarConfigs`).
- `scripts/rss.ts` có `RSS_CONFIG` hardcode trích từ site-metadata (dòng 10) — phải trỏ về `SITE_METADATA_2025`.
- `locale-switch.tsx` hiện hardcode 6 locale + split pathname tay + `next/navigation` — viết lại theo D-10.
- Port dev: web-2025 = **3001**, web-2026 = 3000. Từ sau C5, build web-2025 chạy được từ Git Bash (hết bug PWD contentlayer).
  </code_context>

<deferred>
## Ý tưởng hoãn

- Tối ưu client bundle: chỉ `pick` messages cần cho client components thay vì ship hết qua `NextIntlClientProvider` — làm sau khi đo, backlog/C12 (theo D-11).
- Mapping giscus theo pathname cũ để giữ comment thread — chỉ làm nếu user phàn nàn sau deploy (theo D-12), backlog.
- Đổi tên `src/middleware.ts` → `src/proxy.ts` — thuộc C7 (convention Next 16, theo D-07).
- Bấm thử vài URL cũ đã index Google sau khi 2 deploy Vercel xanh — hậu kiểm sau merge, ngoài gate phase.
</deferred>

---

_Phase: C06-2025-next-intl_
