import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from 'web-2025'

// Trạng thái MỞ (export đầu = primaryStory). Tắt transition của vaul để
// screenshot không bắt trúng giữa animation trượt lên.
export const ShareArticleDrawer = () => (
  <>
    <style>{`[data-vaul-drawer], [data-vaul-overlay] { transition: none !important; }`}</style>
    <Drawer open>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl sm:text-2xl md:text-2xl md:leading-9">
            Chia sẻ bài viết
          </DrawerTitle>
          <DrawerDescription>
            Gửi bài &ldquo;Tối ưu hiệu năng ảnh trong Next.js&rdquo; tới bạn bè qua mạng xã hội.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex gap-2 px-4">
          <Button variant="outline" size="sm">
            Facebook
          </Button>
          <Button variant="outline" size="sm">
            X (Twitter)
          </Button>
          <Button variant="outline" size="sm">
            LinkedIn
          </Button>
        </div>
        <DrawerFooter>
          <Button>Sao chép link</Button>
          <DrawerClose asChild>
            <Button variant="outline">Đóng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </>
)
