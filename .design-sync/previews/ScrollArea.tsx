import { ScrollArea } from 'web-2025'

// ScrollArea (Radix) — mặc định type="hover" nên scrollbar ẩn trong screenshot;
// truyền type="always" + height cố định (inline style, spread qua Root) để thấy
// thumb bg-border. Danh sách dài hơn khung để chắc chắn có overflow.

const posts = [
  'Kiến trúc React Fiber',
  'Tối ưu hiệu năng ảnh trong Next.js',
  'Does Promise.all() run in parallel or sequential?',
  'Thiết lập monorepo với pnpm + Turborepo',
  'Dark mode với next-themes và Tailwind',
  'Viết blog song ngữ với Contentlayer',
  'Drizzle ORM và Postgres trên Vercel',
  'Deploy nhiều phiên bản portfolio song song',
  'Lazy loading và Core Web Vitals',
  'Từ Lingui sang next-intl: bài học i18n',
  'Radix UI và shadcn pattern',
  'GSAP cho animation cuộn trang',
]

export const RecentPostsPanel = () => (
  <ScrollArea className='rounded-md border' {...({ type: 'always', style: { height: 240, width: 340 } } as any)}>
    <div className='p-4' style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className='text-muted-foreground text-xs font-medium'>BÀI VIẾT GẦN ĐÂY</p>
      {posts.map((title) => (
        <p key={title} className='text-sm'>
          {title}
        </p>
      ))}
    </div>
  </ScrollArea>
)
