import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@portfolio/ui'
import { SocialIcons } from '@portfolio/icons'
import {
  type Company,
  type Product,
  SKILLS_2025 as SKILLS,
  EXPERIENCES_2025 as EXPERIENCES,
} from '@portfolio/content/data2025'
import { Reveal } from '@portfolio/ui/motion'
import {
  Container,
  LinkPreview,
  Timeline,
  TimelineItemDateRange,
  TimelineItemDescription,
  TimelineItemSmallText,
} from '@/components/atoms'
import { useLocale, useTranslations } from 'next-intl'
import type { Localized } from '@portfolio/content/data2025'

/** Data giờ là Localized {vi,en} từ @portfolio/content — render theo locale hiện tại */
type DataMsg = (message: Localized | string | undefined) => string
const makeDataMsg =
  (locale: 'vi' | 'en'): DataMsg =>
  (message) => {
    if (!message) return ''
    if (typeof message === 'string') return message
    return message[locale] ?? message.vi
  }

/** YYYY-MM → Date local (tránh `new Date('2025-06')` lệch UTC). */
function parseMonth(value: string): Date {
  const [year, month] = value.split('-')
  return new Date(Number(year), Number(month ?? 1) - 1, 1)
}

function TechnologyIcons({ technologies }: { technologies: string[] }) {
  const t = useTranslations()
  return (
    <div className='flex flex-wrap items-center space-x-2 pt-1 text-xs'>
      <span className='mr-2'>{t('Experience.technologiesUsed')}:</span>
      {technologies.map((tech) => {
        const skill = SKILLS.find((s) => s.id === tech)
        if (!skill) return null
        return (
          <SocialIcons
            key={skill.id}
            kind={skill.id}
            size={16}
            iconType={skill.href ? 'link' : 'icon'}
            href={skill.href}
          />
        )
      })}
    </div>
  )
}

function createTimelineItems(products: Product[], dataMsg: DataMsg) {
  return products
    .filter((product) => !product.hidden)
    .map((product) => ({
      title: product.name,
      content: (
        <>
          <TimelineItemSmallText>{dataMsg(product.role)}</TimelineItemSmallText>
          <TimelineItemDateRange
            startDate={parseMonth(product.start)}
            endDate={product.end ? parseMonth(product.end) : undefined}
          />
          <TimelineItemDescription>{dataMsg(product.description)}</TimelineItemDescription>
          {product.stack.length > 0 && <TechnologyIcons technologies={product.stack} />}
        </>
      ),
    }))
}

export function Experience() {
  const t = useTranslations()
  const dataMsg = makeDataMsg(useLocale() as 'vi' | 'en')
  return (
    <Container className='w-full py-5 md:py-10'>
      <Reveal direction={'horizontal'} reverse={true}>
        <h3 className='heading-section'>{t('Experience.experience')}</h3>
      </Reveal>
      <Reveal className='mt-5'>
        <Tabs
          defaultValue={EXPERIENCES[0]?.id}
          className='flex flex-col md:flex-row md:space-x-4'
          orientation='vertical'
        >
          <TabsList className={`flex h-max w-full flex-col space-y-2 md:w-64`}>
            {EXPERIENCES.map((company, idx) => (
              <HoverCard key={`trigger-${company.id}`}>
                <TabsTrigger className='flex w-full text-left' value={company.id}>
                  <Reveal className={'w-full'} delay={idx * 0.1} direction={'horizontal'} reverse={true}>
                    <HoverCardTrigger render={<div className='flex w-full items-center justify-between' />}>
                      <span>{company.name}</span>
                      <span
                        className={`mx-1 inline-block h-3 w-3 rounded-full ${company.active ? 'bg-amber-500' : ''}`}
                      />
                    </HoverCardTrigger>
                  </Reveal>
                </TabsTrigger>
                <HoverCardContent className='mt-3 w-96'>
                  <div className='flex justify-between space-x-4'>
                    <Avatar>
                      <AvatarFallback>{company.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h4 className='text-sm font-semibold'>@{company.name}</h4>
                      <h4 className='text-sm font-semibold'>{dataMsg(company.location)}</h4>
                      <p className='text-sm'>{dataMsg(company.role)}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </TabsList>
          <Separator
            orientation='vertical'
            className='mx-[15px] hidden data-[orientation=vertical]:h-56 data-[orientation=vertical]:w-px md:flex'
          />
          {EXPERIENCES.map((company: Company) => (
            <TabsContent key={company.id} value={company.id} className='mt-4 w-full md:mt-0'>
              <Card className='border-none shadow-sm outline-none ring-0'>
                <CardHeader>
                  <Reveal>
                    <CardTitle>
                      <LinkPreview url={company.url || '#'}>
                        <span className='px-0 text-2xl'>{company.name}</span>
                      </LinkPreview>
                    </CardTitle>
                    <CardDescription>{dataMsg(company.role)}</CardDescription>
                  </Reveal>
                </CardHeader>
                <CardContent>
                  <Timeline data={createTimelineItems(company.products, dataMsg)} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </Reveal>
    </Container>
  )
}
