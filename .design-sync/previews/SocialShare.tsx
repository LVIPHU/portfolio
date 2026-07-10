import { SocialShare } from 'web-2025'

// Nút Share mở DropdownMenu (copy link / X / LinkedIn / Facebook / Discuss on X
// / Edit on GitHub). Render trạng thái ĐÓNG theo khuyến nghị review; guard chống
// body-shift của react-remove-scroll khi user mở menu live trong DS pane.
export const ShareTrigger = () => (
  <>
    <style>{'body{margin-right:0!important;padding-right:0!important}'}</style>
    <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
      <SocialShare
        postUrl="https://web-2025.vercel.app/vi-VN/blog/toi-uu-hieu-nang-anh-nextjs"
        filePath="data/blog/toi-uu-hieu-nang-anh-nextjs.mdx"
        title="Tối ưu hiệu năng ảnh trong Next.js"
      />
    </div>
  </>
)
