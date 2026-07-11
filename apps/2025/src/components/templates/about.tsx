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
import { useTranslations } from 'next-intl'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'

export const AboutTemplate = () => {
  const t = useTranslations()
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
        title={t('Common.about')}
        description={t('About.someInterestingThingsAbout')}
      />
      <section className={'pb-5 md:pb-10 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0'}>
        <AnimatedContent direction={'horizontal'} reverse={true} className={'pt-5 md:pt-10'}>
          <div className={'mb-7'}>
            <Avatar className='mx-auto mb-2 h-60 w-60'>
              <AvatarImage src={SITE_METADATA.avatar} alt={SITE_METADATA.author} />
              <AvatarFallback>{SITE_METADATA.author}</AvatarFallback>
            </Avatar>
            <h3 className='w-full text-center text-4xl font-bold'>{SITE_METADATA.author}</h3>
            <p className='w-full text-center text-lg'>{t('About.softwareEngineer')}</p>
          </div>
          <nav className={'flex items-center justify-center gap-6'}>
            <NavigationLink href={SITE_METADATA.resume}>
              <Button variant={'default'}>{t('Common.resume')}</Button>
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
          <h2 className={'mb-2 text-3xl font-bold'}>{t('About.hello', { 0: String.fromCodePoint(0x1f44b) })}</h2>
          <span>
            {t('About.iAmASoftware', {
              0: SITE_METADATA.author ?? '',
              1: String.fromCodePoint(0x1f4bb),
              2: String.fromCodePoint(0x1f393),
            })}
          </span>
          <span>
            {t.rich('About.currentlyIAmWorking', {
              company: (chunks) => (
                <LinkPreview url='https://pvssolution.com' className='font-semibold'>
                  {chunks}
                </LinkPreview>
              ),
            })}
          </span>
          <span>
            {t.rich('About.whenIMNot', {
              0: String.fromCodePoint(0x1f3a7),
              1: String.fromCodePoint(0x1f3ae),
              lol: (chunks) => (
                <LinkPreview url='https://www.leagueoflegends.com' className='font-semibold'>
                  {chunks}
                </LinkPreview>
              ),
              ww: (chunks) => (
                <LinkPreview url='https://wutheringwaves.kurogames.com' className='font-semibold'>
                  {chunks}
                </LinkPreview>
              ),
            })}
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
