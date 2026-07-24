import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from 'web-2025'

// packages/ui = Base UI (dùng chung 2025 + 2026): Label/CheckboxItem BẮT BUỘC nằm trong
// <DropdownMenuGroup> — nếu không: "MenuGroupContext is missing" → card rỗng (khác Radix
// cũ không đòi Group). defaultOpen để nội dung hiện sẵn; Content portal ra body nên config
// đặt cardMode:single.
export const PostActionsMenu = () => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, minHeight: 380 }}>
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button variant='outline'>Tùy chọn bài viết</Button>} />
      <DropdownMenuContent align='start' style={{ width: 224 }}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem>
            Sao chép link
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Chia sẻ</DropdownMenuItem>
          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem checked>Hiện mục lục</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Ghim lên đầu trang</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant='destructive'>
            Xóa bài viết
            <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)
