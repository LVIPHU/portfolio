import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from 'web-2025'

// Trạng thái MỞ (export đầu = primaryStory) — menu hành động của một bài viết.
export const PostActionsMenu = () => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, minHeight: 380 }}>
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>Tùy chọn bài viết</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' style={{ width: 224 }}>
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuItem>
          Sao chép link
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Chia sẻ</DropdownMenuItem>
        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Hiện mục lục</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Ghim lên đầu trang</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive'>
          Xóa bài viết
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)
