# Phase C11: Sandpack playground — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Code playground sống trong bài viết (kiểu react.dev) cho CẢ 2 app: `<Sandpack>` trong `@portfolio/mdx` — block fence con bên trong thành file của sandbox, chạy/sửa được. Kèm 1 bài blog demo. KHÔNG port từ react.dev: pipeline compileMDX VM, CodeMirror highlight tự chế, DocSearch, satori OG (quyết định bỏ từ master plan).
</domain>

<decisions>
## Quyết định đã khóa

- **D-01:** Pin `@codesandbox/sandpack-react@~2.20` (cadence release chậm — không dựa API mới hơn).
- **D-02:** Lazy 2 tầng: (1) `next/dynamic ssr:false` sau ranh giới `'use client'` — bundle Sandpack (~200KB+) tách chunk, không vào SSR; (2) `initMode="user-visible"` + `initModeObserverOptions={{ rootMargin: '1400px 0px' }}` (số của react.dev) — bundler sandbox chỉ boot khi cuộn gần.
- **D-03:** Server shim / client core: `<Sandpack>` xuất hiện trong map component server-safe của defaultMdxComponents; phần nặng nằm sau dynamic — renderer RSC của C3 không đổi.
- **D-04:** Fence-as-file DSL (pattern react.dev): fence con ` ```js src/App.js active ` → file `/src/App.js` tab active; meta `hidden`/`readOnly` tương tự; 1 fence không tên → `/App.js`. Fence meta lạ không parse được → bỏ qua + console.warn tên bài (không crash build).
- **D-05:** Theme từ CSS var semantic (`var(--color-background)`…) trong object SandpackTheme — tự ăn dark/light từng app, không hardcode 2 bảng màu.
- **D-06:** `<SandpackSkeleton>` giữ chiều cao ước tính khi chờ mount — không CLS.
- **D-07:** CSP 2025 phải mở cho sandbox: thêm `*.codesandbox.io` vào `frame-src` + `connect-src` — sửa có chủ đích, ghi trong commit message.
- **D-08:** Bài demo `playground-demo.{vi,en}.mdx` trong packages/content/blog — vừa content thật vừa fixture test lâu dài: 1 Sandpack React counter (App.js + styles.css hidden) + 1 code block thường đối chứng.
- **D-09:** Gate lazy bằng Network tab: trang blog KHÔNG dùng Sandpack → 0 chunk sandpack; bài demo → chunk chỉ load khi cuộn gần block.

### Claude tự quyết

- Chiều cao skeleton mặc định; template sandbox mặc định (react hay vanilla) khi fence không chỉ định.
- Nội dung văn bản bài demo (song ngữ tự nhiên).
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

**M-01 — Cấu trúc file trong packages/mdx:**

```
src/components/sandpack/
├── index.tsx          # server shim: parse children fences → dynamic client
├── sandpack-client.tsx # 'use client' + next/dynamic ssr:false + skeleton
├── sandpack-root.tsx   # SandpackProvider thật (chunk tách)
├── create-file-map.ts  # React.Children → { '/App.js': { code, hidden, active, readOnly } }
└── themes.ts           # CSS var → SandpackTheme
```

**M-02 — sandpack-client.tsx:**

```tsx
'use client'
import dynamic from 'next/dynamic'
const SandpackRoot = dynamic(() => import('./sandpack-root'), {
  ssr: false,
  loading: () => <SandpackSkeleton />,
})
```

**M-03 — Cách viết Sandpack trong MDX (đưa vào bài demo):**

````md
<Sandpack>

```js src/App.js active
export default function App() { ... }
```

```css styles.css hidden
button { ... }
```

</Sandpack>
````

</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` §Phase C11 — goal, REQ-08/REQ-02, 2 success criteria
- `docs/plans/phases/C03-mdx-package/C03-CONTEXT.md` — kiến trúc defaultMdxComponents + quy tắc server/client mà Sandpack phải khớp
- `apps/2025/next.config.ts` — CSP hiện tại (frame-src giscus.app; connect-src * — kiểm thật trước khi sửa D-07)
- Sandpack docs 2.x: initMode, SandpackTheme — đối chiếu API bản ~2.20
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts)

- `@portfolio/mdx` (C3): defaultMdxComponents map + MDXContent RSC — Sandpack chỉ là 1 entry mới trong map.
- CSP 2025 (next.config.ts): `connect-src *` (đã mở), `frame-src giscus.app` (PHẢI thêm codesandbox — D-07 chủ yếu là frame-src). 2026 chưa có CSP headers — không phải sửa.
- React 19.2: sandpack-react 2.20 đã hỗ trợ React 19; nếu pnpm warning peer → override + test hành vi thật.
- Cả 2 app cùng render qua MDXContent sau C5 → 1 component mới = 2 app nhận (REQ-10 hoạt động).
  </code_context>

<deferred>
## Ý tưởng hoãn

- TerminalBlock/ConsoleBlock nâng cao nếu C3 chưa đủ — backlog
- Playground template Next.js server components (Sandpack chưa hỗ trợ tốt) — backlog theo dõi upstream
- Port satori OG image — KHÔNG (quyết định bỏ)
</deferred>

---

_Phase: C11-sandpack_
