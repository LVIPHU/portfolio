import { ArrowRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { featuredProjects, getAllPosts, profile, resume, type Locale } from '@portfolio/content'
import { Link } from '@/i18n/navigation'
import { AppearTitle } from '@/components/showcase/effects/appear-title'
import { Marquee } from '@/components/showcase/effects/marquee'
import { ListItem } from '@/components/showcase/effects/list-item'
import { PostRow } from '@/components/post-row'
import { formatDate, t } from '@/lib/utils'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tHome = await getTranslations('home')
  const posts = getAllPosts(locale).slice(0, 3)
  const techs = resume.skills.flatMap((g) => g.items)

  return (
    <div className='flex flex-col gap-24'>
      {/* Hero */}
      <section className='flex min-h-[70svh] flex-col justify-center py-8'>
        <p className='p-s text-muted-foreground'>{tHome('greeting')}</p>
        <h1 className='h1 mt-3'>{profile.name}</h1>
        <p className='h3 text-primary mt-4'>{t(profile.title, locale)}</p>
        <p className='p text-muted-foreground mt-6 max-w-xl'>{t(profile.tagline, locale)}</p>
        <div className='mt-10 flex flex-wrap gap-3'>
          <Link
            href='/projects'
            className='p-s bg-primary text-primary-foreground inline-flex items-center gap-2 px-5 py-3 transition-opacity hover:opacity-80'
          >
            {tHome('viewProjects')} <ArrowRight className='h-4 w-4' />
          </Link>
          <Link
            href='/contact'
            className='p-s border-primary text-foreground hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-2 border px-5 py-3 transition-colors'
          >
            {tHome('contactMe')}
          </Link>
        </div>
      </section>

      {/* Marquee kỹ năng */}
      <section className='-mx-[var(--safe)] overflow-hidden border-y py-4'>
        <Marquee duration={24}>
          {techs.map((tech) => (
            <span key={tech} className='h3 text-muted-foreground mx-6 whitespace-nowrap'>
              {tech}
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
          <Link href='/projects' className='p-s text-primary hover:underline'>
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
          <Link href='/blog' className='p-s text-primary hover:underline'>
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
