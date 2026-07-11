---
phase: C02-content-v2
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/content/blog/kien-truc-react-fiber.vi.mdx
  - packages/content/blog/cac-component-element-va-instance-trong-react.vi.mdx
  - packages/content/blog/does-promise-all-run-in-parallel-or-sequential.en.mdx
  - packages/content/blog/guide-to-using-images-in-nextjs.en.mdx
  - packages/content/authors/ # 5 file mới
  - packages/content/assets/blog/ # banner JPG
  - packages/content/assets/authors/ # avatar
autonomous: true
requirements: [REQ-01]
must_haves:
  truths:
    - 'packages/content/blog chứa 8 file MDX (4 cũ 2026 + 4 mới từ 2025), tên đúng dạng <slug>.<vi|en>.mdx'
    - 'Không file MDX mới nào còn tag vietnamese/english hay đường dẫn /static/images'
  artifacts:
    - 'packages/content/authors/{default,leohuynh,danabramov,andrewclark,sparrowhawk}.mdx'
    - 'packages/content/assets/blog/*.jpg — mọi banner được frontmatter images tham chiếu'
  key_links:
    - 'Đường dẫn images/avatar trong frontmatter khớp vị trí file trong assets/ (sau sync sẽ thành /content/...)'
---

<objective>
Hút content 2025 vào package: copy 4 bài blog (đổi tên theo locale thật), 5 authors, và toàn bộ ảnh banner/avatar được tham chiếu. Chạy song song được với C02-01 (không đụng file nhau).
</objective>

<context>
@docs/plans/phases/C02-content-v2/C02-CONTEXT.md
@apps/2025/data/blog/
@apps/2025/data/authors/
</context>

<tasks>

<task type="auto">
  <name>Task 1: Copy 4 bài blog theo bảng mapping</name>
  <files>packages/content/blog/*.vi.mdx, packages/content/blog/*.en.mdx (4 file mới)</files>
  <action>Copy 4 file theo đúng bảng M-02 trong CONTEXT (nguồn READ-ONLY theo D-07 — không sửa nguồn). Sửa frontmatter mỗi file khi copy theo D-08: (1) xóa tag vietnamese/english khỏi mảng tags; (2) mọi entry images dạng /static/images/banners/x.jpg đổi thành /content/blog/x.jpg giữ nguyên tên file; (3) giữ nguyên title, date, summary, lastmod, authors, layout, draft. Body MDX giữ nguyên 100% kể cả cú pháp chưa render được (C3 lo — nằm trong deferred).</action>
  <verify>ls packages/content/blog | wc -l = 8; grep -l "vietnamese\|english" packages/content/blog/*.mdx | wc -l = 0 (chỉ quét frontmatter tags — nếu grep dính từ trong body thì kiểm bằng mắt dòng tags: rồi mới kết luận); grep -rn "/static/images" packages/content/blog | wc -l = 0</verify>
  <done>8 file MDX đúng tên; frontmatter sạch tag ngôn ngữ + path ảnh mới; body không đổi so nguồn (diff body = 0).</done>
</task>

<task type="auto">
  <name>Task 2: Copy 5 authors + dọn frontmatter</name>
  <files>packages/content/authors/default.mdx, packages/content/authors/leohuynh.mdx, packages/content/authors/danabramov.mdx, packages/content/authors/andrewclark.mdx, packages/content/authors/sparrowhawk.mdx</files>
  <action>Copy nguyên 5 file từ apps/2025/data/authors/. Sửa frontmatter khi copy: xóa key layout theo D-09; avatar dạng /static/images/... đổi thành /content/authors/<tên file ảnh> (ảnh copy ở Task 3). Đối chiếu field với authorFrontmatterSchema trong packages/content/src/schema.ts (name bắt buộc; avatar/occupation/company/email/twitter/x/linkedin/github optional) — key lạ ngoài schema sẽ bị Zod strip theo D-09, chấp nhận.</action>
  <verify>ls packages/content/authors | wc -l = 5; grep -rn "layout:" packages/content/authors | wc -l = 0; grep -rn "/static/" packages/content/authors | wc -l = 0</verify>
  <done>5 file author sạch layout key, avatar trỏ /content/authors/.</done>
</task>

<task type="auto">
  <name>Task 3: Copy assets ảnh được tham chiếu</name>
  <files>packages/content/assets/blog/, packages/content/assets/authors/</files>
  <action>Grep toàn bộ frontmatter images trong packages/content/blog/*.mdx và avatar trong packages/content/authors/*.mdx, lập danh sách tên file ảnh. Copy từng file từ apps/2025/public/static/images/banners/ (và thư mục avatar tương ứng trong apps/2025/public/static/images/) sang packages/content/assets/blog/ và assets/authors/ giữ nguyên tên. Chỉ copy ảnh ĐƯỢC THAM CHIẾU — không bê cả thư mục banners (tránh rác). Nếu 1 ảnh tham chiếu không tồn tại ở nguồn: dừng, ghi vào SUMMARY thay vì im lặng bỏ qua.</action>
  <verify>node -e "const fs=require('fs'),m=require('gray-matter');let miss=[];for(const f of fs.readdirSync('packages/content/blog')){const d=m(fs.readFileSync('packages/content/blog/'+f,'utf8')).data;for(const i of d.images||[]){const p='packages/content/assets/blog/'+i.split('/').pop();if(!fs.existsSync(p))miss.push(p)}}if(miss.length)throw miss.join()" thoát 0 (chạy từ root, gray-matter đã có trong packages/content — dùng node_modules của nó nếu root thiếu)</verify>
  <done>Mọi ảnh được frontmatter tham chiếu tồn tại trong assets/; không ảnh mồ côi thừa.</done>
</task>

</tasks>

<verification>
Cả 3 lệnh verify của 3 task pass; `git status` chỉ hiện file MỚI dưới packages/content (nguồn apps/2025/data không đổi — bằng chứng D-07).
</verification>

<success_criteria>
Content 2025 nằm trọn trong package với đường dẫn ảnh mới; nguồn nguyên vẹn chờ xóa ở C5.
</success_criteria>

<output>
Commit: `feat(content): absorb 2025 blog posts, authors and referenced assets`
Sau khi xong: viết C02-02-SUMMARY.md.
</output>
