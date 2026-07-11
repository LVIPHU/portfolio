# Template & quy ước GSD cho bộ plan này (ĐỌC TRƯỚC KHI VIẾT/SỬA PLAN)

Bộ plan trong `docs/plans/` theo phương pháp **GSD (Get Shit Done)** — vòng lặp _Discuss → Plan → Execute → Verify → Ship_ — bản **GSD-lite** thích nghi cho repo này. File này là spec định dạng: mọi CONTEXT/PLAN phải theo đúng khung dưới đây.

## Khác biệt so với GSD gốc (thích nghi có chủ đích)

| GSD gốc                                | Ở repo này                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `.planning/` ở root                    | `docs/plans/` (đã có sẵn docs/)                                                    |
| Executor = subagent context 200k riêng | Executor = phiên Claude Code chính (hoặc subagent khi tiện)                        |
| Atomic commit mỗi task                 | **Atomic commit mỗi PLAN** (thay quy ước cũ "mỗi phase 1 commit" — bisect tốt hơn) |
| STRIDE threat model mỗi plan           | Bỏ (site portfolio tĩnh; CSP xử lý ở plan liên quan)                               |
| TDD mode                               | Bỏ (repo không có test framework; verify = typecheck/build/grep/smoke)             |
| PROJECT.md/REQUIREMENTS.md riêng       | Gộp vào ROADMAP.md (mục Yêu cầu REQ-NN) + CLAUDE.md                                |

Ngôn ngữ: **prose tiếng Việt**, key/tag/lệnh/commit message tiếng Anh.

## Cấu trúc thư mục

```
docs/plans/
├── README.md            # cách dùng
├── GSD-TEMPLATE.md      # file này
├── ROADMAP.md           # toàn bộ phase C0–C12, REQ-NN, success criteria, checkbox plan
├── STATE.md             # bộ nhớ sống: vị trí hiện tại, quyết định, blocker (<100 dòng)
└── phases/
    └── C0X-<slug>/
        ├── C0X-CONTEXT.md        # output của Discuss
        ├── C0X-01-PLAN.md        # plan nguyên tử (2-3 task)
        ├── C0X-02-PLAN.md
        └── C0X-01-SUMMARY.md     # viết SAU khi execute xong plan (không viết trước)
```

## Format `C0X-CONTEXT.md`

```markdown
# Phase CX: [Tên] — Context

**Thu thập:** YYYY-MM-DD
**Trạng thái:** Sẵn sàng lập plan | Đang thi công | Hoàn thành

<domain>
## Ranh giới phase
[Phase này giao gì — scope anchor từ ROADMAP, cố định. 2-4 câu. Ghi cả cái KHÔNG thuộc phase.]
</domain>

<decisions>
## Quyết định đã khóa
### [Nhóm 1]
- **D-01:** [Quyết định cụ thể — user đã chốt hoặc đã nghiên cứu chốt. KHÔNG mơ hồ.]
- **D-02:** ...
### Claude tự quyết
[Vùng user nói "tùy bạn" — executor có quyền chọn, ghi lại lựa chọn trong SUMMARY]
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể
[Tham chiếu "muốn giống X", và CÁC MẪU CODE dài (code fence đặt Ở ĐÂY, đánh số M-01, M-02 — task trong PLAN chỉ được trích dẫn "theo mẫu M-01", KHÔNG chép fence vào <action>)]
</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `đường/dẫn/file` — [file đó quyết định gì cho phase này]
  [BẮT BUỘC có mục này; không có thì ghi rõ "Không có spec ngoài — mọi yêu cầu nằm trong decisions"]
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh)

### Tài sản tái dùng

### Pattern đã có

### Điểm tích hợp

[SỐ LIỆU THẬT: danh sách file, số đếm grep — không ước đoán]
</code_context>

<deferred>
## Ý tưởng hoãn
- [Ý tưởng] — [thuộc phase nào / backlog]
</deferred>

---

_Phase: C0X-slug_
```

## Format `C0X-NN-PLAN.md`

````markdown
---
phase: C0X-slug
plan: NN
type: execute
wave: N # plan cùng wave chạy song song được (không đụng file nhau)
depends_on: [] # ví dụ [C05-01]
files_modified: [] # đường dẫn thật
autonomous: true # false nếu có task checkpoint:human-verify
requirements: [REQ-NN] # BẮT BUỘC, trỏ về ROADMAP.md
must_haves:
  truths: # hành vi quan sát được sau khi xong (goal-backward)
    - '...'
  artifacts: # file phải tồn tại
    - '...'
  key_links: # kết nối then chốt phải hoạt động
    - '...'
---

<objective>
[Plan này hoàn thành gì, 2-4 câu. Purpose + Output.]
</objective>

<context>
@docs/plans/phases/C0X-slug/C0X-CONTEXT.md
@[file nguồn cần đọc trước khi làm — đường dẫn thật]
</context>

<tasks>

<task type="auto">
  <name>Task 1: [Tên hành động cụ thể]</name>
  <files>đường/dẫn/1, đường/dẫn/2</files>
  <action>[Chỉ dẫn thi công cụ thể: làm gì, tránh gì và VÌ SAO, tên hàm/identifier/lệnh chính xác.
  Trích quyết định bằng ID: "theo D-03". Trích mẫu code bằng "theo mẫu M-01 trong CONTEXT".
  TUYỆT ĐỐI KHÔNG code fence ``` trong action — action là chỉ thị, không phải code.]</action>
  <verify>[Lệnh tự động chạy <60s: pnpm typecheck / pnpm build --filter=X / grep có filter.
  Grep hygiene: đếm bằng `grep -rn "token" src --include="*.tsx" | grep -v "^#" | wc -l`, cấm gate `== 0` trên file chưa lọc comment.]</verify>
  <done>[Tiêu chí nghiệm thu đo được — trạng thái, không phải hành động]</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task N: User nghiệm thu [X] bằng mắt</name>
  <action>[Mở URL nào, bấm gì, nhìn gì]</action>
  <verify>User xác nhận OK</verify>
  <done>[Danh sách hành vi user phải thấy]</done>
</task>

</tasks>

<verification>
[Gate tổng của plan: lệnh + checklist]
</verification>

<success_criteria>
[Trạng thái đo được khi plan xong — khớp must_haves]
</success_criteria>

<output>
Commit: `<type>(<scope>): <message>` (1 commit cho cả plan)
Sau khi xong: viết C0X-NN-SUMMARY.md cạnh plan này + cập nhật STATE.md + tick checkbox ROADMAP.md
</output>
````

## Luật cứng khi viết plan

1. **2–3 task/plan, không hơn.** Quá → tách plan mới. Tách luôn nếu: nhiều subsystem (packages + app = 2 plan), 1 task >5 file, checkpoint lẫn implementation nặng.
2. **Plans are prompts**: executor phải thi công được mà KHÔNG suy diễn — đường dẫn thật, tên identifier thật, lệnh thật.
3. **Không giảm scope**: cấm chữ "tạm thời", "bản đơn giản", "làm sau" cho quyết định D-NN đã khóa. Không nhét vừa → tách plan, không cắt.
4. **must_haves goal-backward**: đi ngược từ success criteria của phase trong ROADMAP, không phải danh sách việc.
5. **Mỗi D-NN của CONTEXT phải có ít nhất 1 task thi công nó** (trích ID trong action). Ý tưởng trong `<deferred>` KHÔNG được xuất hiện trong plan.
6. **shadcn/ui LUÔN cài bằng CLI, mỗi component một lệnh riêng**, chạy trong `packages/ui`:
   `pnpm dlx shadcn@latest add avatar` — KHÔNG chép code component từ docs/registry vào tay, KHÔNG gộp nhiều component 1 lệnh trong plan (mỗi lệnh 1 dòng để chạy/verify/rollback từng cái).
7. **Verify tự động trước, mắt người sau**: mọi task có lệnh verify chạy được; smoke bằng mắt là task `checkpoint:human-verify` riêng (thường ở plan cuối phase), `autonomous: false`.
8. **SUMMARY chỉ viết sau khi execute** — không viết trước, không viết hộ.
