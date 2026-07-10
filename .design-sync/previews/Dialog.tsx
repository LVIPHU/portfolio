import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'web-2025'

// Trạng thái MỞ (export đầu = primaryStory) — dialog xác nhận xóa bài viết.
export const DeletePostConfirm = () => (
  <Dialog open>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Xóa bài viết?</DialogTitle>
        <DialogDescription>
          Bài viết &ldquo;Tối ưu hiệu năng ảnh trong Next.js&rdquo; sẽ bị xóa vĩnh viễn cùng toàn bộ bình luận. Hành
          động này không thể hoàn tác.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant='outline'>Hủy</Button>
        <Button variant='destructive'>Xóa bài viết</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
