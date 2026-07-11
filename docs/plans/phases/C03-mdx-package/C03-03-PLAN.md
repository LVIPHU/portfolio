---
phase: C03-mdx-package
plan: 03
type: execute
wave: 3
depends_on: [C03-02]
files_modified:
  - apps/2026/src/app/[locale]/blog/[slug]/page.tsx
  - apps/2026/src/app/[locale]/blog/layout.tsx
  - apps/2026/next.config.ts
  - apps/2026/src/app/globals.css
  - apps/2026/package.json
  - packages/content/blog/portfolio-monorepo.vi.mdx
  - pnpm-lock.yaml
autonomous: false
requirements: [REQ-02, REQ-10]
must_haves:
  truths:
    - 'Bài kien-truc-react-fiber trên :3000 render qua @portfolio/mdx: dual-theme code block đổi theo dark/light, code title, copy button, anchor heading, KaTeX'
    - '<Callout type="pitfall"> render đúng, đủ 4 biến thể demo được'
    - 'Ảnh trong bài có width/height — không CLS'
    - 'Build web-2025 vẫn xanh (không vỡ do hoisting deps)'
  artifacts:
    - 'apps/2026/src/app/[locale]/blog/layout.tsx (mới — import KaTeX css route-scoped)'
    - 'packages/content/blog/portfolio-monorepo.vi.mdx có demo Callout 4 biến thể'
  key_links:
    - 'blog/[slug]/page.tsx dùng MDXContent từ @portfolio/mdx thay MDXRemote trần'
    - 'next.config.ts transpilePackages chứa @portfolio/mdx; globals.css có @source packages/mdx/src + import styles.css của package'
---

<objective>
Nối 2026 vào `@portfolio/mdx`: thay renderer trần bằng `<MDXContent>`, khai transpile/`@source`/styles, KaTeX css scope route blog, thêm demo Callout vào bài thật, rồi user nghiệm thu bằng mắt theo checklist của phase. Đây là gate cuối C3 — xong plan này, C5 (2025 tiêu thụ) và C11 (Sandpack) được mở khóa. Rollback theo D-17: revert 3 file 2026 là quay lại renderer cũ, package không ai khác import.
</objective>

<context>
@docs/plans/phases/C03-mdx-package/C03-CONTEXT.md
@apps/2026/src/app/[locale]/blog/[slug]/page.tsx
@apps/2026/next.config.ts
@apps/2026/src/app/globals.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Wire 2026 vào @portfolio/mdx (page, next.config, globals.css, katex route-scoped)</name>
  <files>apps/2026/src/app/[locale]/blog/[slug]/page.tsx, apps/2026/src/app/[locale]/blog/layout.tsx, apps/2026/next.config.ts, apps/2026/src/app/globals.css, apps/2026/package.json, pnpm-lock.yaml</files>
  <action>Thi hành D-15 đủ 4 điểm: (1) apps/2026 package.json thêm dep workspace `@portfolio/mdx` + dep `katex` (cùng version với packages/mdx — pnpm strict không hoist, import css từ app sẽ fail nếu thiếu), pnpm install; (2) blog/[slug]/page.tsx: gỡ import MDXRemote từ next-mdx-remote/rsc (dòng 5) và thay lời gọi trần ở khối prose (dòng 59) bằng MDXContent import từ @portfolio/mdx với source={post.content} — không truyền components override ở bước này (defaultMdxComponents đã có img fallback theo D-12; override next/image là việc tối ưu sau); rủi ro next-mdx-remote@6 + Next 16: thấp theo D-09, 2026 đã chạy bản 6 từ trước; (3) next.config.ts: transpilePackages thành 3 phần tử thêm '@portfolio/mdx' (REQ-10); (4) globals.css: thêm dòng @source '../../../../packages/mdx/src'; ngay dưới @source của packages/ui, và @import '@portfolio/mdx/styles.css' (CSS code block đi theo data-attrs pretty-code trong styles.css của package — 2026 không có CSS prism cũ nào phải chuyển, đã xác minh trong code_context). Thi hành D-16: tạo mới apps/2026/src/app/[locale]/blog/layout.tsx — layout tối giản chỉ import 'katex/dist/katex.min.css' và return children, để +23KB KaTeX css chỉ tải ở route blog, KHÔNG đưa vào globals.</action>
  <verify>pnpm install && pnpm build --filter=web-2026 && grep -c "@portfolio/mdx" apps/2026/next.config.ts (kỳ vọng 1) && grep -c "packages/mdx/src" apps/2026/src/app/globals.css (kỳ vọng 1) && grep -c "katex/dist/katex.min.css" apps/2026/src/app/globals.css | grep -x 0 (KHÔNG có trong globals — D-16) && grep -rn "MDXRemote" apps/2026/src --include="*.tsx" | wc -l (kỳ vọng 0 — renderer trần đã gỡ hết)</verify>
  <done>Build web-2026 xanh với blog render qua @portfolio/mdx; transpile/@source/styles/katex đúng vị trí đã khóa; không còn MDXRemote gọi trực tiếp trong app.</done>
</task>

<task type="auto">
  <name>Task 2: Demo Callout 4 biến thể vào bài thật + build chéo 2 app</name>
  <files>packages/content/blog/portfolio-monorepo.vi.mdx</files>
  <action>Thêm vào cuối portfolio-monorepo.vi.mdx một mục demo ngắn (heading tiếng Việt) chứa đủ 4 thẻ Callout theo D-11 — note, pitfall, deep-dive, wip — mỗi thẻ 1-2 câu nội dung thật liên quan monorepo (không lorem ipsum), để test component trực tiếp ngoài đường alert [!NOTE] của remark (Success Criteria 2 của phase yêu cầu đúng 4 biến thể). Sau đó chạy build chéo xác nhận hoisting deps mới không phá 2025: pnpm build --filter=web-2026 (bài sửa vẫn SSG được) và pnpm build --filter=web-2025 — lệnh 2025 BẮT BUỘC chạy từ PowerShell, không Git Bash (bug contentlayer PWD, xem STATE.md — 2025 chưa đụng tới @portfolio/mdx ở phase này, build chỉ để xác nhận không vỡ).</action>
  <verify>grep -c "Callout" packages/content/blog/portfolio-monorepo.vi.mdx (kỳ vọng >= 4) && grep -c "pitfall\|deep-dive\|wip" packages/content/blog/portfolio-monorepo.vi.mdx (kỳ vọng >= 3) && pnpm build --filter=web-2026 && pnpm build --filter=web-2025 (từ PowerShell)</verify>
  <done>Bài demo chứa đủ 4 biến thể Callout; cả 2 app build xanh.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: User nghiệm thu render MDX trên :3000 bằng mắt</name>
  <action>Chạy pnpm dev:2026, mở http://localhost:3000/blog/kien-truc-react-fiber (bài giàu format nhất) và http://localhost:3000/blog/portfolio-monorepo, đối chiếu checklist gate của phase: (1) code block dual theme — bấm toggle dark/light thấy theme code đổi theo (github-dark-dimmed ↔ solarized-light), block có tên file từ code-titles, bấm copy button thấy trạng thái copied và clipboard đúng nội dung; (2) heading có anchor icon prepend, click ra đúng URL #id; (3) blockquote [!NOTE] render alert; 4 thẻ Callout demo hiện đúng 4 biến thể, deep-dive bấm mở/đóng được (details/summary); (4) công thức toán (nếu bài có) render KaTeX, không thấy source TeX thô; (5) ảnh trong bài không nhảy layout — mở devtools Performance/Layout Shift hoặc quan sát khi reload, ảnh phải có width/height attr trong Elements; (6) smartypants: dấu ba chấm gõ tay trong đoạn văn hiển thị thành ký tự …; (7) view-source thấy HTML bài viết đầy đủ (RSC render, 0 hydration cho nội dung).</action>
  <verify>User xác nhận OK</verify>
  <done>User thấy đủ 7 mục: dual-theme + code title + copy button hoạt động; anchor heading đúng #id; alert và 4 biến thể Callout đúng; KaTeX render; ảnh không CLS; smartypants ăn; view-source có HTML đầy đủ.</done>
</task>

</tasks>

<verification>
- `pnpm typecheck` root xanh; `pnpm build --filter=web-2026` xanh; `pnpm build --filter=web-2025` xanh (chạy từ PowerShell — bug contentlayer PWD còn tới hết C5).
- `grep -rn "MDXRemote" apps/2026/src --include="*.tsx" | wc -l` = 0.
- `grep -c "transpilePackages" apps/2026/next.config.ts` = 1 và dòng đó chứa đủ 3 package @portfolio.
- Checkpoint Task 3 được user xác nhận đủ 7 mục.
- Nếu phải rollback: revert blog page + next.config.ts + globals.css của 2026 theo D-17 (blog/layout.tsx và demo Callout xóa kèm).
</verification>

<success_criteria>
Khớp Success Criteria phase C3 trong ROADMAP:

1. Bài `kien-truc-react-fiber` trên :3000: dual-theme code block đổi theo dark/light, code title, copy button, anchor heading, KaTeX — user đã xác nhận mắt thấy.
2. `<Callout type="pitfall">` render đúng, đủ 4 biến thể trong bài demo.
3. Ảnh trong bài có width/height — không CLS.
   Kèm gate kỹ thuật: cả 2 app build xanh, 2026 không còn renderer MDX trần, C5/C11 sẵn sàng mở khóa.
   </success_criteria>

<output>
Commit: `feat(2026): render blog via @portfolio/mdx pipeline and components (C3)` (1 commit cho cả plan)
Sau khi xong: viết C03-03-SUMMARY.md cạnh plan này + cập nhật STATE.md (C3 done, next C4/C5) + tick checkbox ROADMAP.md
</output>
