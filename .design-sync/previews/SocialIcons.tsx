import { SocialIcons } from 'web-2025'

// kind là key của iconsMap (tech icons: typescript, react, nextjs, tailwindcss, nodejs,
// github, vercel, git, graphql, mongodb...). iconType: link (mặc định) | button | icon.

export const TechStackLinks = () => (
  <div className="flex items-center justify-center gap-4" style={{ padding: 20 }}>
    <SocialIcons kind="typescript" href="https://www.typescriptlang.org" />
    <SocialIcons kind="react" href="https://react.dev" />
    <SocialIcons kind="nextjs" href="https://nextjs.org" />
    <SocialIcons kind="tailwindcss" href="https://tailwindcss.com" />
    <SocialIcons kind="nodejs" href="https://nodejs.org" />
    <SocialIcons kind="mongodb" href="https://www.mongodb.com" />
  </div>
)

export const IconButtons = () => (
  <div className="flex items-center justify-center gap-3" style={{ padding: 20 }}>
    <SocialIcons kind="github" href="https://github.com/LVIPHU" iconType="button" size={5} />
    <SocialIcons kind="git" href="https://git-scm.com" iconType="button" size={5} />
    <SocialIcons kind="graphql" href="https://graphql.org" iconType="button" size={5} />
    <SocialIcons kind="vercel" href="https://vercel.com" iconType="button" size={5} />
  </div>
)

export const ButtonsWithText = () => (
  <div className="flex items-center justify-center gap-3" style={{ padding: 20 }}>
    <SocialIcons kind="github" href="https://github.com/LVIPHU/portfolio" iconType="button" text="Xem source" size={5} />
    <SocialIcons kind="vercel" href="https://web-2026.vercel.app" iconType="button" variant="secondary" text="Live demo" size={5} />
  </div>
)
