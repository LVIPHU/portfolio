# C11 — Sandpack playground trong @portfolio/mdx + bài demo

> **Phụ thuộc:** C3 (packages/mdx). 2025 hưởng qua C5 (đã cùng renderer).
> **Ước lượng:** ~3–4h. **Commit:** `feat(mdx): sandpack live playground + demo post`

## 1. Mục tiêu & phạm vi

Code playground sống trong bài viết (kiểu react.dev) cho **cả 2 app**: block ` ```js ` con bên trong `<Sandpack>` thành file của sandbox, chạy được, sửa được. Pin `@codesandbox/sandpack-react@~2.20` (cadence release chậm — không dựa API mới hơn). **Không port** từ react.dev: pipeline compileMDX VM, CodeMirror highlight tự chế, DocSearch, satori OG.

## 2. Cấu trúc file đích

```
packages/mdx/src/
├── components/
│   ├── sandpack/
│   │   ├── index.tsx          # <Sandpack> server shim: parse children fences → dynamic client
│   │   ├── sandpack-client.tsx # 'use client' + next/dynamic ssr:false
│   │   ├── create-file-map.ts  # fence con → { '/App.js': { code, hidden, active, readOnly } }
│   │   └── themes.ts           # map token app → SandpackTheme (light/dark)
│   └── index.ts                # defaultMdxComponents += Sandpack
└── client.ts                   # re-export phần client
```

## 3. Hướng code chi tiết

### 3.1 create-file-map.ts (pattern react.dev)

Children của `<Sandpack>` trong MDX là các `<pre><code meta>`. Parse meta fence:

````
```js src/App.js active     → file /src/App.js, tab active
```css styles.css hidden    → file ẩn
````

Đi qua React.Children, đọc `className` (`language-js`) + `metastring` → build `files` record. Default entry nếu chỉ có 1 fence không tên: `/App.js`.

### 3.2 Client component + lazy 2 tầng

```tsx
// sandpack-client.tsx
'use client'
import dynamic from 'next/dynamic'
const SandpackRoot = dynamic(() => import('./sandpack-root'), { ssr: false, loading: () => <SandpackSkeleton /> })
```

- Tầng 1: `next/dynamic ssr:false` — bundle Sandpack (~200KB+) tách chunk, không vào SSR.
- Tầng 2: `initMode="user-visible"` + `initModeObserverOptions={{ rootMargin: '1400px 0px' }}` (số của react.dev) — bundler sandbox chỉ khởi động khi user cuộn gần.
- `<SandpackSkeleton>` giữ đúng chiều cao ước tính (tránh CLS khi mount).

### 3.3 Theme

`themes.ts` build `SandpackTheme` từ CSS var semantic (`var(--color-background)`…) — Sandpack nhận string CSS var trực tiếp trong theme object → tự ăn theo dark/light của từng app, không hardcode 2 bảng màu.

### 3.4 Bài demo

Viết `packages/content/blog/playground-demo.vi.mdx` (+ bản en) — bài ngắn giới thiệu playground: 1 `<Sandpack>` React counter (App.js + styles.css hidden), 1 block thường để đối chứng. Đây vừa là content thật vừa là fixture test lâu dài.

## 4. Design pattern áp dụng

- **Progressive enhancement 2 tầng lazy**: trang không có Sandpack → 0 byte; có nhưng chưa cuộn tới → chỉ skeleton; cuộn gần → mới boot. Chi phí đúng chỗ dùng.
- **Server shim / client core**: `<Sandpack>` xuất hiện trong map component server-safe, phần nặng nằm sau ranh giới `'use client'` + dynamic — renderer RSC của C3 không đổi.
- **Fence-as-file DSL**: tái dùng cú pháp Markdown sẵn có (fence + meta) làm nguồn file sandbox — không phát minh cú pháp mới, editor nào cũng highlight được.

## 5. Testing & gate nghiệm thu

1. Build + typecheck cả 2 xanh.
2. `:3000` bài demo: playground chạy, sửa code → preview cập nhật, dark mode đổi theme editor; `:3001` cùng bài (qua fallback locale nếu chưa dịch) chạy tương tự.
3. **Verify lazy đúng cam kết** (Network tab): trang blog KHÔNG có Sandpack → không chunk sandpack nào; bài demo → chunk chỉ load khi cuộn gần block.
4. Bài không dùng Sandpack render như cũ (regression pipeline C3).
5. Push → 2 deploy xanh.

## 6. Rủi ro & rollback

| Rủi ro                                                           | Phòng bị                                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Sandpack bundler cần kết nối tới codesandbox CDN — CSP 2025 chặn | thêm `frame-src`/`connect-src` cho `*.codesandbox.io` vào CSP header 2025 (sửa có chủ đích, ghi trong commit) |
| sandpack-react đụng React 19.2 peer warning                      | 2.20 đã hỗ trợ React 19; warning peer thì override pnpm, test hành vi thật                                    |
| MDX children parse lệch khi fence có meta lạ                     | create-file-map bỏ qua fence không parse được + console.warn tên file bài viết                                |

Rollback: gỡ export `Sandpack` khỏi component map + xóa bài demo — không app nào khác phụ thuộc.
