# docs/plans — Bộ plan Nâng cấp C theo phương pháp GSD

Bộ plan này theo **GSD (Get Shit Done)** — vòng lặp _Discuss → Plan → Execute → Verify → Ship_ — bản GSD-lite thích nghi cho repo (chi tiết thích nghi + format chuẩn: [GSD-TEMPLATE.md](GSD-TEMPLATE.md)).

## Bản đồ file

| File                                  | Vai trò                                                               | Khi nào đọc                   |
| ------------------------------------- | --------------------------------------------------------------------- | ----------------------------- |
| [STATE.md](STATE.md)                  | Bộ nhớ sống: vị trí, quyết định, blocker                              | **Đầu MỌI phiên làm việc**    |
| [ROADMAP.md](ROADMAP.md)              | 13 phase C0–C12, REQ-NN, success criteria, tiến độ                    | Sau STATE, trước khi execute  |
| [GSD-TEMPLATE.md](GSD-TEMPLATE.md)    | Spec format CONTEXT/PLAN + luật cứng                                  | Khi viết/sửa plan             |
| `phases/C0X-<slug>/C0X-CONTEXT.md`    | Output Discuss: quyết định D-NN đã khóa, facts codebase, ý tưởng hoãn | Trước khi execute phase       |
| `phases/C0X-<slug>/C0X-NN-PLAN.md`    | Plan nguyên tử 2-3 task (files/action/verify/done)                    | Execute từng plan theo wave   |
| `phases/C0X-<slug>/C0X-NN-SUMMARY.md` | Viết SAU khi execute xong plan                                        | Ship                          |
| `archive/`                            | Bản plan phẳng thế hệ trước (nguồn facts của các CONTEXT)             | Chỉ khi cần đối chiếu sử liệu |

## Vòng làm việc chuẩn (mỗi phiên)

1. **Đọc STATE.md** → biết đang ở đâu, blocker gì.
2. **Đọc CONTEXT.md + PLAN kế tiếp** của phase hiện tại (theo ROADMAP).
3. **Execute** plan: làm từng task theo thứ tự, chạy `<verify>` từng task, đạt `<done>` mới sang task kế. Task `checkpoint:human-verify` → dừng chờ user.
4. **Ship**: 1 commit cho plan (message trong `<output>`), viết `SUMMARY.md`, tick checkbox ROADMAP, cập nhật STATE.md (vị trí + quyết định mới + blocker mới).
5. Hết plan trong phase → gate success criteria của phase trong ROADMAP → sang phase kế.

Plan cùng `wave` và không đụng file nhau được phép chạy song song (subagent).

## Quy ước xuyên suốt

- Gate mọi plan: `pnpm typecheck` + `pnpm build` xanh **cả 2 app**; main luôn deploy được (Vercel auto-deploy).
- `apps/2025` build từ **PowerShell** cho tới hết C5; `apps/2025/data/` READ-ONLY từ C2.
- shadcn: cài từng component 1 lệnh `pnpm dlx shadcn@latest add <name>` trong `packages/ui`.
- Package dùng chung: raw-TS `exports ./src/index.ts` + `transpilePackages` + Tailwind `@source`; không ship theme trong package.
- Phase chạm UI/animation (C8, C9): user nghiệm thu bằng mắt trước khi đóng.

Nguồn gốc: tổng quan cấp cao ở [../PLAN-upgrade-C.md](../PLAN-upgrade-C.md); roadmap cũ [../PLAN-apps-2025.md](../PLAN-apps-2025.md) đã bị thay thế phần Giai đoạn B.
