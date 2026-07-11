---
phase: C06-2025-next-intl
plan: 01
type: execute
wave: 1
depends_on: [C04-01, C05-04]
files_modified:
  - apps/2025/scripts/po-to-messages.ts
  - apps/2025/messages/vi.json
  - apps/2025/messages/en.json
  - apps/2025/messages/msgid-map.json
  - apps/2025/src/i18n/routing.ts
  - apps/2025/src/i18n/request.ts
  - apps/2025/src/i18n/navigation.ts
  - apps/2025/src/middleware.ts
  - apps/2025/src/app/[locale]/ # git mv từ [lang]/
  - apps/2025/src/app/api/ # move ra khỏi segment locale
  - apps/2025/src/app/[locale]/layout.tsx
  - apps/2025/src/providers/index.tsx
autonomous: true
requirements: [REQ-06, REQ-10]
must_haves:
  truths:
    - 'Build web-2025 xanh với khung hai runtime: next-intl routing chạy, component chưa port vẫn dịch qua Lingui'
    - 'URL scheme mới hoạt động: / (vi) + /en/* ; /api/github và /api/stats trả lời không cần prefix locale'
  artifacts:
    - 'apps/2025/messages/{vi,en}.json namespaced + msgid-map.json'
    - 'apps/2025/src/i18n/{routing,request,navigation}.ts giống hệt pattern 2026'
  key_links:
    - 'middleware.ts = createMiddleware(routing), matcher loại trừ /api'
    - 'layout [locale] bọc NextIntlClientProvider ngoài, ProviderRegistry(Lingui) trong với map vi→vi-VN'
---

<objective>
Dựng hạ tầng next-intl song song Lingui (khung chuyển tiếp hai runtime theo D-09): convert catalog, setup i18n 3 file, thay middleware, đổi segment `[lang]` → `[locale]`, move api ra ngoài. Kết thúc plan: app chạy trên URL scheme MỚI nhưng mọi chuỗi vẫn dịch được (component chưa port đi qua Lingui bridge). Thi công trên branch `c6-next-intl` theo D-14 — KHÔNG merge main cho tới plan 04.
</objective>

<context>
@docs/plans/phases/C06-2025-next-intl/C06-CONTEXT.md
@apps/2026/src/i18n/routing.ts
@apps/2026/src/app/[locale]/layout.tsx
@apps/2025/src/middleware.ts
@apps/2025/src/providers/index.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Script po→messages + sinh 2 file JSON namespaced</name>
  <files>apps/2025/scripts/po-to-messages.ts, apps/2025/messages/vi.json, apps/2025/messages/en.json, apps/2025/messages/msgid-map.json</files>
  <action>Viết scripts/po-to-messages.ts theo D-03: parse msgid/msgstr bằng regex từ src/i18n/locales/{vi-VN,en-US}/messages.po (60 msgid mỗi catalog — xem code_context), sinh messages/{vi,en}.json namespaced theo FILE chứa macro (map file→namespace khai thủ công trong script theo danh sách 26 file UI ở code_context; msgid xuất hiện ở nhiều file → namespace Common theo mục Claude tự quyết). Key máy: slug hóa 3-4 từ đầu msgid. Sinh kèm messages/msgid-map.json (msgid → Namespace.key) để plan 02/03 tra khi sửa call site. Chạy bằng npx tsx (tsx sẵn trong devDeps). Phân loại theo D-04: msgid thuộc content (tên skill/công ty/mô tả project — vốn nằm trong data/main.ts) KHÔNG đưa vào messages — đánh dấu skip trong script vì chúng sẽ đi đường Localized ở plan 03.</action>
  <verify>node -e "const v=require('./apps/2025/messages/vi.json'),e=require('./apps/2025/messages/en.json');const c=o=>Object.values(o).reduce((n,x)=>n+Object.keys(x).length,0);console.log(c(v),c(e));if(c(v)!==c(e))throw 'lệch key vi/en'" — 2 số bằng nhau; msgid-map.json tồn tại</verify>
  <done>2 file messages đủ và đối xứng key; mapping tra được 2 chiều; chuỗi content không lọt vào messages.</done>
</task>

<task type="auto">
  <name>Task 2: Setup i18n + middleware + mv segment + move api</name>
  <files>apps/2025/src/i18n/routing.ts, apps/2025/src/i18n/request.ts, apps/2025/src/i18n/navigation.ts, apps/2025/src/middleware.ts, apps/2025/src/app/[locale]/, apps/2025/src/app/api/</files>
  <action>Theo D-01: tạo 3 file routing/request/navigation đúng nguyên văn mẫu M-01/M-02/M-03 (copy từ 2026, chỉ khác đường messages). Theo D-07: thay TOÀN BỘ ruột src/middleware.ts bằng mẫu M-04 (createMiddleware + matcher loại /api) — giữ tên file middleware.ts (đổi proxy.ts là việc C7, nằm trong deferred). Theo D-13: git mv "src/app/[lang]/api" ra "src/app/api" TRƯỚC, rồi git mv "src/app/[lang]" "src/app/[locale]" — dùng git mv để giữ history; kiểm 2 call site fetch (project-card.tsx:19, use-blog-stats.ts:7,26) gọi /api/... không prefix — sau move là khớp thẳng, không sửa gì. Gỡ import Negotiator + linguiConfig khỏi middleware; negotiator CHƯA gỡ khỏi package.json (plan 04, D-06).</action>
  <verify>ls "apps/2025/src/app/[locale]" thấy (page)/@modal/layout.tsx...; ls apps/2025/src/app/api thấy github stats; grep -n "Negotiator" apps/2025/src/middleware.ts | wc -l = 0</verify>
  <done>Cấu trúc app/ đích như cây M-07; middleware next-intl thuần; api ngoài segment.</done>
</task>

<task type="auto">
  <name>Task 3: Layout hai runtime + đổi params.lang + build gate</name>
  <files>apps/2025/src/app/[locale]/layout.tsx, apps/2025/src/providers/index.tsx, apps/2025/src/app/[locale]/**/page.tsx</files>
  <action>Sửa [locale]/layout.tsx theo mẫu M-05 + khung chuyển tiếp M-09 (theo D-09): generateStaticParams từ routing.locales; hasLocale + notFound; setRequestLocale(locale); NextIntlClientProvider bọc NGOÀI, bên trong giữ ProviderRegistry nhận linguiLocale = locale==='en' ? 'en-US' : 'vi-VN' để mọi component CHƯA port vẫn dịch (sửa providers/index.tsx nhận prop linguiLocale thay lang). Đổi mọi params.lang → params.locale toàn bộ page/layout dưới [locale]/ (grep "params" từng file — kể cả generateMetadata, blog/[...slug], tags/[tag], @modal). generateMetadata layout tạm map linguiLocale như trên. Sau đó build gate: pnpm typecheck + pnpm build --filter=web-2025 (chạy được Git Bash — C5 đã gỡ contentlayer) phải XANH; đây là điều kiện D-09 "kết thúc plan build xanh với hai runtime song song".</action>
  <verify>grep -rn "params.lang\|{ lang }" "apps/2025/src/app" | wc -l = 0; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Build xanh trên URL scheme mới; trang chưa port vẫn hiển thị đúng ngôn ngữ qua bridge Lingui.</done>
</task>

</tasks>

<verification>
`pnpm build --filter=web-2025` xanh; dev :3001 mở `/` ra vi và `/en/about` ra en (mắt thường, chưa cần user); `/vi-VN/*` lúc này 404 — CHẤP NHẬN vì còn trên branch (D-14), redirect đến ở plan 04.
</verification>

<success_criteria>
Hạ tầng next-intl sống song song Lingui; segment + api đã đúng cấu trúc đích; không mất bản dịch nào.
</success_criteria>

<output>
Commit (branch c6-next-intl): `feat(2025): next-intl infrastructure + [locale] segment with lingui bridge`
Sau khi xong: viết C06-01-SUMMARY.md.
</output>
