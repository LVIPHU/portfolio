/**
 * Nguồn sự thật duy nhất về Phú trong monorepo.
 * Không chạm fs — client-safe (data2025 re-export được).
 * Số liệu / job / stack chỉ lấy từ CV; hobby + Facebook là ngoại lệ đã chốt từ site 2025.
 * `profile` sống ở `./profile` để chrome chỉ cần danh tính không kéo cả CV.
 */
import { profile } from './profile'
import type { Company, Education, Project, Skill, SkillId } from './types'

export { profile }

export const education: Education[] = [
  {
    id: 'ptit',
    school: 'Posts and Telecommunications Institute of Technology (PTIT)',
    degree: { vi: 'Cử nhân', en: "Bachelor's Degree" },
    field: { vi: 'Phát triển phần mềm', en: 'Software Development' },
    start: '2018-08',
    end: '2022-12',
  },
]

const hcm: { vi: string; en: string } = {
  vi: 'TP. Hồ Chí Minh',
  en: 'Ho Chi Minh City',
}

export const experience: Company[] = [
  {
    id: 'nexsoft',
    name: 'NEXSOFT TECHNOLOGY',
    url: 'https://foundation.tb.ink',
    location: hcm,
    role: { vi: 'Lập trình viên Frontend', en: 'Frontend Developer' },
    start: '2025-06',
    end: null,
    active: true,
    products: [
      {
        id: 'tbchat',
        name: 'TBchat',
        url: 'https://im.tb.ink/',
        description: {
          vi: 'Nền tảng nhắn tin phi tập trung, mã hóa đầu-cuối, tự dịch thời gian thực trên web và mobile tại 8 thị trường quốc tế.',
          en: 'Fully decentralized, end-to-end encrypted messaging platform supporting real-time auto-translation across web and mobile clients in 8 international markets.',
        },
        role: { vi: 'Người đóng góp frontend chính', en: 'Main frontend contributor' },
        team: {
          vi: '3 kỹ sư, 1 nhà thiết kế sản phẩm, 1 quản lý sản phẩm',
          en: '3 engineers, 1 product designer, 1 product manager',
        },
        start: '2025-06',
        end: null,
        active: true,
        stack: ['nuxt', 'vuejs', 'typescript', 'pinia', 'tailwindcss', 'nitro', 'redis', 'playwright'],
        summary: [
          {
            vi: 'Phụ trách tích hợp frontend nhắn tin ngang hàng trong ứng dụng Nuxt SSR, ranh giới client/server cho dịch thuật đã xác thực, phát hiện ngôn ngữ, rút gọn URL và mã mời qua Nitro trên 8 thị trường.',
            en: 'Owned the frontend integration of peer-to-peer messaging in an SSR Nuxt application, defining the client/server boundary for authenticated translation, language-detection, URL-shortening, and invite-code calls through Nitro across 8 international markets.',
          },
          {
            vi: 'Góp phần tăng kích hoạt tin nhắn đầu từ 42% lên 51% (cải thiện tương đối 21%) bằng cách đơn giản hóa luồng mời và giữ trạng thái ngôn ngữ thiết bị qua deep link và iOS.',
            en: 'Contributed to a first-message activation increase from 42% to 51%, a 21% relative improvement, by simplifying invite handling and preserving device-language state across deep links and iOS.',
          },
          {
            vi: 'Tách thư viện P2P nặng thành chunk chỉ-client theo nhu cầu, giảm payload client ban đầu từ 1.25MB xuống 1.05MB (~16%, đo từ phân tích bundle production) và giữ dependency chỉ-browser khỏi bundle SSR.',
            en: 'Split the heavy P2P messaging library into an on-demand, client-only chunk, reducing the initial client payload from 1.25MB to 1.05MB, a ~16% reduction measured from production-build bundle analysis, while keeping browser-only dependencies out of the SSR bundle.',
          },
          {
            vi: 'Loại một lớp lỗi optimistic-UI lặp lại (tin nhắn link trùng và placeholder thô); viết 28 regression test và kịch bản Playwright E2E cho luồng nhắn tin thời gian thực then chốt, giảm defect production liên quan từ 11 xuống 2 sau 10 lần phát hành.',
            en: 'Removed a recurring class of optimistic-UI defects involving duplicated and raw-placeholder link messages; authored 28 regression tests and Playwright end-to-end scenarios for critical real-time messaging flows, reducing related production defects from 11 to 2 over 10 releases.',
          },
        ],
      },
      {
        id: 'tb-wallet',
        name: 'TB Wallet',
        url: 'https://wallet.tb.ink/',
        description: {
          vi: 'Website ví crypto đa chuỗi: trang sản phẩm, hỗ trợ, pháp lý, i18n và trải nghiệm WebGL tương tác trên 8 thị trường.',
          en: 'Official multi-chain crypto-wallet website covering product pages, support content, legal documentation, internationalization, and interactive WebGL experiences across 8 international markets.',
        },
        role: { vi: 'Phụ trách frontend toàn phần', en: 'Sole frontend owner' },
        start: '2025-06',
        end: null,
        active: true,
        stack: ['nextjs', 'react', 'typescript', 'tailwindcss', 'radix', 'threejs', 'docker'],
        summary: [
          {
            vi: 'Phụ trách frontend end-to-end cho website ví đa chuỗi: routing, theme, nội dung MDX, animation, RSS, trang hỗ trợ, tài liệu pháp lý và nội dung địa phương hóa trên 8 thị trường.',
            en: 'Owned the frontend end to end for a multi-chain crypto-wallet website across routing, theming, MDX content delivery, animation, RSS generation, support-centre pages, legal documentation, and localized content across 8 international markets.',
          },
          {
            vi: 'Góp phần tăng chuyển đổi tải ví từ 6.8% lên 9.4% (cải thiện tương đối 38%) bằng cách tối ưu hero tương tác, thứ tự CTA chính và hành trình nội dung trên desktop lẫn mobile.',
            en: 'Contributed to an increase in wallet-download conversion from 6.8% to 9.4%, a 38% relative improvement, by optimizing the interactive hero, primary CTA hierarchy, and content journey across desktop and mobile.',
          },
          {
            vi: 'Xây hero WebGL với React Three Fiber: glTF điện thoại trên timeline 12 keyframe, đổi texture thời gian thực bằng vòng RAF tùy chỉnh đồng bộ Lenis, trì hoãn asset nặng đến khi cần.',
            en: 'Built an interactive WebGL hero with React Three Fiber, rendering a glTF phone across a 12-keyframe timeline with real-time texture swaps driven by a custom RAF loop synchronized with Lenis scroll, while deferring heavy assets until needed.',
          },
          {
            vi: 'Áp mẫu tương tác tiếp cận trên luồng nội dung và CTA cốt lõi: bàn phím, quản lý focus, nhãn ARIA và trạng thái lỗi rõ cho component tương tác.',
            en: 'Applied accessible interaction patterns across core content and CTA flows, including keyboard navigation, focus management, ARIA labelling, and clear error states for interactive components.',
          },
          {
            vi: 'Giảm LCP mobile trong lab Lighthouse lặp lại từ 4.1s xuống 2.2s và JavaScript ban đầu từ 1.8MB xuống 1.1MB nhờ so sánh hồi quy sau tối ưu ảnh, code splitting theo route, lazy load và trì hoãn asset WebGL.',
            en: 'Reduced mobile LCP in repeatable Lighthouse lab runs from 4.1s to 2.2s and initial JavaScript from 1.8MB to 1.1MB by using Lighthouse to compare regressions after image optimization, route-level code splitting, lazy loading, and deferred WebGL asset loading.',
          },
          {
            vi: 'Thiết kế và triển khai i18n đa ngôn ngữ với hướng RTL theo locale trên 8 locale, góp phần tăng 17% tương tác CTA đã địa phương hóa.',
            en: 'Designed and implemented multi-language internationalization with RTL-capable per-locale direction handling across 8 locales, contributing to a 17% increase in localized CTA engagement.',
          },
        ],
      },
      {
        id: 'tb-admin',
        name: 'TB Admin',
        description: {
          vi: 'Hệ thống back-office đa ứng dụng cho vận hành tài khoản, kiểm duyệt nội dung xã hội, quản lý token và nhật ký kiểm toán trong hệ sinh thái TB.',
          en: 'Multi-application back-office system for account operations, social-content moderation, token management, and audit logging across the TB ecosystem.',
        },
        role: { vi: 'Người đóng góp frontend chính', en: 'Main frontend contributor' },
        team: {
          vi: '3 kỹ sư, 1 quản lý sản phẩm, 1 nhà thiết kế sản phẩm',
          en: '3 engineers, 1 product manager, 1 product designer',
        },
        start: '2025-06',
        end: null,
        active: true,
        stack: [
          'nx',
          'nextjs',
          'vite',
          'reactrouter',
          'typescript',
          'tanstack',
          'zustand',
          'zod',
          'storybook',
          'vitest',
        ],
        summary: [
          {
            vi: 'Mở rộng monorepo Nx gồm 3 ứng dụng và 5 thư viện dùng chung; phụ trách luồng frontend chặn tài khoản, hạn chế quốc gia, quản lý bài đăng, token và nhật ký kiểm toán qua ranh giới ứng dụng.',
            en: 'Extended an Nx monorepo containing 3 applications and 5 shared libraries, owning frontend workflows for account blocking, country restrictions, post management, token management, and audit logging across shared application boundaries.',
          },
          {
            vi: 'Giao 7 tính năng vận hành end-to-end trong 1 tháng: từ đặc tả thành luồng UI, hợp đồng dữ liệu, validation, test, review stakeholder và rollout production trên 3 ứng dụng.',
            en: 'Shipped 7 end-to-end operations features within 1 month, translating written specifications into UI flows, data contracts, validation, tests, stakeholder review, and production rollout across 3 applications.',
          },
          {
            vi: 'Thiết kế và triển khai 46 component design-system tương thích SSR/CSR với Storybook và Vitest, được dùng trên 18 màn hình và 4 đội frontend, giảm 35% phần UI viết trùng.',
            en: 'Designed and implemented 46 SSR/CSR-compatible design-system components with Storybook and Vitest, adopted across 18 screens and 4 frontend teams, reducing duplicated UI implementation by 35%.',
          },
          {
            vi: 'Tách UI, truy cập dữ liệu và xác thực thành thư viện tái sử dụng, giảm thời gian giao một màn hình vận hành mới từ 5 ngày xuống 1 ngày, cho phép áp dụng dần mà không chặn feature đang chạy.',
            en: 'Extracted shared UI, data-access, and authentication capabilities into reusable libraries, reducing average delivery time for a new operations screen from 5 days to 1 day while enabling gradual adoption without blocking active feature work.',
          },
        ],
      },
    ],
  },
  {
    id: 'pvs',
    name: 'PVS SOFTWARE JOINT STOCK COMPANY',
    url: 'https://pvssolution.com/',
    location: hcm,
    role: { vi: 'Lập trình viên trung cấp', en: 'Mid-level Developer' },
    start: '2022-09',
    end: '2025-06',
    active: false,
    products: [
      {
        id: 'pinance',
        name: 'Pinance',
        url: 'https://app.pinance.vn/',
        description: {
          vi: 'Nền tảng quản lý hóa đơn điện tử, đồng bộ với hệ thống cơ quan thuế, hỗ trợ điều chỉnh, xuất, thông báo và tự lưu nháp.',
          en: 'Electronic-invoice management platform synchronizing invoices with tax-authority systems and supporting adjustment, export, notification, and auto-save workflows.',
        },
        role: { vi: 'Lập trình viên Frontend', en: 'Frontend developer' },
        team: {
          vi: '4 kỹ sư, 1 kỹ sư QA, 1 quản lý sản phẩm',
          en: '4 engineers, 1 QA engineer, 1 product manager',
        },
        start: '2024-02',
        end: '2025-06',
        active: false,
        stack: ['vuejs', 'bootstrap', 'websocket', 'django'],
        summary: [
          {
            vi: 'Xây luồng đồng bộ frontend cho khoảng 1.1 triệu hóa đơn/tháng, hiện trạng thái retry và phản hồi lỗi, đạt 99.7% đồng bộ thành công với hệ thống cơ quan thuế.',
            en: 'Built frontend synchronization workflows for approximately 1.1 million invoices per month, surfacing retryable states and failure feedback while achieving a 99.7% synchronization success rate with the tax-authority system.',
          },
          {
            vi: 'Triển khai thông báo WebSocket với độ trễ p95 dưới 1 giây, xử lý trạng thái kết nối, phản hồi cập nhật và thay đổi hóa đơn nhạy thời gian mà không cần làm mới thủ công.',
            en: 'Implemented WebSocket notifications with p95 delivery latency under 1 second, handling connection states, update feedback, and time-sensitive invoice changes without manual refreshes.',
          },
          {
            vi: 'Xây luồng điều chỉnh hóa đơn, xuất đa định dạng và tự lưu nháp, giảm thời gian xử lý trung bình từ 14 phút xuống 9 phút và tăng hiệu quả nhập liệu 20%.',
            en: 'Built invoice-adjustment workflows, multi-format exports, and auto-save drafts that reduced average processing time from 14 minutes to 9 minutes and improved data-entry efficiency by 20%.',
          },
          {
            vi: 'Triển khai khôi phục nháp tự lưu trong luồng ghi nhận tăng 30% hoàn thành form khi rollout, đồng thời giảm sự cố mất dữ liệu nhập từ khoảng 120 xuống 18 mỗi tháng.',
            en: 'Implemented auto-save draft recovery in a workflow that recorded a 30% increase in form completion during rollout, while reducing lost-input incidents from approximately 120 to 18 per month.',
          },
        ],
      },
      {
        id: 'mobi8-client',
        name: 'Mobi 8 – Client',
        description: {
          vi: 'Nền tảng viễn thông hướng khách hàng của MobiFone Đài 8: gói cước, đăng ký băng rộng và dịch vụ số, xác thực, nội dung SEO và tự phục vụ cho thuê bao Đồng Nai, Bình Dương, Tây Ninh, Bà Rịa–Vũng Tàu.',
          en: 'Regional customer-facing telecom platform for MobiFone Region 8, serving subscribers across Đồng Nai, Bình Dương, Tây Ninh, and Bà Rịa–Vũng Tàu through plan discovery, broadband and digital-service registration, authentication, SEO content, and self-service workflows.',
        },
        role: { vi: 'Lập trình viên Frontend', en: 'Frontend developer' },
        team: {
          vi: '4 kỹ sư, 1 quản lý sản phẩm, 1 nhà thiết kế',
          en: '4 engineers, 1 product manager, 1 designer',
        },
        start: '2022-09',
        end: '2024-03',
        active: false,
        stack: ['nextjs', 'scss', 'tailwindcss', 'django'],
        summary: [
          {
            vi: 'Triển khai luồng đăng ký end-to-end cho khoảng 8.000 lượt đăng ký/tháng trên gói di động, băng rộng và sản phẩm số, gồm chọn gói, validation, xác thực và trạng thái xác nhận.',
            en: 'Implemented end-to-end subscription workflows handling approximately 8,000 monthly subscription-registration attempts across mobile plans, broadband services, and digital products, including plan selection, validation, authentication, and confirmation states.',
          },
          {
            vi: 'Cải thiện hoàn thành funnel đăng ký từ 4.6% lên 6.1% (tăng tương đối 33%) bằng cách đơn giản hóa chọn gói, phản hồi validation và luồng đăng ký.',
            en: 'Improved subscription funnel completion from 4.6% to 6.1%, a 33% relative increase, by simplifying plan selection, validation feedback, and registration flows.',
          },
          {
            vi: 'Góp phần tăng 15% đăng nhập thành công trên khoảng 35.000 lượt/tháng nhờ đăng nhập xã hội OAuth, xử lý redirect, trạng thái lỗi và duy trì phiên cho luồng tự phục vụ.',
            en: 'Contributed to a 15% increase in login success across approximately 35,000 monthly login attempts by implementing OAuth-based social sign-in, redirect handling, error states, and session persistence for customer self-service flows.',
          },
          {
            vi: 'Phối hợp backend trên API SSR/SEO, góp phần tăng 25% traffic organic trong 3 tháng và 19% click tìm kiếm không-thương hiệu nhờ cấu trúc trang crawl được và luồng nội dung sẵn metadata.',
            en: 'Collaborated with backend engineers on SSR and SEO-friendly APIs, contributing to a 25% increase in organic traffic over 3 months and a 19% increase in non-branded search clicks through crawlable page structures and metadata-ready content flows.',
          },
          {
            vi: 'Giảm LCP mobile trong lab Lighthouse lặp lại từ 3.8s xuống 2.1s nhờ code splitting theo route, lazy load, ảnh responsive và tối ưu phản hồi API.',
            en: 'Reduced mobile LCP in repeatable Lighthouse lab runs from 3.8s to 2.1s through route-level code splitting, lazy loading, responsive image delivery, and API response optimization.',
          },
        ],
      },
      {
        id: 'mobi8-admin',
        name: 'Mobi 8 – Admin',
        description: {
          vi: 'Nền tảng quản trị nội bộ cho bán hàng viễn thông, yêu cầu dịch vụ, đơn sản phẩm, xuất bản nội dung, khuyến mãi, tuyển dụng và hỗ trợ khách hàng.',
          en: 'Internal administration platform for telecom sales, service requests, product orders, content publishing, promotions, recruitment, and customer support.',
        },
        role: { vi: 'Lập trình viên Frontend', en: 'Frontend developer' },
        start: '2023-02',
        end: '2023-11',
        active: false,
        stack: ['react', 'vite', 'antd', 'django'],
        summary: [
          {
            vi: 'Xây luồng bán hàng và quản lý dịch vụ cho 65 quản trị viên xử lý khoảng 3.400 đơn và yêu cầu/tháng, giúp vận hành ngày thường nhanh khoảng 2 lần nhờ trạng thái rõ và luồng tác vụ gọn.',
            en: 'Built sales and service-management workflows used by 65 administrators to process approximately 3,400 orders and service requests per month, making day-to-day operations approximately 2× faster through clearer status states and streamlined task flows.',
          },
          {
            vi: 'Giảm thời gian xuất bản nội dung trung bình từ 45 phút xuống 5 phút: quản trị viên sắp xếp lại section trang chủ, sửa điều hướng, xuất bản hoặc ẩn trang mà không cần developer hay redeploy.',
            en: 'Reduced average content-publishing time from 45 minutes to 5 minutes by enabling administrators to reorder homepage sections, edit navigation, and publish or hide pages without developer intervention or redeployment.',
          },
          {
            vi: 'Giao module quản lý đơn, nội dung, khuyến mãi, tuyển dụng và hỗ trợ khách hàng, giảm 42% ticket hỗ trợ liên quan nội dung mỗi tháng nhờ luồng tự phục vụ và phản hồi validation rõ.',
            en: 'Delivered order-management, content-management, promotion, recruitment, and customer-support modules, reducing monthly content-related support tickets by 42% through self-service workflows and clearer validation feedback.',
          },
          {
            vi: 'Giao 12 module vận hành trong 7 tháng, phối hợp hành vi frontend, hợp đồng API, trạng thái biên và tiêu chí nghiệm thu với backend và product.',
            en: 'Delivered 12 operations modules in 7 months while coordinating frontend behavior, API contracts, edge states, and acceptance criteria with backend and product stakeholders.',
          },
        ],
      },
      {
        id: 'rainbow',
        name: 'Rainbow Kindergarten',
        description: {
          vi: 'Dashboard vận hành đa cơ sở cho trường mầm non: điểm danh, học sinh, chấm công, lương, kho, thanh toán, doanh thu và báo cáo trên 3 cơ sở tại TP. Hồ Chí Minh.',
          en: 'Multi-campus kindergarten operations dashboard covering attendance, student management, staff timekeeping, payroll, inventory, payments, revenue, and reporting across 3 campuses in Ho Chi Minh City.',
        },
        role: { vi: 'Lập trình viên Frontend', en: 'Frontend developer' },
        start: '2023-11',
        end: '2024-02',
        active: false,
        stack: ['react', 'vite', 'antd', 'django'],
        summary: [
          {
            vi: 'Xây dashboard đa cơ sở cho khoảng 500 học sinh và 40 giáo viên trên 3 cơ sở tại TP. Hồ Chí Minh, tự động hóa khoảng 540 bản ghi điểm danh/ngày, giảm 40% khối lượng theo dõi thủ công (tiết kiệm khoảng 16 giờ nhân sự/tuần).',
            en: 'Built a multi-campus operations dashboard for approximately 500 students and 40 teaching staff across 3 campuses in Ho Chi Minh City, automating approximately 540 daily attendance records and reducing manual tracking workload by 40%, saving approximately 16 staff hours per week.',
          },
          {
            vi: 'Giảm thời gian tải trang dashboard ban đầu trong lab Lighthouse lặp lại từ 3.0 giây xuống 1.2 giây (giảm 60%) nhờ lặp lại tải dữ liệu, thời điểm render, cập nhật bảng và form tái sử dụng; cùng công việc validation giảm 35% chỉnh sửa dữ liệu điểm danh/thanh toán mỗi tháng.',
            en: 'Reduced initial dashboard page-load time in repeatable Lighthouse lab runs from 3.0 seconds to 1.2 seconds, a 60% reduction, by iterating on data loading, render timing, table updates, and reusable form components; the same validation work reduced monthly attendance/payment data corrections by 35%.',
          },
        ],
      },
    ],
  },
]

function s(
  id: SkillId,
  name: string,
  category: Skill['category'],
  level: Skill['level'],
  extra: Partial<Pick<Skill, 'href' | 'hidden' | 'mostUsed'>> = {}
): Skill {
  return { id, name, category, level, ...extra }
}

export const skills: Skill[] = [
  s('javascript', 'JavaScript', 'languages', 'advanced', {
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    mostUsed: true,
  }),
  s('typescript', 'TypeScript', 'languages', 'advanced', {
    href: 'https://www.typescriptlang.org/',
    mostUsed: true,
  }),
  s('html', 'HTML5', 'languages', 'advanced', {
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  }),
  s('css', 'CSS3', 'languages', 'advanced', {
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  }),
  s('scss', 'SCSS', 'languages', 'advanced', { href: 'https://sass-lang.com/' }),
  s('python', 'Python', 'languages', 'learning', { href: 'https://www.python.org/' }),
  s('sql', 'SQL', 'languages', 'familiar', { hidden: true }),
  s('nosql', 'NoSQL', 'languages', 'familiar', {
    href: 'https://www.mongodb.com/',
    hidden: true,
  }),
  s('react', 'React', 'frameworks', 'advanced', { href: 'https://react.dev/', mostUsed: true }),
  s('nextjs', 'Next.js', 'frameworks', 'advanced', { href: 'https://nextjs.org/', mostUsed: true }),
  s('vuejs', 'Vue.js', 'frameworks', 'advanced', { href: 'https://vuejs.org/', mostUsed: true }),
  s('nuxt', 'Nuxt', 'frameworks', 'advanced', { href: 'https://nuxt.com/' }),
  s('reactrouter', 'React Router', 'frameworks', 'proficient', {
    href: 'https://reactrouter.com/',
  }),
  s('nestjs', 'NestJS', 'frameworks', 'proficient', { href: 'https://nestjs.com/', mostUsed: true }),
  s('tanstack', 'TanStack Query', 'state-data', 'proficient', {
    href: 'https://tanstack.com/query',
  }),
  s('zustand', 'Zustand', 'state-data', 'proficient', { href: 'https://zustand-demo.pmnd.rs/' }),
  s('pinia', 'Pinia', 'state-data', 'proficient', { href: 'https://pinia.vuejs.org/' }),
  s('reacthookform', 'React Hook Form', 'state-data', 'proficient', {
    href: 'https://react-hook-form.com/',
  }),
  s('zod', 'Zod', 'state-data', 'proficient', { href: 'https://zod.dev/' }),
  s('prisma', 'Prisma', 'state-data', 'familiar', { href: 'https://www.prisma.io/' }),
  s('tailwindcss', 'Tailwind CSS', 'ui-styling', 'advanced', {
    href: 'https://tailwindcss.com/',
    mostUsed: true,
  }),
  s('shadcn', 'shadcn/ui', 'ui-styling', 'advanced', { href: 'https://ui.shadcn.com/' }),
  s('radix', 'Radix UI', 'ui-styling', 'advanced', { href: 'https://www.radix-ui.com/' }),
  s('antd', 'Ant Design', 'ui-styling', 'advanced', { href: 'https://ant.design/' }),
  s('bootstrap', 'Bootstrap', 'ui-styling', 'advanced', { href: 'https://getbootstrap.com/' }),
  s('framermotion', 'Framer Motion', 'ui-styling', 'learning', {
    href: 'https://www.framer.com/motion/',
  }),
  s('gsap', 'GSAP', 'ui-styling', 'proficient', { href: 'https://gsap.com/' }),
  s('threejs', 'Three.js', 'ui-styling', 'learning', { href: 'https://threejs.org/' }),
  s('lighthouse', 'Lighthouse', 'performance', 'proficient', {
    href: 'https://developer.chrome.com/docs/lighthouse',
  }),
  s('wcag', 'WCAG', 'accessibility', 'familiar'),
  s('aria', 'ARIA', 'accessibility', 'familiar', {
    href: 'https://www.w3.org/WAI/ARIA/apg/',
  }),
  s('vitest', 'Vitest', 'testing', 'proficient', { href: 'https://vitest.dev/' }),
  s('testinglibrary', 'Testing Library', 'testing', 'familiar', {
    href: 'https://testing-library.com/',
  }),
  s('playwright', 'Playwright', 'testing', 'proficient', { href: 'https://playwright.dev/' }),
  s('storybook', 'Storybook', 'testing', 'proficient', { href: 'https://storybook.js.org/' }),
  s('cicd', 'CI/CD', 'testing', 'familiar'),
  s('cursor', 'Cursor', 'ai-assisted', 'proficient', { href: 'https://cursor.com/' }),
  s('claudecode', 'Claude Code', 'ai-assisted', 'proficient', {
    href: 'https://docs.anthropic.com/en/docs/claude-code',
  }),
  s('git', 'Git', 'tooling', 'advanced', { href: 'https://git-scm.com/' }),
  s('github', 'GitHub', 'tooling', 'advanced', { href: 'https://github.com/' }),
  s('nodejs', 'Node.js', 'tooling', 'proficient', { href: 'https://nodejs.org/en/' }),
  s('expressjs', 'Express.js', 'tooling', 'proficient', { href: 'https://expressjs.com/' }),
  s('django', 'Django', 'tooling', 'familiar', { href: 'https://www.djangoproject.com/' }),
  s('nitro', 'Nitro', 'tooling', 'proficient', { href: 'https://nitro.build/' }),
  s('mongodb', 'MongoDB', 'tooling', 'familiar', { href: 'https://www.mongodb.com/', mostUsed: true }),
  s('postgres', 'PostgreSQL', 'tooling', 'learning', { href: 'https://www.postgresql.org/' }),
  s('mysql', 'MySQL', 'tooling', 'learning', { href: 'https://www.mysql.com/' }),
  s('redis', 'Redis', 'tooling', 'familiar', { href: 'https://redis.io/' }),
  s('websocket', 'WebSocket', 'tooling', 'familiar'),
  s('socketio', 'Socket.IO', 'tooling', 'familiar', { href: 'https://socket.io/' }),
  s('jwt', 'JWT', 'tooling', 'familiar'),
  s('nx', 'Nx', 'tooling', 'proficient', { href: 'https://nx.dev/' }),
  s('docker', 'Docker', 'tooling', 'familiar', { href: 'https://www.docker.com/' }),
  s('pnpm', 'pnpm', 'tooling', 'familiar', { href: 'https://pnpm.io/', hidden: true }),
  s('yarn', 'Yarn', 'tooling', 'familiar', { href: 'https://yarnpkg.com/', hidden: true }),
  s('vite', 'Vite', 'tooling', 'familiar', { href: 'https://vitejs.dev/' }),
  s('postman', 'Postman', 'tooling', 'familiar', { href: 'https://www.postman.com/' }),
  s('vercel', 'Vercel', 'tooling', 'familiar', { href: 'https://vercel.com/' }),
  s('jira', 'Jira', 'tooling', 'familiar', {
    href: 'https://www.atlassian.com/software/jira',
    hidden: true,
  }),
  s('datadog', 'Datadog', 'tooling', 'learning', { href: 'https://www.datadoghq.com/' }),
  s('sanity', 'Sanity', 'tooling', 'familiar', { href: 'https://www.sanity.io/' }),
  s('stripe', 'Stripe', 'tooling', 'familiar', { href: 'https://stripe.com/' }),
]

export const projects: Project[] = [
  {
    slug: 'tbchat',
    name: 'TBchat',
    description: {
      vi: 'Nền tảng nhắn tin phi tập trung, mã hóa đầu-cuối, tự dịch thời gian thực trên web và mobile tại 8 thị trường.',
      en: 'Decentralized, end-to-end encrypted messaging with real-time auto-translation across web and mobile in 8 markets.',
    },
    type: 'work',
    tech: ['nuxt', 'vuejs', 'typescript', 'pinia', 'tailwindcss', 'nitro', 'redis', 'playwright'],
    year: 2025,
    featured: true,
    links: { demo: 'https://im.tb.ink/' },
  },
  {
    slug: 'tb-wallet',
    name: 'TB Wallet',
    description: {
      vi: 'Website ví crypto đa chuỗi: trang sản phẩm, hỗ trợ, pháp lý, i18n và hero WebGL tương tác.',
      en: 'Multi-chain crypto-wallet website covering product, support, legal, i18n, and an interactive WebGL hero.',
    },
    type: 'work',
    tech: ['nextjs', 'react', 'typescript', 'tailwindcss', 'radix', 'threejs', 'docker'],
    year: 2025,
    featured: true,
    links: { demo: 'https://wallet.tb.ink/' },
  },
  {
    slug: 'pinance',
    name: 'Pinance',
    description: {
      vi: 'Nền tảng quản lý hóa đơn điện tử, đồng bộ cơ quan thuế, điều chỉnh, xuất và tự lưu nháp.',
      en: 'Electronic-invoice platform syncing with tax authorities, with adjustment, export, and auto-save workflows.',
    },
    type: 'work',
    tech: ['vuejs', 'bootstrap', 'websocket', 'django'],
    year: 2024,
    featured: true,
    links: { demo: 'https://app.pinance.vn/' },
  },
  {
    slug: 'portfolio-2026',
    name: 'Portfolio 2026',
    description: {
      vi: 'Bản thiết kế hiện tại của trang này — monorepo nhiều version, nội dung dùng chung, song ngữ vi/en.',
      en: 'The current design of this site — a multi-version monorepo with shared content and vi/en localization.',
    },
    type: 'self',
    tech: ['nextjs', 'typescript', 'tailwindcss', 'gsap'],
    year: 2026,
    featured: true,
    links: {
      demo: 'https://luongviphu.vercel.app/',
      source: 'https://github.com/LVIPHU/portfolio',
    },
  },
  {
    slug: 'portfolio-2025',
    name: 'Portfolio 2025',
    description: {
      vi: 'Bản thiết kế 2025 của cùng monorepo — vẫn chạy song song trên stack khóa chung.',
      en: 'The 2025 design of the same monorepo, still shipping in parallel on the locked shared stack.',
    },
    type: 'self',
    tech: ['nextjs', 'typescript', 'tailwindcss'],
    year: 2025,
    featured: false,
    links: {
      demo: 'https://v1-luongviphu.vercel.app/about',
      source: 'https://github.com/LVIPHU/portfolio',
    },
  },
  {
    slug: 'zerohomstay',
    name: 'Zerohomstay',
    description: {
      vi: 'Trang tìm homestay và phòng khách sạn với tìm kiếm, danh sách và luồng đặt chỗ.',
      en: 'Homestay and hotel-room discovery site with search, listing and booking flows.',
    },
    type: 'self',
    tech: ['nextjs', 'shadcn', 'sanity', 'stripe'],
    year: 2025,
    featured: false,
    image: '/static/images/projects/3.jpg',
    links: {
      demo: 'https://zerohomstay.vercel.app',
      source: 'https://github.com/LVIPHU/hotel-management',
    },
  },
  {
    slug: 'appchat',
    name: 'AppChat',
    description: {
      vi: 'Ứng dụng chat thời gian thực, nhắn tin an toàn và cộng tác nhóm.',
      en: 'A real-time chat app for secure messaging and effortless group collaboration.',
    },
    type: 'self',
    tech: ['mongodb', 'nodejs', 'expressjs', 'react', 'antd', 'socketio'],
    year: 2024,
    featured: false,
    image: '/static/images/projects/4.jpg',
    links: { source: 'https://github.com/LVIPHU/AppChat-v2.0.0' },
  },
  {
    slug: 'shopology',
    name: 'Shopology',
    description: {
      vi: 'Nền tảng thương mại điện tử xây bằng stack MERN.',
      en: 'E-commerce platform built with the MERN stack.',
    },
    type: 'self',
    tech: ['mongodb', 'nodejs', 'expressjs', 'react', 'bootstrap'],
    year: 2023,
    featured: false,
    image: '/static/images/projects/5.jpg',
    links: { source: 'https://github.com/LVIPHU/MERN_SHOP' },
  },
  {
    slug: 'bac-ha',
    name: 'Bạc Hà',
    description: {
      vi: 'Dự án làm thuê — giữ trên site 2025, ẩn khỏi danh sách nổi bật.',
      en: 'Client work retained on the 2025 site, hidden from featured lists.',
    },
    type: 'work',
    tech: [],
    year: 2023,
    featured: false,
    hidden: true,
    image: '/static/images/projects/1.jpg',
    links: {},
  },
  {
    slug: 'hong-vi',
    name: 'Hồng Vĩ Automations',
    description: {
      vi: 'Dự án làm thuê — giữ trên site 2025, ẩn khỏi danh sách nổi bật.',
      en: 'Client work retained on the 2025 site, hidden from featured lists.',
    },
    type: 'work',
    tech: [],
    year: 2023,
    featured: false,
    hidden: true,
    image: '/static/images/projects/2.jpg',
    links: {},
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const me = { profile, education, experience, skills, projects }

export function skillNames(ids: SkillId[]): string[] {
  const byId = new Map(skills.map((skill) => [skill.id, skill.name]))
  return ids.map((id) => byId.get(id) ?? id)
}
