---
phase: C05-2025-drop-contentlayer
plan: 02
type: execute
wave: 2
depends_on: [C05-01]
files_modified:
  - apps/2025/src/app/[lang]/(page)/blog/[...slug]/page.tsx
  - apps/2025/src/components/templates/layout-renderer.tsx # XÓA
  - apps/2025/src/components/mdx-components.tsx # dọn phần trùng @portfolio/mdx
  - apps/2025/src/css/ # style code block sang data-attrs pretty-code nếu còn selector prism
autonomous: true
requirements: [REQ-01, REQ-02, REQ-10]
must_haves:
  truths:
    - 'Bài viết render qua <MDXContent> RSC — bundle client trang blog không chứa nội dung MDX compiled'
    - '3 layout PostLayout/PostSimple/PostBanner chọn qua map tĩnh, new Function biến mất'
  artifacts:
    - 'layout-renderer.tsx đã xóa; page [...slug] dùng mẫu M-02'
  key_links:
    - 'Image atom 2025 (có zoom) truyền qua prop components của MDXContent — override hoạt động'
---

<objective>
Thay renderer bài viết: `body.code` (compile client-side của contentlayer) → `<MDXContent source>` RSC của `@portfolio/mdx`; xóa `new Function` trong layout-renderer (D-03). Sau plan này contentlayer không còn ai đọc ngoài scripts.
</objective>

<context>
@docs/plans/phases/C05-2025-drop-contentlayer/C05-CONTEXT.md
@docs/plans/phases/C03-mdx-package/C03-CONTEXT.md
@apps/2025/src/components/templates/layout-renderer.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Page [...slug] sang MDXContent + map layout tĩnh</name>
  <files>apps/2025/src/app/[lang]/(page)/blog/[...slug]/page.tsx, apps/2025/src/components/templates/layout-renderer.tsx</files>
  <action>Viết lại page theo mẫu M-02 (D-03): getPost(slug, mapLocale(lang)) từ eo biển; map tĩnh layouts 3 template; prev/next tính từ getAllPosts như logic cũ; authors detail từ getAllAuthors; generateStaticParams từ getAllSlugs; generateMetadata dùng post.summary + getStructuredData (D-02). Render <MDXContent source={post.content} components={{ Image, ...overrides đặc thù }} /> làm children của Layout. XÓA layout-renderer.tsx — grep tên nó toàn src xác nhận 0 importer còn lại.</action>
  <verify>grep -rn "new Function\|layout-renderer" apps/2025/src | wc -l = 0; grep -rl "contentlayer/generated" apps/2025/src | wc -l = 0; pnpm --filter web-2025 typecheck thoát 0</verify>
  <done>src/ sạch contentlayer + new Function; bài viết render RSC.</done>
</task>

<task type="auto">
  <name>Task 2: Dọn mdx-components + CSS code block</name>
  <files>apps/2025/src/components/mdx-components.tsx, apps/2025/src/css/</files>
  <action>Theo D-11: trong mdx-components của 2025, xóa component đã có bản trong @portfolio/mdx (Pre/CopyButton, CodeTitle, TableWrapper — đối chiếu export của packages/mdx/src/components), GIỮ override đặc thù (Image zoom, custom link…) và gom thành object truyền vào prop components ở Task 1. CSS: grep selector prism cũ (.token, .code-highlight, .line-number) trong apps/2025/src/css — thay bằng selector data-attrs pretty-code theo mẫu M-04 của C03-CONTEXT nếu styles.css của @portfolio/mdx chưa phủ; tránh style trùng lặp 2 nguồn (ưu tiên package, app chỉ override màu qua token).</action>
  <verify>pnpm build --filter=web-2025 (PowerShell) thoát 0; grep -rn "\.token\b" apps/2025/src/css | wc -l = 0</verify>
  <done>Không còn double-source component/CSS; build xanh.</done>
</task>

</tasks>

<verification>
Dev :3001 mở `kien-truc-react-fiber`: highlight dual-theme đổi theo dark/light, code title, copy button, KaTeX, TOC khớp heading, reading time, authors panel, prev/next — so bằng mắt với bản production hiện tại (không cần user, executor tự đối chiếu; user duyệt ở plan 04). View-source: HTML bài viết đầy đủ (RSC), không còn payload body.code.
</verification>

<success_criteria>
Renderer mới tương đương bằng-hoặc-hơn bản cũ trên bài giàu format nhất; kiến trúc render thống nhất với 2026.
</success_criteria>

<output>
Commit (branch c5-drop-contentlayer): `feat(2025): render posts via @portfolio/mdx RSC, drop new Function layout renderer`
Sau khi xong: viết C05-02-SUMMARY.md.
</output>
