import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { profile } from '@portfolio/content'

// Chrome portfolio (nav + khung + footer) cho tất cả trang thường.
// Trang /about nằm ở route group (showcase) nên KHÔNG dùng layout này.
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav name={profile.name} />
      <main className='w-full flex-1 py-10' style={{ paddingInline: 'var(--safe)' }}>
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
