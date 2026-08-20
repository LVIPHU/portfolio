import { ArrowRight, Mail } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { featuredProjects, getAllPosts, profile, resume, type Locale } from '@portfolio/content'
import { Link } from '@portfolio/i18n/navigation'
import { AppearTitle } from '@/components/effects/appear-title'
import { PillButtonLink } from '@/components/effects/pill-button'
import { Marquee } from '@/components/effects/marquee'
import { ListItem } from '@/components/effects/list-item'
import { PostRow } from '@/components/post-row'
import { FelixHeroMark } from '@/components/brand/felix-mark'
import { EarthBackground } from '@/components/three/earth-background'
import { formatDate, t } from '@/utils/format'
export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tHome = await getTranslations('home')
  const posts = getAllPosts(locale).slice(0, 3)
  const techs = resume.skills.flatMap((g) => g.items)

  return (
    <div className='flex flex-col gap-24'>
      {/* Trái Đất đậu NỬA PHẢI hero (pose riêng của variant hero — /about giữ pose bên trái),
          mờ dần khi cuộn qua hero. withStars/withLeva=false vì layout (main) đã có canvas sao
          + panel Leva riêng. */}
      <EarthBackground variant='hero' withStars={false} withLeva={false} />
      {/* Hero full-bleed: phá lề của <main> để bắt đầu ngay đỉnh viewport, rồi tự đặt
          lề bằng token wordmark → chữ FELIX nằm chồng khít vị trí chữ trong tấm intro.
          Wordmark ở trên, phần còn lại dồn xuống đáy (bố cục lenis). */}
      <section
        className='flex h-[100svh] flex-col justify-between'
        style={{
          // Huỷ đúng padding-top của <main> (biến --main-top khai ở (main)/layout.tsx) — hai nút
          // nổi không chiếm chỗ nên hero vẫn bắt đầu ở đỉnh viewport, khớp chữ trong tấm intro.
          marginTop: 'calc(-1 * var(--main-top))',
          marginInline: 'calc(-1 * var(--safe))',
          padding: 'var(--wordmark-top) var(--wordmark-inset)',
        }}
      >
        {/* Wordmark FELIX (blackletter) — tên đầy đủ vẫn ở nav/footer/metadata */}
        <h1 className='block w-full'>
          {/* Wordmark 160px = chữ trình bày, gold được cấp phép ở cả hai theme. */}
          <FelixHeroMark fill='var(--theme-contrast)' label={profile.name} />
        </h1>
        {/* Khối dưới dồn hết sang NỬA TRÁI (cột 1→6 của lưới 12): nửa phải là chỗ của quả cầu
            Earth, chữ đè lên nó là mất cả chữ lẫn cầu. Nút dùng PillButton y như /about. */}
        {/* w-full BẮT BUỘC: .layout-grid có `margin-inline: auto`, mà margin auto theo trục ngang
            tắt luôn stretch của flex item — thiếu nó lưới co về fit-content (đo được 1520px thay
            vì 1814px) nên cột 1 không còn thẳng hàng với mép trái wordmark. */}
        <div className='layout-grid menu-button-reserve w-full'>
          <div className='col-span-full flex flex-col min-[800px]:col-span-6'>
            {/* Ngoại lệ có chủ đích: .h3 chỉ 20px comp ở mobile (1.69:1 trên nền sáng), nhưng
                dòng này đi CẶP với wordmark ngay trên nó — tách màu là gãy cặp. Cùng loại
                ngoại lệ với thanh cuộn 1.78:1 của lenis. */}
            <p className='h3' style={{ color: 'var(--theme-contrast)' }}>
              {t(profile.title, locale)}
            </p>
            <p className='p text-muted-foreground mt-6'>{t(profile.tagline, locale)}</p>
            <div className='mt-10 grid grid-cols-1 min-[800px]:grid-cols-2' style={{ gap: 'var(--gap)' }}>
              <PillButtonLink href='/projects' icon={<ArrowRight />} label={tHome('viewProjects')} />
              <PillButtonLink href='/contact' icon={<Mail />} label={tHome('contactMe')} />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee kỹ năng */}
      <section className='-mx-[var(--safe)] overflow-hidden border-y py-4'>
        <Marquee duration={24}>
          {techs.map((tech) => (
            <span key={tech} className='h3 text-muted-foreground mx-6 whitespace-nowrap'>
              {tech}
              {/* Dấu phân cách = chrome thuần nhịp, không mang thông tin → giữ gold cả hai theme */}
              <span className='text-primary mx-6'>·</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* Featured projects */}
      <section>
        <div className='mb-8 flex items-end justify-between'>
          <h2 className='h2'>
            <AppearTitle>{tHome('featuredProjects')}</AppearTitle>
          </h2>
          <Link href='/projects' className='p-s dark:text-primary hover:underline'>
            {tHome('viewAll')} →
          </Link>
        </div>
        <div>
          {featuredProjects.map((project, i) => (
            <ListItem
              key={project.slug}
              title={project.name}
              source={project.tech.join(' · ')}
              href={project.links.demo ?? project.links.source ?? '#'}
              index={i}
              visible
            />
          ))}
        </div>
      </section>

      {/* Latest posts */}
      <section>
        <div className='mb-8 flex items-end justify-between'>
          <h2 className='h2'>
            <AppearTitle>{tHome('latestPosts')}</AppearTitle>
          </h2>
          <Link href='/blog' className='p-s dark:text-primary hover:underline'>
            {tHome('viewAll')} →
          </Link>
        </div>
        <div>
          {posts.map((post) => (
            <PostRow key={post.slug} slug={post.slug} title={post.title} date={formatDate(post.date, locale)} />
          ))}
        </div>
      </section>
    </div>
  )
}
