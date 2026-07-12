import {
  type Experience2025 as Experience,
  EXPERIENCES_2025 as EXPERIENCES,
  SKILLS_2025 as SKILLS,
} from '@portfolio/content/data2025'
import {
  Reveal,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkPreview,
  Separator,
  SocialIcons,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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

function TechnologyIcons({ technologies }: { technologies: string[] }) {
  const t = useTranslations()
  return (
    <div className='flex flex-wrap items-center space-x-2 pt-1 text-xs'>
      <span className='mr-2'>{t('Experience.technologiesUsed')}:</span>
      {technologies.map((tech) => {
        const skill = SKILLS.find((skill) => skill.id === tech)
        if (!skill) return null
        return <SocialIcons key={skill.id} kind={skill.id} size={4} iconType='link' href={skill.href} />
      })}
    </div>
  )
}

function createTimelineItems(experiences: Experience[], dataMsg: DataMsg) {
  return experiences.map((experience) => ({
    title: dataMsg(experience.title),
    content: (
      <>
        <TimelineItemSmallText>
          {dataMsg(experience.roleType)} - {dataMsg(experience.type)}
        </TimelineItemSmallText>
        <TimelineItemDateRange
          startDate={new Date(experience.startDate)}
          endDate={experience.endDate ? new Date(experience.endDate) : undefined}
        />
        <TimelineItemDescription>{dataMsg(experience.description)}</TimelineItemDescription>
        {experience.technologies && <TechnologyIcons technologies={experience.technologies} />}
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
        <h3 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl'>
          {t('Experience.experience')}
        </h3>
      </Reveal>
      <Reveal className='mt-5'>
        <Tabs
          defaultValue={EXPERIENCES[0]?.name}
          className='flex flex-col md:flex-row md:space-x-4'
          orientation='vertical'
        >
          <TabsList className={`flex h-max w-full flex-col space-y-2 md:w-64`}>
            {EXPERIENCES.map((company, idx) => (
              <HoverCard key={`trigger-${company.name}`}>
                <TabsTrigger className='flex w-full text-left' value={company.name}>
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
                      <AvatarImage src={company.image} />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h4 className='text-sm font-semibold'>@{company.name}</h4>
                      <h4 className='text-sm font-semibold'>{dataMsg(company.location)}</h4>
                      <p className='text-sm'>{dataMsg(company.description)}</p>
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
          {EXPERIENCES.map((company) => (
            <TabsContent key={company.name} value={company.name} className='mt-4 w-full md:mt-0'>
              <Card key={`card-${company.name}`} className='border-none shadow-sm outline-none ring-0'>
                <CardHeader>
                  <Reveal>
                    <CardTitle>
                      <LinkPreview url={company.url || '#'}>
                        <span className='px-0 text-2xl'>{company.name}</span>
                      </LinkPreview>
                    </CardTitle>
                    <CardDescription>{dataMsg(company.description)}</CardDescription>
                  </Reveal>
                </CardHeader>
                <CardContent>
                  <Timeline data={createTimelineItems(company.items, dataMsg)} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </Reveal>
    </Container>
  )
}
