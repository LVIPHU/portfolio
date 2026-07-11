---
phase: C04-2025-trim-locales
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/2025/lingui.config.js
  - apps/2025/src/components/molecules/locale-switch.tsx
  - apps/2025/src/libs/dayjs.ts
  - apps/2025/src/components/atoms/timeline.tsx
  - apps/2025/src/i18n/locales/ja-JP # xóa cả thư mục (messages.po + messages.js)
  - apps/2025/src/i18n/locales/ko-KR # xóa cả thư mục
  - apps/2025/src/i18n/locales/zh-CN # xóa cả thư mục
  - apps/2025/src/i18n/locales/zh-TW # xóa cả thư mục
  - apps/2025/src/i18n/locales/vi-VN/messages.po # regenerate
  - apps/2025/src/i18n/locales/vi-VN/messages.js # regenerate
  - apps/2025/src/i18n/locales/en-US/messages.po # regenerate
  - apps/2025/src/i18n/locales/en-US/messages.js # regenerate
autonomous: false
requirements: [REQ-06]
must_haves:
  truths:
    - 'grep ja-JP/ko-KR/zh-CN/zh-TW trên apps/2025 (*.ts/*.tsx/*.js/*.po, trừ node_modules/.next) trả 0 kết quả'
    - '/vi-VN và /en-US chạy trên :3001, switch locale 2 chiều qua dropdown hoạt động'
    - 'Request với Accept-Language: ja được negotiator fallback về vi-VN, không crash'
    - 'Build web-2025 (PowerShell) xanh, log build cho thấy mỗi page còn 2 biến thể lang thay vì 6'
  artifacts:
    - 'apps/2025/src/i18n/locales/ chỉ còn đúng 2 thư mục vi-VN và en-US, catalog đã regenerate sạch'
    - "apps/2025/lingui.config.js với locales ['vi-VN', 'en-US'], sourceLocale/fallbackLocales giữ nguyên"
  key_links:
    - 'i18n.ts + middleware.ts + [lang]/layout.tsx tiếp tục derive danh sách locale từ lingui.config.js (1 nguồn sự thật cho C6 đổi đúng 1 chỗ)'
    - 'locale-switch.tsx dropdown render đúng 2 option từ map languages đã thu'
---

<objective>
Thu gọn bề mặt i18n của `apps/2025` từ 6 locale xuống 2 (vi-VN + en-US) trong 1 commit nguyên tử, giữ Lingui nguyên vẹn — để C6 chỉ port 2 catalog thay vì 6 (giảm ~2/3 khối lượng). Output: config + 3 file code hết tham chiếu 4 locale bỏ đi, 4 thư mục catalog bị xóa, 2 catalog còn lại regenerate sạch, build xanh và smoke fallback được nghiệm thu. Phase này chặn C6; không phụ thuộc phase nào khác.
</objective>

<context>
@docs/plans/phases/C04-2025-trim-locales/C04-CONTEXT.md
@apps/2025/lingui.config.js
@apps/2025/src/i18n/i18n.ts
@apps/2025/src/middleware.ts
@apps/2025/src/components/molecules/locale-switch.tsx
@apps/2025/src/libs/dayjs.ts
@apps/2025/src/components/atoms/timeline.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Thu gọn config + code về 2 locale (không đổi engine)</name>
  <files>apps/2025/lingui.config.js, apps/2025/src/components/molecules/locale-switch.tsx, apps/2025/src/libs/dayjs.ts, apps/2025/src/components/atoms/timeline.tsx</files>
  <action>Theo D-01, phase này CHỈ thu locale — không đụng gì tới Lingui runtime, không đổi engine. Sửa 4 file theo thứ tự: (1) `apps/2025/lingui.config.js`: thu mảng `locales` về `['vi-VN', 'en-US']` theo D-02 và mẫu M-01 trong CONTEXT — giữ nguyên `sourceLocale: 'en-US'`, `fallbackLocales: { default: 'vi-VN' }` và khối `catalogs`. (2) `locale-switch.tsx`: theo D-05, giữ nguyên component Select, chỉ thu dữ liệu — union type `LOCALES` (dòng 9) và map `languages` (xóa 4 entry ja-JP/zh-TW/zh-CN/ko-KR) theo mẫu M-02. (3) `src/libs/dayjs.ts`: xóa 4 entry ja/zh-tw/zh-cn/ko trong CẢ HAI map `dayjsLocaleMap` và `dayjsLocales` theo mẫu M-03; giữ nguyên phần plugin extend. (4) `src/components/atoms/timeline.tsx`: xóa 8 case (2 khối switch trên `i18n.locale` × 4 case ja-JP/zh-TW/zh-CN/ko-KR) — nhánh `default` vốn trùng hành vi en-US nên xóa case là an toàn. Sau đó theo D-06: RÀ (không sửa) `src/i18n/i18n.ts`, `src/middleware.ts`, `src/app/[lang]/layout.tsx` (generateStaticParams dòng 38–40), `src/app/sitemap.ts` — xác nhận cả 4 derive từ lingui.config hoặc không enumerate locale; riêng middleware sau khi config đổi thì danh sách negotiator tự còn 2, user ja/ko/zh rơi về fallback vi-VN theo D-03 (đúng mục đích, không "sửa" gì). KHÔNG đụng dòng fallback cứng `allI18nInstances['vi-VN']` trong i18n.ts (vi-VN vẫn là locale mặc định). Phòng bị rủi ro "còn tham chiếu cứng locale đã xóa" của plan cũ: nếu trong lúc rà phát hiện thêm import `.po` trực tiếp hay flag icon theo locale cứng (grep hiện trạng nói là không có), xóa luôn trong task này.</action>
  <verify>`node -p "require('./apps/2025/lingui.config.js').locales.join(',')"` in ra đúng `vi-VN,en-US`; `grep -rn "ja-JP\|ko-KR\|zh-CN\|zh-TW" apps/2025/src --include="*.ts" --include="*.tsx" | wc -l` = 0 (22 dòng hiện trạng trong 4 file code phải về 0; catalog .po xử lý ở Task 2).</verify>
  <done>lingui.config.js chỉ còn 2 locale với sourceLocale/fallback nguyên trạng; 3 file code hết sạch tham chiếu 4 locale bỏ đi; 4 điểm derive được xác nhận không cần sửa.</done>
</task>

<task type="auto">
  <name>Task 2: Xóa 4 thư mục catalog + regenerate 2 catalog còn lại</name>
  <files>apps/2025/src/i18n/locales/ja-JP, apps/2025/src/i18n/locales/ko-KR, apps/2025/src/i18n/locales/zh-CN, apps/2025/src/i18n/locales/zh-TW, apps/2025/src/i18n/locales/vi-VN/messages.po, apps/2025/src/i18n/locales/vi-VN/messages.js, apps/2025/src/i18n/locales/en-US/messages.po, apps/2025/src/i18n/locales/en-US/messages.js</files>
  <action>Theo D-07: xóa hẳn 4 thư mục catalog `ja-JP/ ko-KR/ zh-CN/ zh-TW/` trong `apps/2025/src/i18n/locales/` (mỗi thư mục 2 file messages.po + messages.js — tổng 8 file). Theo D-08, KHÔNG backup thủ công — catalog .po nằm trong git, rollback của cả plan là revert 1 commit. Sau khi xóa, regenerate 2 catalog còn lại sạch sẽ: chạy `pnpm --filter web-2025 lingui:extract` rồi `pnpm --filter web-2025 lingui:compile` (script có sẵn, extract đã kèm cờ `--clean --overwrite` nên message chết bị dọn luôn). Lingui CLI không dính bug PWD của contentlayer, nhưng để nhất quán ràng buộc môi trường của repo (CLAUDE.md), chạy từ PowerShell. Kiểm tra output extract chỉ liệt kê 2 locale vi-VN/en-US và không báo missing catalog.</action>
  <verify>`ls apps/2025/src/i18n/locales` liệt kê đúng 2 thư mục `en-US` và `vi-VN`; `grep -rln "ja-JP\|ko-KR\|zh-CN\|zh-TW" apps/2025/src --include="*.po" | wc -l` = 0; `git -C D:/portfolio status --short apps/2025/src/i18n/locales` chỉ hiện file bị xóa (D) của 4 locale + thay đổi (M) của 2 catalog còn lại.</verify>
  <done>locales/ còn đúng 2 thư mục với catalog vừa regenerate; không còn file .po/.js nào của 4 locale bỏ đi trong working tree.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: Gate cuối (grep + build + smoke fallback) và user nghiệm thu :3001 bằng mắt</name>
  <action>Executor chạy gate tự động trước, theo thứ tự: (1) grep tổng theo mẫu M-04 trong CONTEXT — quét cả `apps/2025` với include *.ts/*.tsx/*.js/*.po, exclude node_modules/.next — kết quả PHẢI = 0 (lệnh này mạnh hơn và bao trùm gate SC1 của ROADMAP vốn bỏ sót lingui.config.js; nếu còn kết quả, kể cả trong comment, sửa tới khi 0 — đây là phòng bị rủi ro "còn tham chiếu cứng" của plan cũ). (2) Build từ PowerShell: `pnpm build --filter=web-2025` phải xanh — TUYỆT ĐỐI không build từ Git Bash (bug contentlayer2 PWD, NoConfigFoundError); đối chiếu log build: số route static giảm tương ứng, mỗi page còn 2 biến thể lang thay vì 6. (3) Start dev từ PowerShell: `pnpm dev:2025` → :3001, rồi chạy 3 lệnh curl smoke theo mẫu M-04: request `/` với header `Accept-Language: ja` phải nhận redirect về `/vi-VN` (fallback negotiator theo D-03, không crash), `/vi-VN` và `/en-US` trả 200. Theo D-04, KHÔNG kiểm tra hay vá gì cho URL ja/ko/zh đã index trên production — chấp nhận 404 tạm, C6 thêm redirect tổng. Sau khi cả 3 gate pass, mời user nghiệm thu bằng mắt: mở http://localhost:3001/vi-VN và http://localhost:3001/en-US, switch locale 2 chiều qua dropdown (vi→en rồi en→vi, nội dung đổi ngôn ngữ, URL đổi prefix); gõ tay http://localhost:3001/ja-JP/about và quan sát — kỳ vọng redirect/fallback về locale mặc định chứ không 404 trắng; theo D-09, ghi nhận HÀNH VI THỰC TẾ quan sát được (chuỗi redirect, trang đích) vào C04-01-SUMMARY.md để C6 tái lập bằng redirect tổng.</action>
  <verify>User xác nhận OK (sau khi 3 gate tự động ở action đều pass)</verify>
  <done>Grep tổng = 0; build PowerShell xanh với 2 biến thể lang/page; Accept-Language ja → redirect /vi-VN không crash; user thấy /vi-VN + /en-US chạy và switch 2 chiều OK; hành vi /ja-JP/about được quan sát và ghi nhận cho C6.</done>
</task>

</tasks>

<verification>
Gate tổng của plan (map thẳng vào Success Criteria của Phase C4 trong ROADMAP):

1. `grep -rn "ja-JP\|ko-KR\|zh-CN\|zh-TW" apps/2025 --include="*.ts" --include="*.tsx" --include="*.js" --include="*.po" --exclude-dir=node_modules --exclude-dir=.next | wc -l` = **0** — thỏa SC1 (`grep -r ... apps/2025/src apps/2025/*.ts` = 0) và mạnh hơn: bao luôn lingui.config.js (.js) và catalog .po; 0 kết quả kể cả trong comment.
2. `node -p "require('./apps/2025/lingui.config.js').locales.length"` = **2**.
3. Build web-2025 từ **PowerShell** xanh: `pnpm build --filter=web-2025`; log build: mỗi page còn 2 biến thể lang (trước là 6), số route static giảm tương ứng.
4. Smoke :3001 (dev từ PowerShell): `/vi-VN` + `/en-US` trả 200 và chạy; switch locale 2 chiều OK (mắt người — Task 3); `Accept-Language: ja` → redirect `/vi-VN`, negotiator không crash — thỏa SC2.
5. Hành vi `/ja-JP/about` (URL locale đã xóa) được quan sát và ghi nhận vào SUMMARY (không 404 trắng) — dữ kiện cho C6.
</verification>

<success_criteria>

- `apps/2025` chỉ còn 2 locale vi-VN + en-US ở mọi tầng: config (lingui.config.js), catalog (locales/ còn 2 thư mục), UI (dropdown 2 option), map hiển thị (dayjs, timeline) — grep gate = 0.
- Lingui còn nguyên vẹn, không đổi engine, không gỡ gói nào — đúng ranh giới phase (D-01).
- Build xanh trên PowerShell, cả 2 URL locale sống, fallback Accept-Language hoạt động — main vẫn deploy được lên Vercel ngay sau merge.
- C6 được mở khóa với đúng 2 catalog phải port và 1 nguồn sự thật locale list duy nhất.
  </success_criteria>

<output>
Commit: `feat(2025): trim locales to vi-VN + en-US` (1 commit cho cả plan)
Sau khi xong: viết C04-01-SUMMARY.md cạnh plan này (nhớ ghi hành vi thực tế của URL locale cũ theo D-09 + các lựa chọn "Claude tự quyết") + cập nhật STATE.md + tick checkbox Phase C4 trong ROADMAP.md (1/1).
</output>
