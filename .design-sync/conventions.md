# Quy ước sử dụng web-2025 UI (đọc trước khi build)

## Setup & wrapping

- KHÔNG cần provider bắt buộc: token màu/darkmode nằm sẵn trong `styles.css` (`:root` và `.dark`).
- **Dark mode**: thêm class `dark` vào phần tử gốc của design. Mọi token tự đổi theo.
- **Tooltip** phải nằm trong `<TooltipProvider>` (export sẵn của bundle). Các overlay khác (Dialog, Drawer, DropdownMenu, Popover, Select) không cần provider — muốn render trạng thái mở tĩnh thì truyền prop `open` (Select thêm `value`).
- Chạy ngoài Next.js: `Image` render thành `<img>` thuần (đừng trông đợi optimizer — dùng URL ảnh trực tiếp), `NavigationLink` render `<a href>`. `ViewsCounter`, `LinkPreview`, nhánh GitHub-stats của `ProjectCard` gọi API của app gốc — ngoài app chúng fail-an-toàn về trạng thái tĩnh; đừng dựa vào dữ liệu động của chúng.

## Idiom styling — Tailwind v4 + token ngữ nghĩa shadcn

Dùng utility class Tailwind với token ngữ nghĩa của hệ (KHÔNG bịa màu hex, KHÔNG dùng bg-blue-500 kiểu thô):

| Nhóm                  | Class đã kiểm chứng có trong CSS                                                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nền/chữ               | `bg-background` `text-foreground` `bg-card` `text-card-foreground` `bg-muted` `text-muted-foreground` `bg-accent` `bg-primary` `text-primary-foreground` `bg-secondary` `text-secondary-foreground` `bg-destructive` `text-destructive` |
| Viền/bo               | `border` `border-input` `rounded-md` `rounded-lg` `rounded-full` `shadow-xs`                                                                                                                                                            |
| Layout                | `flex` `grid` `items-center` `justify-between` `justify-center` `gap-1` `gap-2` `gap-3` `gap-4` `gap-6` `w-full` `p-4` `px-4` `px-6` `py-2` `mt-2` `mt-4` `space-y-1`                                                                   |
| Chữ                   | `text-xs` `text-sm` `text-xl` `text-2xl` `text-3xl` `font-medium` `font-semibold` `font-bold` `tracking-tight` `line-clamp-2`                                                                                                           |
| Trạng thái/responsive | `hover:bg-accent` `hover:underline` `sm:flex-row` `md:text-2xl`                                                                                                                                                                         |

**Cảnh báo quan trọng**: CSS của hệ được compile JIT từ app gốc — utility NGOÀI danh sách trên có thể không tồn tại và sẽ im lặng không ăn. Khi cần giá trị lạ (kích thước lẻ, margin âm, ring...), dùng inline style với CSS var đã wrap: `style={{ boxShadow: '0 0 0 2px var(--color-background)' }}`. Token var dạng `var(--color-*)`: `--color-background` `--color-foreground` `--color-primary` `--color-muted-foreground` `--color-border` `--color-card` `--color-accent` `--color-destructive`. KHÔNG dùng `var(--background)` (bản raw chưa wrap hsl).

## Nguồn sự thật

- `styles.css` (import `_ds_bundle.css`): toàn bộ token + utility — đọc khi nghi ngờ một class/token.
- Mỗi component: `components/<group>/<Name>/<Name>.d.ts` là contract props (đã flatten variant thật, vd Button `variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"`, `size: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"`); `<Name>.prompt.md` là hướng dẫn dùng.

## Mẫu build chuẩn (đã verify render)

```tsx
import { Button, Card, CardContent, CardHeader, Badge, TagsList } from 'web-2025'

export function ProjectSection() {
  return (
    <section className='bg-background text-foreground p-4'>
      <div className='mt-2 flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Dự án nổi bật</h2>
        <Button variant='outline' size='sm'>
          Xem tất cả
        </Button>
      </div>
      <Card className='mt-4'>
        <CardHeader>
          <TagsList tags={['react', 'typescript']} />
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm'>
          Monorepo pnpm + Turborepo gom các phiên bản portfolio theo năm.
        </CardContent>
      </Card>
    </section>
  )
}
```

Nội dung minh họa nên song ngữ Việt/Anh tự nhiên như site gốc (blog kỹ thuật + portfolio cá nhân).
