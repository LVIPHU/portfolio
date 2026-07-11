---
phase: C03-mdx-package
plan: 01
type: execute
wave: 1
depends_on: [C02-03]
files_modified:
  - packages/mdx/package.json
  - packages/mdx/tsconfig.json
  - packages/mdx/src/index.ts
  - packages/mdx/src/pipeline.ts
  - packages/mdx/src/toc.ts
  - packages/mdx/src/remark/code-titles.ts
  - packages/mdx/src/remark/img-to-jsx.ts
  - packages/mdx/src/remark/header-ids.ts
  - pnpm-lock.yaml
autonomous: true
requirements: [REQ-02, REQ-10]
must_haves:
  truths:
    - 'pnpm --filter @portfolio/mdx typecheck xanh'
    - 'pipeline.ts export remarkPlugins/rehypePlugins đúng thành phần D-05/D-06: có smartypants + dual-theme pretty-code keepBackground false; KHÔNG có prism-plus/preset-minify/citation/extract-frontmatter'
    - 'extractTocHeadings chạy trên raw MDX string trả mảng {value, url, depth}'
    - '4 bài blog trong packages/content/blog đã được kiểm meta fence tương thích cú pháp pretty-code {1,3}'
  artifacts:
    - 'packages/mdx/package.json (exports 3 entry theo D-01)'
    - 'packages/mdx/tsconfig.json extends ../../tsconfig.base.json'
    - 'packages/mdx/src/pipeline.ts, toc.ts, remark/code-titles.ts, remark/img-to-jsx.ts, remark/header-ids.ts'
  key_links:
    - 'packages/mdx/src/index.ts re-export pipeline + toc (barrel server-safe, components vào ở plan 02)'
    - 'pnpm install resolve @portfolio/mdx trong workspace không lỗi'
---

<objective>
Dựng khung package `@portfolio/mdx` (package.json, tsconfig, deps) và phần lõi không-UI: `pipeline.ts` (1 nguồn sự thật remark/rehype cho cả 2 app), `toc.ts`, và 3 remark plugin port từ 2025. Output: package typecheck xanh, pipeline đúng thành phần đã khóa, sẵn sàng cho plan 02 đắp components lên.
</objective>

<context>
@docs/plans/phases/C03-mdx-package/C03-CONTEXT.md
@apps/2025/contentlayer.config.ts
@apps/2025/src/libs/remark/remark-code-titles.ts
@apps/2025/src/libs/remark/remark-img-to-jsx.ts
@apps/2025/src/libs/remark/remark-toc-headings.ts
@packages/ui/package.json
@packages/ui/tsconfig.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Scaffold packages/mdx (package.json + tsconfig + barrel stub) và cài deps</name>
  <files>packages/mdx/package.json, packages/mdx/tsconfig.json, packages/mdx/src/index.ts, pnpm-lock.yaml</files>
  <action>Tạo `packages/mdx` theo cấu trúc đích mẫu M-04 trong CONTEXT. `package.json`: name `@portfolio/mdx`, private, type module, theo D-01 khai exports đủ 3 entry — `.` trỏ `./src/index.ts`, `./client` trỏ `./src/client.ts`, `./styles.css` trỏ `./src/styles.css` (client.ts và styles.css sinh ở plan 02, khai trước không sao vì exports chỉ resolve lúc import); script `typecheck: tsc --noEmit`; peer `react ^19` + `next >=16`. Deps theo D-03: next-mdx-remote@^6, remark-gfm, remark-math, remark-smartypants, remark-github-blockquote-alert, rehype-slug, rehype-autolink-headings, rehype-katex, rehype-pretty-code, katex, probe-image-size, unist-util-visit, github-slugger, hast-util-from-html-isomorphic, mdast-util-to-string, cộng `remark` + `unified` (code port import trực tiếp — lý do trong D-03); các gói đã có ở apps/2025 thì neo cùng version major (bảng version trong code_context của CONTEXT), gói mới lấy latest ổn định và ghi lại cho SUMMARY. devDeps: typescript ^5.6, @types/react ^19, @types/unist, @types/probe-image-size, @types/node. TUYỆT ĐỐI KHÔNG thêm rehype-prism-plus / rehype-preset-minify / rehype-citation theo D-04 — chúng bị bỏ có chủ đích (chồng chéo pretty-code / RSC không cần / 0 bài dùng). `tsconfig.json` chép pattern packages/ui: extends ../../tsconfig.base.json, jsx react-jsx, include ["src"]. `src/index.ts` tạm là barrel rỗng có export type placeholder để tsc có input. Chạy `pnpm install` ở root.</action>
  <verify>pnpm install && pnpm --filter @portfolio/mdx typecheck && grep -c "\"./client\"\|\"./styles.css\"" packages/mdx/package.json (kỳ vọng 2) && grep -rn "rehype-prism-plus\|rehype-preset-minify\|rehype-citation" packages/mdx/package.json | wc -l (kỳ vọng 0 — JSON không có comment nên gate 0 hợp lệ)</verify>
  <done>Package resolve trong workspace, typecheck xanh, exports 3 entry, deps đúng danh sách D-03 và sạch bóng 3 gói bị bỏ theo D-04.</done>
</task>

<task type="auto">
  <name>Task 2: Port 3 remark plugin + toc.ts từ apps/2025</name>
  <files>packages/mdx/src/remark/code-titles.ts, packages/mdx/src/remark/img-to-jsx.ts, packages/mdx/src/remark/header-ids.ts, packages/mdx/src/toc.ts</files>
  <action>Port theo D-05 và D-13, đọc file nguồn trong context trước khi viết. `remark/code-titles.ts`: port nguyên logic `remarkCodeTitles` từ apps/2025/src/libs/remark/remark-code-titles.ts — fence lang:tên-file tách thành node mdxJsxFlowElement tên `CodeTitle` attrs lang/title rồi gán lại node.lang; giữ tên export `remarkCodeTitles`. `remark/img-to-jsx.ts`: port `remarkImgToJsx` từ remark-img-to-jsx.ts — probe-image-size sync trên đường dẫn public + url (chỉ file local tồn tại), sinh node `Image` attrs alt/src/width/height, đổi paragraph thành div tránh nesting error; đây là mấu chốt "ảnh có width/height, không CLS" của success criteria phase. `remark/header-ids.ts`: viết mới theo D-05 — port Ý TƯỞNG react.dev cho heading id tường minh qua comment dạng custom-id trong heading (không có code nguồn 2025, tự viết bằng unist-util-visit + github-slugger). `toc.ts`: port `extractTocHeadings` + type `Toc`/`TocItem` từ remark-toc-headings.ts theo D-13 — hàm thuần nhận raw MDX string trả Promise mảng {value, url, depth}; giữ nguyên logic strip HTML tag trong text heading. KHÔNG port remark-extract-frontmatter.ts theo D-04 (gray-matter đã tách frontmatter từ C2). Sửa các @ts-ignore của code cũ bằng type đúng nếu nhanh, giữ nguyên nếu tốn thời gian — không đổi hành vi.</action>
  <verify>pnpm --filter @portfolio/mdx typecheck && grep -rn "export" packages/mdx/src/remark --include="*.ts" | grep -c "remarkCodeTitles\|remarkImgToJsx\|remarkHeaderIds" (kỳ vọng >= 3) && grep -c "extractTocHeadings" packages/mdx/src/toc.ts (kỳ vọng >= 1) && grep -rn "extract-frontmatter\|remarkExtractFrontmatter" packages/mdx/src | wc -l (kỳ vọng 0 — file mới toàn code tự viết, không có comment nhắc tên này)</verify>
  <done>3 plugin + extractTocHeadings compile xanh, cùng chữ ký/hành vi bản 2025, không có dấu vết extract-frontmatter.</done>
</task>

<task type="auto">
  <name>Task 3: pipeline.ts + cập nhật barrel + kiểm meta fence 4 bài</name>
  <files>packages/mdx/src/pipeline.ts, packages/mdx/src/index.ts</files>
  <action>Viết `pipeline.ts` theo mẫu M-01 trong CONTEXT và D-02 (pipeline as data — 2 mảng PluggableList export thuần, app chỉ import): remark theo D-05 (thứ tự gfm → math → smartypants → alert → codeTitles → imgToJsx; vị trí remarkHeaderIds tự quyết theo mục Claude tự quyết, ghi vào SUMMARY), rehype theo D-06 — trong đó `anchorIcon` dựng bằng hast-util-from-html-isomorphic với NGUYÊN VĂN SVG heroicon từ apps/2025/contentlayer.config.ts dòng 35-45 (span class content-header-link), rehypeAutolinkHeadings behavior prepend + headingProperties className content-header, rehypePrettyCode theme dual github-dark-dimmed/solarized-light + keepBackground false (nền ăn theo token app theo D-06). Cập nhật `index.ts` thành barrel server-safe: re-export remarkPlugins, rehypePlugins, extractTocHeadings, type Toc/TocItem, và 3 remark plugin. Cuối cùng thi hành D-08: grep toàn bộ fence có meta line-highlight trong packages/content/blog (4 bài port từ 2025 sau C2) — pretty-code cùng cú pháp {1,3} với prism-plus; nếu gặp cú pháp chỉ prism-plus hiểu thì sửa fence ngay trong MDX (được phép vì bài đã thuộc packages/content; nếu phải sửa, thêm file đó vào files_modified của SUMMARY).</action>
  <verify>pnpm --filter @portfolio/mdx typecheck && grep -c "remarkSmartypants" packages/mdx/src/pipeline.ts (kỳ vọng >= 1) && grep -c "keepBackground" packages/mdx/src/pipeline.ts (kỳ vọng 1) && grep -c "extractTocHeadings\|remarkPlugins\|rehypePlugins" packages/mdx/src/index.ts (kỳ vọng >= 3) && grep -rnE '^`{3}\S*\s*\{' packages/content/blog --include="*.mdx" (chạy để LIỆT KÊ meta fence — kết quả được phép > 0, executor đối chiếu bằng mắt cú pháp {n,m} hợp lệ pretty-code)</verify>
  <done>pipeline.ts export 2 mảng đúng thành phần D-05/D-06, barrel index.ts phủ pipeline + toc, meta fence 4 bài đã rà và tương thích pretty-code.</done>
</task>

</tasks>

<verification>
- `pnpm --filter @portfolio/mdx typecheck` xanh.
- `pnpm typecheck` root xanh (package mới không phá các package khác).
- `grep -rn "rehype-prism-plus\|rehype-preset-minify\|rehype-citation" packages/mdx | wc -l` = 0 (D-04).
- `grep -rn "use client" packages/mdx/src --include="*.ts" | wc -l` = 0 (plan này chưa có client code — island chỉ vào ở plan 02).
</verification>

<success_criteria>

- Package `@portfolio/mdx` tồn tại đúng chuẩn raw-TS repo (exports src, transpile-ready — REQ-10), typecheck xanh.
- Pipeline 1 nguồn sự thật đúng quyết định đã khóa: smartypants + alert + code-titles + img-to-jsx + header-ids phía remark; slug + autolink (icon heroicon nguyên bản) + katex + pretty-code dual-theme phía rehype (REQ-02).
- `extractTocHeadings` dùng được độc lập cho cả 2 app về sau.
- Meta fence 4 bài 2025 đã xác nhận tương thích — rủi ro prism-plus cũ (D-08) đã đóng.
  </success_criteria>

<output>
Commit: `feat(mdx): scaffold @portfolio/mdx with shared remark/rehype pipeline (C3)` (1 commit cho cả plan)
Sau khi xong: viết C03-01-SUMMARY.md cạnh plan này + cập nhật STATE.md + tick checkbox ROADMAP.md
</output>
