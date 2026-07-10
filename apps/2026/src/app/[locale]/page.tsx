import { ArrowRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { featuredProjects, getAllPosts, profile, type Locale } from '@portfolio/content'
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@portfolio/ui'
import { ProjectCard } from '@/components/project-card'
import { PostCard } from '@/components/post-card'
import { t } from '@/lib/utils'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tHome = await getTranslations('home')
  const tProjects = await getTranslations('projects')
  const posts = getAllPosts(locale).slice(0, 3)

  return (
    <div className='flex flex-col gap-16'>
      {/* Hero */}
      <section className='py-8 sm:py-16'>
        <p className='text-muted-foreground'>{tHome('greeting')}</p>
        <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>{profile.name}</h1>
        <p className='text-primary mt-3 text-xl'>{t(profile.title, locale)}</p>
        <p className='text-muted-foreground mt-4 max-w-xl'>{t(profile.tagline, locale)}</p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Link href='/projects' className={buttonVariants()}>
            {tHome('viewProjects')} <ArrowRight className='h-4 w-4' />
          </Link>
          <Link href='/contact' className={buttonVariants({ variant: 'outline' })}>
            {tHome('contactMe')}
          </Link>
        </div>
      </section>

      {/* Featured projects */}
      <section>
        <div className='mb-6 flex items-baseline justify-between'>
          <h2 className='text-2xl font-semibold tracking-tight'>{tHome('featuredProjects')}</h2>
          <Link href='/projects' className='text-primary text-sm hover:underline'>
            {tHome('viewAll')} →
          </Link>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              demoLabel={tProjects('demo')}
              sourceLabel={tProjects('source')}
            />
          ))}
        </div>
      </section>

      {/* Latest posts */}
      <section>
        <div className='mb-6 flex items-baseline justify-between'>
          <h2 className='text-2xl font-semibold tracking-tight'>{tHome('latestPosts')}</h2>
          <Link href='/blog' className='text-primary text-sm hover:underline'>
            {tHome('viewAll')} →
          </Link>
        </div>
        <div className='flex flex-col gap-4'>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  )
}
