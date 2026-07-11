# C4 — apps/2025: thu gọn 6 locale → vi-VN + en-US (giữ Lingui tạm thời)

> **Phụ thuộc:** không (chạy được song song C2/C3, miễn xong trước C6). **Chặn:** C6 (giảm 2/3 khối lượng port).
> **Ước lượng:** ~1h. **Commit:** `feat(2025): trim locales to vi-VN + en-US`

## 1. Mục tiêu & phạm vi

Giảm bề mặt i18n của 2025 từ 6 locale (vi-VN, en-US, ja-JP, ko-KR, zh-CN, zh-TW) xuống 2, **trước khi** port sang next-intl ở C6 — port 2 catalog thay vì 6. Vẫn giữ Lingui nguyên vẹn ở phase này (đổi engine là việc của C6, không trộn).

## 2. Hiện trạng

- Catalog: `apps/2025/src/i18n/locales/{vi-VN,en-US,ja-JP,ko-KR,zh-CN,zh-TW}/messages.po`.
- Cấu hình locale nằm rải ở: `lingui.config` (root app), `src/i18n/i18n.ts` (danh sách locale + match), `src/proxy|middleware` (negotiator đàm phán locale), `src/components/molecules/locale-switch.tsx` (6 option UI), `generateStaticParams` của `[lang]` layout.

## 3. Hướng code chi tiết

1. **`lingui.config.ts`**: `locales: ['vi-VN', 'en-US']`, giữ `sourceLocale`/`fallbackLocales` như cũ (fallback về en-US).
2. **`src/i18n/i18n.ts`**: thu mảng locale/labels về 2; rà mọi map cứng (`LOCALE_LABELS`, flag icon…) xóa 4 entry.
3. **Middleware/negotiator**: danh sách locale được đàm phán chỉ còn 2 — user ja/ko/zh sẽ rơi về fallback (chấp nhận, đó là mục đích).
4. **`locale-switch.tsx`**: còn 2 option. Nếu UI switch là dropdown 6 dòng, giữ nguyên component, chỉ dữ liệu ngắn lại.
5. **Xóa 4 thư mục catalog** `ja-JP/ ko-KR/ zh-CN/ zh-TW/`.
6. `pnpm --filter web-2025 lingui:extract && pnpm --filter web-2025 lingui:compile` — regenerate 2 catalog còn lại sạch sẽ.
7. Rà `generateStaticParams`/`sitemap.ts`: chỉ sinh route cho 2 locale.

## 4. Design pattern

- **Single source of truth cho locale list**: nếu bước 2 phát hiện danh sách locale bị lặp ở >2 chỗ, gom về 1 export trong `i18n.ts` và các chỗ khác import — C6 sẽ đổi đúng 1 chỗ.
- **Shrink before migrate**: nguyên tắc chung của cả kế hoạch C — thu nhỏ bề mặt trước khi đổi công nghệ, không làm 2 việc trong 1 commit.

## 5. Testing & gate nghiệm thu

1. `grep -r "ja-JP\|ko-KR\|zh-CN\|zh-TW" apps/2025 --include="*.ts*"` = **0 kết quả** (ngoài git history).
2. Build web-2025 (PowerShell) xanh; số route static giảm tương ứng (log build: mỗi page còn 2 biến thể lang).
3. Smoke `:3001`: `/vi-VN` + `/en-US` chạy, switch locale 2 chiều OK; gõ tay `/ja-JP/about` → redirect/fallback về locale mặc định chứ không 404 trắng (hành vi middleware hiện tại quyết định — ghi nhận lại hành vi thực tế để C6 tái lập).
4. `Accept-Language: ja` request → nhận vi-VN (fallback), không crash negotiator.

## 6. Rủi ro & rollback

| Rủi ro                                                                | Phòng bị                                                                                                                   |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Còn tham chiếu cứng locale đã xóa (import `.po` trực tiếp, flag icon) | grep gate ở trên bắt được; sửa tới khi 0                                                                                   |
| SEO mất URL ja/ko/zh đã index                                         | các URL đó gần như không có traffic (site cá nhân); C6 sẽ thêm redirect tổng về locale mới — chấp nhận 404 tạm trong C4–C5 |

Rollback: revert 1 commit — catalog .po nằm trong git, khôi phục nguyên trạng.
