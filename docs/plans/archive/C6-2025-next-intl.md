# C6 — apps/2025: Lingui → next-intl + dùng data chung từ @portfolio/content

> **Phụ thuộc:** C4 (còn 2 locale), C5 (hết contentlayer), C2 (data đã dịch sẵn). **Chặn:** C7 (Lingui SWC plugin là blocker #2 của Next 16). Phase lớn — cho phép 2 commit.
> **Ước lượng:** ~5–7h. **Commit:** `feat(2025)!: migrate Lingui to next-intl, unify i18n with 2026` (+ `chore(2025): drop lingui deps`).

## 1. Mục tiêu & phạm vi

- i18n 2025 chạy **y hệt kiến trúc 2026**: next-intl, locale `vi` (mặc định, không prefix) + `en` (`/en/...`), `localePrefix: 'as-needed'`.
- URL đổi: `/vi-VN/*` → `/*`, `/en-US/*` → `/en/*` — redirect permanent.
- Data tĩnh (skills/experience/projects/site-metadata) đọc từ `@portfolio/content` (`*_2025` exports của C2); **xóa `apps/2025/data/main.ts` + `site-metadata.ts`** — `data/` biến mất hoàn toàn.
- Gỡ 7 gói `@lingui/*` + negotiator + swcPlugins + rule `.po`.

## 2. Hiện trạng (facts)

- ~94 macro trên **21 file src** dùng `@lingui`: 10 template/page (`about`, `blog`, `contact`, `photos`, `projects`, `tag`, `not-found`…), organisms (`navbar`, `experience`, `technologies`, `footer`, `github-cal`, `kbar-modal`), molecules (`setting`, `locale-switch`, `contact-form`, `previous-page`, `project-card`), `timeline.tsx`, layout `[lang]/layout.tsx`, `@modal/(.)contact/page.tsx`, providers (`locale.tsx`), i18n runtime (`i18n.ts`, `initLingui.tsx`).
- Dạng dùng: `t\`...\``/`msg\`...\``(macro),`<Trans>...</Trans>`(có rich text),`useLingui()`runtime (contact-form, project-card, locale-switch),`plural()` nếu có (grep xác nhận khi làm).
- App router segment là `[lang]`; middleware tự viết + negotiator.
- 2026 làm mẫu chuẩn: `src/i18n/{routing,request,navigation}.ts`, `messages/{vi,en}.json`, `src/proxy.ts` dùng `createMiddleware(routing)`.

## 3. Cấu trúc file đích

```
apps/2025/
├── lingui.config.ts               # XÓA
├── messages/                      # MỚI
│   ├── vi.json                    #   convert từ vi-VN/messages.po
│   └── en.json                    #   convert từ en-US/messages.po
├── data/                          # XÓA HẲN (main.ts, site-metadata.ts — mọi thứ đã ở packages/content)
└── src/
    ├── i18n/
    │   ├── routing.ts  request.ts  navigation.ts    # MỚI — copy pattern 2026
    │   └── locales/, i18n.ts, initLingui.tsx        # XÓA
    ├── proxy.ts hoặc middleware.ts                   # createMiddleware(routing) (đổi tên proxy ở C7)
    ├── providers/locale.tsx                          # XÓA (NextIntlClientProvider thay)
    └── app/[locale]/...                              # git mv từ [lang]/
```

## 4. Hướng code chi tiết

### Bước 1 — Script convert catalog `.po` → `messages/{vi,en}.json`

Viết `scripts/po-to-messages.ts` (chạy 1 lần, tsx): parse `.po` (msgid/msgstr — parse tay bằng regex đủ, format PO của Lingui đơn giản), sinh JSON **namespaced theo component** giống cấu trúc messages của 2026 (vd `{"Navbar": {"home": "Trang chủ"}}`).

Vấn đề then chốt: Lingui key = **câu tiếng Anh nguyên văn**, next-intl key = id ngắn. Script không tự đặt tên đẹp được → sinh key máy (`slug hóa 3-4 từ đầu` hoặc hash) kèm file mapping `msgid → key` để bước 3 tra khi sửa call site. Đặt tên namespace theo **file chứa macro** (đã biết 21 file — map file→namespace thủ công trong script). Sau khi port xong, xóa script + mapping (đồ dùng 1 lần, không giữ trong repo — để trong scratchpad hoặc xóa ở commit 2).

### Bước 2 — Setup next-intl (copy nguyên xi từ 2026, đổi tên gói import)

`routing.ts`: `locales: ['vi', 'en']`, `defaultLocale: 'vi'`, `localePrefix: 'as-needed'`. `request.ts`: `getRequestConfig` load `messages/${locale}.json`. `navigation.ts`: `createNavigation(routing)` export `Link/redirect/usePathname/useRouter`. Middleware: thay toàn bộ middleware negotiator tự viết bằng `createMiddleware(routing)`. `git mv "src/app/[lang]" "src/app/[locale]"`; mọi `params.lang` → `params.locale`; layout gọi `setRequestLocale(locale)` + bọc `NextIntlClientProvider`.

### Bước 3 — Port 94 macro (việc tay chính — làm theo bảng quy đổi)

| Lingui                                                                      | next-intl                                                                                                  |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `` t`Hello` `` trong client component                                       | `const t = useTranslations('Ns')` → `t('hello')`                                                           |
| `` t`...` `` / `` msg`...` `` trong server/page                             | `const t = await getTranslations('Ns')`                                                                    |
| `<Trans>Xem <a>tại đây</a></Trans>`                                         | `t.rich('key', { a: (chunks) => <a ...>{chunks}</a> })`                                                    |
| `plural(n, {...})`                                                          | ICU trong message: `{count, plural, ...}` → `t('key', { count })`                                          |
| `i18n._(msgDescriptor)` runtime (contact-form, project-card, locale-switch) | `useTranslations` thường — vì data giờ là `Localized`, lấy `value[locale]` trực tiếp, không cần descriptor |
| `useLingui()` lấy locale hiện tại                                           | `useLocale()`                                                                                              |

Trình tự port ít rủi ro: **layout + providers trước** (khung chạy được), rồi page/template từng file, cuối cùng molecules có logic (contact-form với validate message, kbar-modal, locale-switch viết lại chỉ còn 2 lựa chọn + `router.replace(pathname, {locale})` của next-intl).

### Bước 4 — Data chung

- `technologies.tsx`, `experience.tsx`, `projects.tsx` templates: import `SKILLS_2025`, `EXPERIENCES_2025`, `PROJECTS_2025` từ `@portfolio/content`; render `field[locale]` (locale từ `useLocale()`/`getLocale()`).
- Site metadata (`generateMetadata` layout, footer, RSS_CONFIG trong scripts): `SITE_METADATA_2025`.
- Xóa `data/main.ts`, `data/site-metadata.ts`; grep `@/data` = 0.

### Bước 5 — Redirect URL cũ (next.config)

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

### Bước 6 — Gỡ Lingui

Deps: `@lingui/{core,macro,react,cli,conf,loader,swc-plugin}`, `negotiator`, `@types/negotiator`. `next.config.ts`: xóa `experimental.swcPlugins`, 2 rule `.po` (webpack + turbo). Xóa `lingui.config.ts`, `src/i18n/locales/`, scripts `lingui:*` trong package.json. Root `.npmrc`/pnpm config nếu có pin cho swc-plugin.

## 5. Design pattern áp dụng

- **Convention mirroring**: 2025 copy nguyên cấu trúc i18n của 2026 (file, tên, semantics) — từ giờ "học 1 lần, áp 2 app"; đây chính là giá trị "nâng 1 là nâng cho cả 2".
- **Content/UI-string separation** (quy ước sẵn của 2026): chuỗi chrome UI ở `messages/*.json`, chuỗi nội dung (skills, projects…) là `Localized` trong `@portfolio/content`. Khi port, mỗi msgid phải được phân loại vào 1 trong 2 — không nhét content vào messages.
- **Machine-assisted, human-finished**: script convert lo 80% cơ học (catalog → JSON), người lo 20% ngữ nghĩa (đặt key, tách namespace, rich text).

## 6. Tối ưu

- next-intl + `setRequestLocale` giữ static rendering (Lingui runtime provider trước đây kéo client bundle) — kiểm messages không bị ship toàn bộ xuống client: chỉ bọc `NextIntlClientProvider` với `pick` messages cần cho client components (pattern chuẩn next-intl), hoặc chấp nhận ship hết ở bước 1 và tối ưu sau khi đo.
- Hết `.po` loader + swc plugin → build nhanh hơn, và **mở khóa Turbopack/Next 16** (mục đích tồn tại của phase).

## 7. Testing & gate nghiệm thu

1. `grep -r "@lingui" apps/2025` = **0** (kể cả package.json); `grep -r "msg\`\|t\`" apps/2025/src` rà sót macro.
2. `pnpm typecheck` + `pnpm build` cả 2 app xanh (từ Git Bash — đã hết PWD bug từ C5).
3. Smoke `:3001` theo kịch bản:
   - `/` (vi, không prefix) + `/en/...` đủ trang: home, about, blog, projects, photos, tags, contact.
   - Không lộ key thô (quét mắt từng trang — lộ key = thiếu message).
   - Contact modal (`@modal` parallel route intercepting) mở từ navbar — điểm dễ vỡ khi mv `[lang]`→`[locale]`.
   - Form contact: validate message đúng ngôn ngữ; kbar search đổi locale đúng; switch locale giữ nguyên trang đang đứng.
   - Experience/Technologies/Projects hiện đúng bản dịch từ `Localized` (so với site cũ trước migration).
   - `curl -I /vi-VN/about` → 308 về `/about`; `/en-US/blog` → 308 `/en/blog`.
4. Push → 2 deploy Vercel xanh; bấm thử vài URL cũ đã index Google.

## 8. Rủi ro & rollback

| Rủi ro                                          | Phòng bị                                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Sót macro trong file ít chạy (not-found, error) | grep gate + đi tay đủ trang                                                                     |
| Parallel/intercepting route vỡ khi đổi segment  | test contact modal riêng; nếu vỡ, kiểm tên folder `@modal/(.)contact` khớp segment mới          |
| giscus comment thread tách theo URL mới         | chấp nhận (đã quyết ở master plan); mapping giscus theo pathname cũ là option nếu user phàn nàn |
| SEO: mất ranking URL cũ                         | redirect 308 permanent + sitemap mới ngay trong phase                                           |
| Phase kẹt giữa chừng                            | branch `c6-next-intl`, merge khi gate xanh                                                      |

Rollback: revert merge; catalog `.po` và `data/*.ts` còn trong git history.
