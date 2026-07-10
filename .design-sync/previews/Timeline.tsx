import { Timeline, TimelineItemDescription, TimelineItemSmallText } from 'web-2025'

// TimelineEntry: { title: string; content: ReactNode }. Dùng các sub-export
// TimelineItemDescription / TimelineItemSmallText làm content (bỏ TimelineItemDateRange
// vì nó gọi useLingui + dayjs locale — không cần thiết cho preview tĩnh).
const data = [
  {
    title: 'Full-stack Developer · Freelance',
    content: (
      <>
        <TimelineItemDescription>
          Xây dựng portfolio monorepo (Next.js 16, Turborepo, Tailwind v4) với content layer song ngữ Việt – Anh
          dùng chung giữa các phiên bản.
        </TimelineItemDescription>
        <TimelineItemSmallText>06/2024 — nay · TP. Hồ Chí Minh</TimelineItemSmallText>
      </>
    ),
  },
  {
    title: 'Frontend Developer · Zero Homestay',
    content: (
      <>
        <TimelineItemDescription>
          Phát triển nền tảng đặt phòng homestay: tìm kiếm theo khu vực, lịch trống thời gian thực và thanh toán
          trực tuyến (React, Node.js, MongoDB).
        </TimelineItemDescription>
        <TimelineItemSmallText>06/2023 — 05/2024 · Remote</TimelineItemSmallText>
      </>
    ),
  },
  {
    title: 'Cử nhân Công nghệ thông tin',
    content: (
      <>
        <TimelineItemDescription>
          Chuyên ngành phát triển web — đồ án tốt nghiệp về hệ thống blog đa ngôn ngữ với Next.js.
        </TimelineItemDescription>
        <TimelineItemSmallText>2020 — 2024</TimelineItemSmallText>
      </>
    ),
  },
]

// Trong capture, framer-motion (AnimatedContent bọc từng item) kẹt ở keyframe
// đầu (opacity 0 / translateX(50px) / layout-projection collapse) vì Playwright
// clock fake performance.now. CSS !important ép item về TRẠNG THÁI CUỐI của
// animation — đúng bằng resting state trên site thật, không đổi style DS.
export const WorkExperience = () => (
  <div className="tl-fix" style={{ maxWidth: 620, padding: '16px 24px 8px' }}>
    <style>{`.tl-fix .relative.ml-5.w-full.pl-6{opacity:1!important;transform:none!important}`}</style>
    <Timeline data={data} />
  </div>
)
