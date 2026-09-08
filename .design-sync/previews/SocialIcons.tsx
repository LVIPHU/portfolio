import { SocialIcons } from '@portfolio/icons'

// kind là key của ICONS (typescript, react, nextjs, …). iconType: link (mặc định) | icon.
// size là pixel (16 / 20 / 32), không phải unit Tailwind.

export const TechStackLinks = () => (
  <div className='flex items-center justify-center gap-4' style={{ padding: 20 }}>
    <SocialIcons kind='typescript' href='https://www.typescriptlang.org' />
    <SocialIcons kind='react' href='https://react.dev' />
    <SocialIcons kind='nextjs' href='https://nextjs.org' />
    <SocialIcons kind='tailwindcss' href='https://tailwindcss.com' />
    <SocialIcons kind='nodejs' href='https://nodejs.org' />
    <SocialIcons kind='mongodb' href='https://www.mongodb.com' />
  </div>
)

export const IconOnly = () => (
  <div className='flex items-center justify-center gap-3' style={{ padding: 20 }}>
    <SocialIcons kind='github' href='https://github.com/LVIPHU' iconType='icon' size={20} />
    <SocialIcons kind='git' href='https://git-scm.com' iconType='icon' size={20} />
    <SocialIcons kind='graphql' href='https://graphql.org' iconType='icon' size={20} />
    <SocialIcons kind='vercel' href='https://vercel.com' iconType='icon' size={20} />
  </div>
)

export const LinksWithText = () => (
  <div className='flex items-center justify-center gap-3' style={{ padding: 20 }}>
    <SocialIcons kind='github' href='https://github.com/LVIPHU/portfolio' text='Xem source' size={20} />
    <SocialIcons kind='vercel' href='https://web-2026.vercel.app' text='Live demo' size={20} />
  </div>
)
