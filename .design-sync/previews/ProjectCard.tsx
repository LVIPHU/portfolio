import { ProjectCard } from 'web-2025'

// BLOCKED (config-level, xem learnings/wave1-C.md): ProjectCard gọi useLingui()
// từ '@lingui/react' THẬT — path này KHÔNG được shim trong tsconfig.dsync.json
// (chỉ shim @lingui/react/macro). Bản @lingui/react đã bake vào _ds_bundle.js có
// LinguiContext riêng, nên I18nProvider import từ preview (copy thứ 2) không tới
// được hook → "useLingui hook was used without I18nProvider". Preview này viết
// sẵn để render đúng ngay khi orchestrator shim '@lingui/react' (useLingui
// passthrough) và rebuild bundle.

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

// description để dạng string → component dùng trực tiếp, không qua i18n._.
// SWR fetch /api/github sẽ fail trong preview → repository undefined → nhánh
// "View Code" + Language không render (đúng thiết kế fallback tĩnh của card).
const portfolioMonorepo = {
  type: 'self',
  title: 'Portfolio Monorepo',
  description:
    'Monorepo pnpm + Turborepo gom các phiên bản portfolio theo năm, dùng chung một content layer song ngữ Việt – Anh.',
  image: coverMonorepo,
  url: 'https://web-2026.vercel.app',
  repo: 'LVIPHU/portfolio',
  technologies: ['typescript', 'react', 'nextjs', 'tailwindcss'],
}

const zeroHomestay = {
  type: 'work',
  title: 'Zero Homestay',
  description:
    'Nền tảng đặt phòng homestay: tìm kiếm theo khu vực, lịch trống thời gian thực và thanh toán trực tuyến.',
  image: coverHomestay,
  url: 'https://zero-homestay.example.com',
  technologies: ['javascript', 'react', 'nodejs', 'mongodb'],
}

export const SelfProject = () => (
  <div style={{ maxWidth: 420 }}>
    <ProjectCard project={portfolioMonorepo as any} />
  </div>
)

export const WorkProject = () => (
  <div style={{ maxWidth: 420 }}>
    <ProjectCard project={zeroHomestay as any} />
  </div>
)
