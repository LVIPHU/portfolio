# Phase C4: 2025 thu gọn 6 locale → vi-VN + en-US — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Giảm bề mặt i18n của `apps/2025` từ 6 locale (vi-VN, en-US, ja-JP, ko-KR, zh-CN, zh-TW) xuống 2 (vi-VN, en-US), **giữ Lingui nguyên vẹn** — để C6 chỉ phải port 2 catalog thay vì 6 (giảm ~2/3 khối lượng port). Phase này không phụ thuộc phase nào (chạy song song C2/C3 được), nhưng **chặn C6** — phải xong trước.

KHÔNG thuộc phase này: đổi engine i18n Lingui → next-intl (C6), redirect permanent URL cũ `/vi-VN` → `/` (C6), mọi thay đổi ở `apps/2026` hoặc `packages/*`, gỡ Contentlayer (C5). Ước lượng: ~1h.
</domain>

<decisions>
## Quyết định đã khóa

### Chiến lược

- **D-01:** **Shrink before migrate** — nguyên tắc chung của cả kế hoạch C: thu nhỏ bề mặt trước khi đổi công nghệ, không làm 2 việc trong 1 commit. Phase này CHỈ thu locale, giữ Lingui nguyên vẹn; đổi engine là việc của C6, không trộn.
- **D-02:** `lingui.config.js`: `locales: ['vi-VN', 'en-US']`; giữ nguyên `sourceLocale: 'en-US'` và `fallbackLocales: { default: 'vi-VN' }` như hiện trạng (đã xác minh trên file thật — plan cũ ghi loáng thoáng "fallback về en-US" là không đúng file thực tế).
- **D-03:** Middleware/negotiator: danh sách locale được đàm phán chỉ còn 2 — user mang `Accept-Language` ja/ko/zh sẽ rơi về fallback `vi-VN`. Chấp nhận có chủ đích: đó chính là mục đích của phase.
- **D-04:** SEO: chấp nhận các URL ja/ko/zh đã index bị 404 tạm trong C4–C5 — các URL đó gần như không có traffic (site cá nhân); C6 sẽ thêm redirect tổng về locale mới. Không làm redirect ở phase này.

### Phạm vi sửa code

- **D-05:** `locale-switch.tsx`: giữ nguyên component (Select dropdown), CHỈ thu dữ liệu ngắn lại — map `languages` và union type `LOCALES` còn 2 entry. Không redesign UI.
- **D-06:** **Single source of truth cho locale list**: đã xác minh runtime locale list chỉ có 1 nguồn là `lingui.config.js` — `i18n.ts`, `middleware.ts`, `generateStaticParams` của `[lang]/layout.tsx` đều import và derive từ nó → KHÔNG cần refactor gom thêm (điều kiện "nếu lặp >2 chỗ thì gom về 1 export" của plan cũ không kích hoạt). Các map cứng còn lại (`locale-switch.tsx`, `libs/dayjs.ts`, `atoms/timeline.tsx`) là dữ liệu hiển thị đặc thù từng component: chỉ xóa entry, giữ nguyên cấu trúc — C6 sẽ đổi đúng 1 chỗ (lingui.config → routing next-intl).

### Catalog & rollback

- **D-07:** Xóa hẳn 4 thư mục catalog `ja-JP/ ko-KR/ zh-CN/ zh-TW/`, sau đó regenerate 2 catalog còn lại sạch sẽ bằng `pnpm --filter web-2025 lingui:extract` rồi `pnpm --filter web-2025 lingui:compile` (script có sẵn trong package.json, extract đã kèm `--clean --overwrite`).
- **D-08:** Rollback = revert 1 commit — catalog `.po` nằm trong git, khôi phục nguyên trạng; không cần backup ngoài git.
- **D-09:** Sau khi trim, **ghi nhận lại hành vi thực tế** khi gõ tay URL locale đã xóa (vd `/ja-JP/about`): hành vi do middleware hiện tại quyết định (redirect/fallback về locale mặc định, không được 404 trắng) — ghi vào SUMMARY để C6 tái lập đúng hành vi này bằng redirect tổng.

### Claude tự quyết

- Giữ hay bỏ hẳn union type `LOCALES` trong `locale-switch.tsx` (miễn chỉ còn 2 giá trị hợp lệ) — ghi lựa chọn vào SUMMARY.
- Cách xóa 8 case ja/ko/zh trong 2 khối switch của `timeline.tsx` (xóa case, để nhánh `default` — vốn trùng hành vi en-US — gánh) và có gộp thêm gì không.
- Chi tiết flags lệnh curl smoke và cách đối chiếu số biến thể lang/page trong log build.
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

Plan cũ (`docs/plans/archive/C4-2025-trim-locales.md`) không chứa mẫu code — các mẫu dưới đây dựng từ hiện trạng codebase đã xác minh, thể hiện **trạng thái đích** sau trim.

### M-01 — `apps/2025/lingui.config.js` trạng thái đích

```js
/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  format: 'po',
  locales: ['vi-VN', 'en-US'],
  sourceLocale: 'en-US',
  fallbackLocales: {
    default: 'vi-VN',
  },
  catalogs: [
    {
      path: 'src/i18n/locales/{locale}/messages',
      include: ['src/'],
    },
  ],
}
```

### M-02 — `locale-switch.tsx` dữ liệu đích (component Select giữ nguyên)

```ts
type LOCALES = 'vi-VN' | 'en-US'

const languages = {
  'en-US': 'English',
  'vi-VN': 'Tiếng Việt',
} as const
```

### M-03 — `src/libs/dayjs.ts` hai map đích (phần plugin extend giữ nguyên)

```ts
export const dayjsLocaleMap: Record<string, string> = {
  'en-US': 'en',
  'vi-VN': 'vi',
}

export const dayjsLocales: Record<string, () => Promise<ILocale>> = {
  'en-US': () => import('dayjs/locale/en'),
  'vi-VN': () => import('dayjs/locale/vi'),
}
```

### M-04 — Lệnh gate grep + smoke fallback negotiator

```bash
# Gate grep tổng (chạy được từ Git Bash — chỉ grep, không build)
# Mạnh hơn gate SC1 trong ROADMAP: bao luôn lingui.config.js (file .js, glob *.ts của ROADMAP bỏ sót)
grep -rn "ja-JP\|ko-KR\|zh-CN\|zh-TW" apps/2025 \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.po" \
  --exclude-dir=node_modules --exclude-dir=.next | wc -l
# kỳ vọng: 0 (kể cả trong comment — comment nhắc locale chết cũng phải dọn)

# Smoke fallback negotiator (dev server :3001 đang chạy, start từ PowerShell)
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" \
  -H "Accept-Language: ja" http://localhost:3001/
# kỳ vọng: 307 -> http://localhost:3001/vi-VN (fallback, không crash negotiator)

curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/vi-VN   # kỳ vọng 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/en-US   # kỳ vọng 200
```

</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` — mục Phase C4: Goal, REQ-06, 2 Success Criteria (grep = 0; `/vi-VN` + `/en-US` chạy, switch 2 chiều, `Accept-Language: ja` fallback không crash).
- `docs/plans/STATE.md` — quyết định toàn cục: i18n đích 2 locale, bỏ 4 locale ja/ko/zh-CN/zh-TW; build/dev `apps/2025` phải chạy từ PowerShell (bug contentlayer PWD) cho tới hết C5; main phải luôn build được (auto-deploy Vercel).
- `apps/2025/lingui.config.js` — nguồn sự thật duy nhất của danh sách locale runtime; mọi chỗ khác derive từ đây.
- `docs/plans/archive/C4-2025-trim-locales.md` — plan chi tiết cũ (nguồn của các quyết định D-01…D-09).
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh 2026-07-11)

### Tài sản tái dùng

- Script có sẵn trong `apps/2025/package.json`: `"lingui:extract": "lingui extract --clean --overwrite"`, `"lingui:compile": "lingui compile"`.
- Kiến trúc derive-từ-config đã có sẵn (không phải xây): `src/i18n/i18n.ts` (dòng 3 import linguiConfig, dòng 9 destructure `locales`, load catalog động qua `import(\`./locales/${locale}/messages.po\`)`), `src/middleware.ts`(negotiator`.languages(locales.slice())`dòng 32, fallback`locales[0] || 'vi-VN'`dòng 34),`src/app/[lang]/layout.tsx` (`generateStaticParams`dòng 38–40 map`linguiConfig.locales`) — cả 3 tự co về 2 locale khi config đổi, không cần sửa.

### Điểm phải sửa (grep `ja-JP|ko-KR|zh-CN|zh-TW` toàn `apps/2025`, trừ node_modules: 26 kết quả / 8 file)

- `apps/2025/lingui.config.js` — 1 dòng (mảng `locales` 6 phần tử).
- `apps/2025/src/components/molecules/locale-switch.tsx` — 5 dòng (union type `LOCALES` dòng 9 + 4 entry map `languages` dòng 14–17).
- `apps/2025/src/libs/dayjs.ts` — 8 dòng (4 entry `dayjsLocaleMap` + 4 entry `dayjsLocales`).
- `apps/2025/src/components/atoms/timeline.tsx` — 8 dòng (2 khối switch trên `i18n.locale` — nhánh years>0 và nhánh else — mỗi khối 4 case ja-JP/zh-TW/zh-CN/ko-KR; nhánh `default` trùng hành vi en-US).
- 4 file `messages.po` của chính 4 locale sẽ xóa (mỗi file 1 dòng header tự tham chiếu) — biến mất khi xóa thư mục.

### Catalog

- `apps/2025/src/i18n/locales/` có 6 thư mục: `vi-VN, en-US, ja-JP, ko-KR, zh-CN, zh-TW`; mỗi thư mục 2 file `messages.po` (nguồn) + `messages.js` (compiled) → xóa 4 thư mục = 8 file.

### Điểm rà nhưng KHÔNG cần sửa (đã xác minh)

- `src/app/sitemap.ts` — không enumerate locale (routes không prefix lang) → chỉ rà xác nhận.
- `generateStaticParams` của `tags/[tag]/page.tsx` (dòng 32) và `blog/[...slug]/page.tsx` (dòng 76) — chỉ enumerate tag/slug, không enumerate locale.
- `src/i18n/i18n.ts` dòng 49 fallback cứng `allI18nInstances['vi-VN']` — giữ nguyên (vi-VN vẫn là locale mặc định).
- Không có flag icon hay import `.po` trực tiếp theo locale cứng nào khác ngoài 4 file trên (grep đã quét .ts/.tsx/.js/.json).

### Đính chính so với plan cũ

- Plan cũ ghi `lingui.config.ts` và `src/proxy|middleware` — thực tế là `apps/2025/lingui.config.js` (CommonJS) và `apps/2025/src/middleware.ts` (Next 15 vẫn dùng middleware.ts; `src/proxy.ts` là convention của 2026/Next 16).
- Gate SC1 của ROADMAP (`grep ... apps/2025/src apps/2025/*.ts`) bỏ sót `lingui.config.js` vì nó là `.js` — dùng lệnh M-04 mạnh hơn, bao trùm SC1.

### Ràng buộc môi trường

- Build/dev `web-2025` phải chạy từ **PowerShell** (bug contentlayer2 PWD với Git Bash — xem CLAUDE.md); grep/curl chạy từ Git Bash vô hại.
- `apps/2025` cần `.env.local` hợp lệ để build (đã có sẵn từ các phase trước).
  </code_context>

<deferred>
## Ý tưởng hoãn

- Redirect permanent URL locale cũ (`/vi-VN/about` → `/about`, `/ja-JP/*` → locale mới) — C6 (REQ-06).
- Đổi engine Lingui → next-intl, xóa 7 gói `@lingui` — C6.
- Gom các map hiển thị (languages label, dayjs locale, duration format) về 1 module i18n chung — không đáng làm trên Lingui sắp bỏ; C6 xử lý khi chuyển routing next-intl.
</deferred>

---

_Phase: C04-2025-trim-locales_
