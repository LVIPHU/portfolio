import {
  AnimatedContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Container,
  LinkPreview,
  NavigationLink,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms'
import { Github, Linkedin } from 'lucide-react'
import { Experience, GithubCal, Header, Technologies } from '@/components/organisms'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react/macro'
import { useLingui } from '@lingui/react'
import { SITE_METADATA } from '@data/site-metadata'

export const AboutTemplate = () => {
  const { i18n } = useLingui()
  const navItems = [
    {
      title: 'LinkedIn',
      icon: <Linkedin className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
      href: SITE_METADATA.linkedIn,
    },
    {
      title: 'Github',
      icon: <Github className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
      href: SITE_METADATA.github,
    },
  ]
  return (
    <Container as={'div'}>
      <Header
        className={'mb-0 md:mb-0'}
        title={t(i18n)`About`}
        description={t(
          i18n
        )`Some interesting things about myself and my habit of coding then making things harder for myself after six months.`}
      />
      <section className={'pb-5 md:pb-10 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0'}>
        <AnimatedContent direction={'horizontal'} reverse={true} className={'pt-5 md:pt-10'}>
          <div className={'mb-7'}>
            <Avatar className='mx-auto mb-2 h-60 w-60'>
              <AvatarImage src={SITE_METADATA.avatar} alt={SITE_METADATA.author} />
              <AvatarFallback>{SITE_METADATA.author}</AvatarFallback>
            </Avatar>
            <h3 className='w-full text-center text-4xl font-bold'>{SITE_METADATA.author}</h3>
            <p className='w-full text-center text-lg'>
              <Trans>Software Engineer</Trans>
            </p>
          </div>
          <nav className={'flex items-center justify-center gap-6'}>
            <NavigationLink href={SITE_METADATA.resume}>
              <Button variant={'default'}>
                <Trans>Resume</Trans>
              </Button>
            </NavigationLink>
            <Separator orientation={'vertical'} className={'h-6'} />
            {navItems.map((item, idx) => (
              <NavigationLink key={idx} href={item.href} target={'_blank'}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className={'rounded-full'} variant='outline' size='icon'>
                        {item.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </NavigationLink>
            ))}
          </nav>
        </AnimatedContent>
        <AnimatedContent
          direction={'horizontal'}
          className={'flex flex-col gap-y-6 py-5 text-lg md:py-10 xl:col-span-2'}
        >
          <h2 className={'mb-2 text-3xl font-bold'}>
            <Trans>Hello! {String.fromCodePoint(0x1f44b)}</Trans>
          </h2>
          <span>
            <Trans>
              I am {SITE_METADATA.author}, a Software Engineer {String.fromCodePoint(0x1f4bb)} from Vietnam, with a
              passion for programming and web development, I enjoy creating innovative solutions that enhance
              performance and efficiency. My technology journey includes building e-commerce websites, data management,
              and advanced full-stack solutions. Educationally, I hold a Bachelor's degree{' '}
              {String.fromCodePoint(0x1f393)} in Information Technology.
            </Trans>
          </span>
          <span>
            <Trans>
              Currently, I am working for{' '}
              <LinkPreview url='https://pvssolution.com' className='font-semibold'>
                PVS Solution
              </LinkPreview>{' '}
              in Vietnam. I focus on creating excellent user experiences by using modern frontend architecture. Whether
              it's writing code or collaborating with cross-functional teams, I always ensure products meet the highest
              standards and deliver impressive experiences for users.
            </Trans>
          </span>
          <span>
            <Trans>
              When I'm not coding, I usually listen to music {String.fromCodePoint(0x1f3a7)} or play games{' '}
              {String.fromCodePoint(0x1f3ae)} like{' '}
              <LinkPreview url='https://www.leagueoflegends.com' className='font-semibold'>
                League of Legends
              </LinkPreview>
              ,{' '}
              <LinkPreview url='https://wutheringwaves.kurogames.com' className='font-semibold'>
                Wuthering Waves
              </LinkPreview>
              . These hobbies help me maintain creativity and relieve stress.
            </Trans>
          </span>
        </AnimatedContent>
      </section>
      <Separator className={'mt-5 md:mt-10'} />
      <Technologies />
      <Separator className={'mt-5 md:mt-10'} />
      <Experience />
      <Separator className={'mt-5 md:mt-10'} />
      <GithubCal />
    </Container>
  )
}
