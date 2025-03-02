import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  LinkPreview,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/atoms'
import { Trans } from '@lingui/react/macro'
import { Facebook, Github } from 'lucide-react'
import Link from 'next/link'
import { Footer, Header, Layout } from '@/components/organisms'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const AboutTemplate = () => {
  const { i18n } = useLingui()
  const navItems = [
    {
      title: <Trans>Facebook</Trans>,
      icon: <Facebook className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
      href: `https://www.facebook.com/phuphu.phang.54`
    },
    {
      title: <Trans>Github</Trans>,
      icon: <Github className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
      href: `https://github.com/LVIPHU`
    }
  ]
  return (
    <Layout>
      <Header
        className={'mb-0'}
        title={t(i18n)`Giới thiệu`}
        description={t(
          i18n
        )`Một số điều thú vị về bản thân và sở thích viết code rồi tự làm khó chính mình sau 6 tháng.`}
      />
      <article className={'xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0'}>
        <div className={'pt-8'}>
          <div className={'mb-7'}>
            <Avatar className='h-60 w-60 mx-auto mb-2'>
              <AvatarImage src='/images/avatars/main.jpg' alt='@shadcn' />
              <AvatarFallback>{process.env.owner}</AvatarFallback>
            </Avatar>
            <h3 className='w-full text-center text-4xl font-bold'>{process.env.owner}</h3>
            <p className='w-full text-center text-lg'>Software Engineer</p>
          </div>
          <address className={'flex gap-6 justify-center items-center'}>
            <Button variant={'default'}>
              <Trans>Resume</Trans>
            </Button>
            <Separator orientation={'vertical'} className={'h-6'} />
            {navItems.map((item, idx) => (
              <Link key={idx} href={item.href} target={'_blank'}>
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
              </Link>
            ))}
          </address>
        </div>
        <div className={'py-8 xl:col-span-2 flex flex-col gap-y-3.5'}>
          <h2 className={'text-2xl font-bold'}>
            Xin chào! {String.fromCodePoint(0x1f44b)}, tôi là {process.env.owner}
          </h2>
          <span>
            Tôi là một Kỹ sư Phần mềm {String.fromCodePoint(0x1f4bb)} đến từ Việt Nam, với niềm đam mê về lập trình và
            phát triển web, tôi thích tạo ra những giải pháp sáng tạo giúp nâng cao hiệu suất và hiệu quả. Hành trình
            công nghệ của tôi bao gồm việc xây dựng các trang web thương mại, quản lý dữ liệu và các giải pháp
            full-stack tiên tiến. Về học vấn, tôi có bằng Kỹ sư {String.fromCodePoint(0x1f393)} Công nghệ Thông tin.
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
        <div></div>
      </article>
      <Footer description={t(i18n)`Vài dòng chia sẻ về bản thân.`} />
    </Layout>
  )
}
