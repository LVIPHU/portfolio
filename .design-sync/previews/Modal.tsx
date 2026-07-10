import { Button, Modal } from 'web-2025'

// Overlay MỞ (cardMode single, viewport 640x480). Ở 640px < 1024px media query
// isDesktop=false → Modal render nhánh Drawer (vaul) trượt từ đáy — đúng hành vi
// responsive thật của component. Tắt transition vaul để screenshot không bắt
// giữa animation; guard chống body-shift của scroll-lock khi xem live.
export const DeletePostModal = () => (
  <>
    <style>{`body{margin-right:0!important;padding-right:0!important}
[data-vaul-drawer],[data-vaul-overlay]{transition:none!important}`}</style>
    <Modal
      title="Xóa bài viết?"
      description="Bài viết “Tối ưu hiệu năng ảnh trong Next.js” sẽ bị xóa vĩnh viễn cùng toàn bộ bình luận. Hành động này không thể hoàn tác."
    >
      <div className="flex justify-end gap-2">
        <Button variant="outline">Hủy</Button>
        <Button variant="destructive">Xóa bài viết</Button>
      </div>
    </Modal>
  </>
)
