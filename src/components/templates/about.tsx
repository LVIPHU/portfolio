import {
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
        <div className={'pt-5 md:pt-10'}>
          <div className={'mb-7'}>
            <Avatar className='mx-auto mb-2 h-60 w-60'>
              <AvatarImage src='/static/images/avatars/main.jpg' alt={SITE_METADATA.author} />
              <AvatarFallback>{SITE_METADATA.author}</AvatarFallback>
            </Avatar>
            <h3 className='w-full text-center text-4xl font-bold'>{SITE_METADATA.author}</h3>
            <p className='w-full text-center text-lg'>Software Engineer</p>
          </div>
          <nav className={'flex items-center justify-center gap-6'}>
            <NavigationLink href={SITE_METADATA.resume}>
              <Button variant={'default'}>Resume</Button>
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
        </div>
        <div className={'flex flex-col gap-y-6 py-5 text-lg md:py-10 xl:col-span-2'}>
          <h2 className={'mb-2 text-3xl font-bold'}>Xin chào! {String.fromCodePoint(0x1f44b)}</h2>
          <span>
            Tôi là {SITE_METADATA.author}, một Kỹ sư Phần mềm {String.fromCodePoint(0x1f4bb)} đến từ Việt Nam, với niềm
            đam mê về lập trình và phát triển web, tôi thích tạo ra những giải pháp sáng tạo giúp nâng cao hiệu suất và
            hiệu quả. Hành trình công nghệ của tôi bao gồm việc xây dựng các trang web thương mại, quản lý dữ liệu và
            các giải pháp full-stack tiên tiến. Về học vấn, tôi có bằng Kỹ sư {String.fromCodePoint(0x1f393)} Công nghệ
            Thông tin.
          </span>
          <span>
            Hiện giờ tôi đang làm việc cho công ty{' '}
            <LinkPreview url='https://pvssolution.com' className='font-semibold'>
              PVS Solution
            </LinkPreview>{' '}
            tại Việt Nam. Tôi tập trung tạo ra trải nghiệm người dùng tốt bằng cách sử dụng kiến trúc frontend hiện đại.
            Dù là viết code hay phối hợp với các nhóm đa chức năng, tôi luôn đảm bảo sản phẩm đạt tiêu chuẩn cao nhất và
            mang đến trải nghiệm ấn tượng cho người dùng.
          </span>
          <span>
            Khi tôi không code tôi thường nghe nhạc {String.fromCodePoint(0x1f3a7)} hoặc chơi các tựa game{' '}
            {String.fromCodePoint(0x1f3ae)} như{' '}
            <LinkPreview url='https://www.leagueoflegends.com' className='font-semibold'>
              League of Legends
            </LinkPreview>
            ,{' '}
            <LinkPreview url='https://wutheringwaves.kurogames.com' className='font-semibold'>
              Wuthering Waves
            </LinkPreview>
            . Những sở thích này giúp tôi duy trì sự sáng tạo và giải tỏa những căng thẳng.
          </span>
        </div>
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
