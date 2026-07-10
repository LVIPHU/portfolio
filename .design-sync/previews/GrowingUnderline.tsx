import { GrowingUnderline, NavigationLink } from 'web-2025'

// GrowingUnderline = highlight gradient amber mọc từ dưới lên khi hover.
// active => bg-[length:100%_50%]: hiện sẵn nửa dưới (chụp tĩnh được);
// mặc định bg-[length:0px_50%]: chỉ hiện khi hover — trong screenshot là chữ trơn.

export const ActiveVsDefault = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
    <GrowingUnderline active className="text-xl font-semibold">
      Kiến trúc React Fiber
    </GrowingUnderline>
    <GrowingUnderline className="text-xl font-semibold">
      Mặc định: underline chỉ mọc khi hover
    </GrowingUnderline>
    <GrowingUnderline active as="p" className="text-sm">
      Dùng được cho cả đoạn chữ nhỏ nhờ prop <code>as</code>
    </GrowingUnderline>
  </div>
)

export const PostTitleLink = () => (
  <h3 className="text-2xl font-bold tracking-tight" style={{ maxWidth: 480 }}>
    <NavigationLink href="/blog/toi-uu-anh-nextjs">
      <GrowingUnderline active>Tối ưu hiệu năng ảnh trong Next.js</GrowingUnderline>
    </NavigationLink>
  </h3>
)
