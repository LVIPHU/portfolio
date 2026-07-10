import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'web-2025'

export const ProjectIntro = () => (
  <Card style={{ maxWidth: 420 }}>
    <CardHeader>
      <CardTitle>Portfolio Monorepo</CardTitle>
      <CardDescription>Next.js 15 · Turborepo · Tailwind CSS</CardDescription>
      <CardAction>
        <Badge variant='secondary'>Đang phát triển</Badge>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p className='text-muted-foreground text-sm'>
        Website portfolio song ngữ Việt/Anh với blog kỹ thuật, quản lý nội dung tập trung và deploy song song nhiều
        phiên bản trên Vercel.
      </p>
    </CardContent>
    <CardFooter style={{ gap: 8 }}>
      <Button size='sm'>Xem demo</Button>
      <Button size='sm' variant='outline'>
        Mã nguồn
      </Button>
    </CardFooter>
  </Card>
)

export const BlogSummary = () => (
  <Card style={{ maxWidth: 420 }}>
    <CardHeader>
      <CardTitle>Tối ưu hiệu năng ảnh trong Next.js</CardTitle>
      <CardDescription>12 tháng 5, 2024 · 8 phút đọc</CardDescription>
    </CardHeader>
    <CardContent>
      <p className='text-muted-foreground text-sm'>
        Hướng dẫn dùng next/image, lazy loading và định dạng AVIF để giảm LCP cho blog cá nhân.
      </p>
    </CardContent>
  </Card>
)
