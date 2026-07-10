import { HoverEffect } from 'web-2025'

// Lưới ProjectCard với nền hover trượt (layoutId). Grid gốc chỉ lên 2 cột từ
// lg (1024px) — viewport capture 900px nên truyền className='md:grid-cols-2'
// (utility có sẵn trong CSS app) để 2 card đứng cạnh nhau, vừa khung 700px cao.
// SWR /api/github fail trong preview → nhánh View Code/Language không render
// (fallback tĩnh đúng thiết kế của ProjectCard).
// Guard capture: clock cố định của playwright đóng băng rAF → AnimatedContent
// (bọc cứng trong HoverEffect) kẹt ở initial {opacity:0, x:-50} làm cả lưới vô
// hình. CSS !important thắng inline style của framer → ép về trạng thái cuối.

const coverMonorepo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/></svg>`
  )

const coverHomestay =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#eab308"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/></svg>`
  )

const items = [
  {
    type: 'self',
    title: 'Portfolio Monorepo',
    description: 'Monorepo pnpm + Turborepo gom các phiên bản portfolio theo năm, dùng chung content layer song ngữ.',
    image: coverMonorepo,
    url: 'https://web-2026.vercel.app',
    repo: 'LVIPHU/portfolio',
    technologies: ['typescript', 'react', 'nextjs', 'tailwindcss'],
  },
  {
    type: 'work',
    title: 'Zero Homestay',
    description: 'Nền tảng đặt phòng homestay: tìm kiếm theo khu vực, lịch trống thời gian thực và thanh toán online.',
    image: coverHomestay,
    url: 'https://zero-homestay.example.com',
    technologies: ['javascript', 'react', 'nodejs', 'mongodb'],
  },
]

export const ProjectsGrid = () => (
  <>
    <style>{`.hed .group\\/effect > .h-full{opacity:1!important;transform:none!important}`}</style>
    <div className='hed'>
      <HoverEffect items={items as any} className='md:grid-cols-2' />
    </div>
  </>
)
