import { type Experience, experienceData, skillsData } from '@data/main'
import {
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
import { Trans } from '@lingui/react/macro'

function TechnologyIcons({ technologies }: { technologies: string[] }) {
  return (
    <div className='flex flex-wrap items-center space-x-2 pt-1 text-xs'>
      <span className='mr-2'>
        <Trans>Technologies used</Trans>:
      </span>
      {technologies.map((tech) => {
        const skill = skillsData.find((skill) => skill.id === tech)
        if (!skill) return null
        return <SocialIcons key={skill.id} kind={skill.id} size={4} iconType='link' href={skill.href} />
      })}
    </div>
  )
}

function createTimelineItems(experiences: Experience[]) {
  return experiences.map((experience) => ({
    title: experience.title,
    content: (
      <>
        <TimelineItemSmallText>
          {experience.roleType} - {experience.type}
        </TimelineItemSmallText>
        <TimelineItemDateRange
          startDate={new Date(experience.startDate)}
          endDate={experience.endDate ? new Date(experience.endDate) : undefined}
        />
        <TimelineItemDescription>{experience.description}</TimelineItemDescription>
        {experience.technologies && <TechnologyIcons technologies={experience.technologies} />}
      </>
    ),
    isActive: experience.active,
    isActiveBullet: experience.active,
  }))
}

export function Experience() {
  return (
    <Container className='w-full py-5 md:py-10'>
      <h3 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl'>
        <Trans>Experience</Trans>
      </h3>
      <div className='mt-5'>
        <Tabs
          defaultValue={experienceData[0]?.name}
          className='flex flex-col md:flex-row md:space-x-4'
          orientation='vertical'
        >
          <TabsList className={`flex h-max w-full flex-col space-y-2 md:w-64`}>
            {experienceData.map((company) => (
              <HoverCard key={`trigger-${company.name}`}>
                <TabsTrigger className='flex w-full text-left' value={company.name}>
                  <HoverCardTrigger asChild>
                    <div className='flex w-full items-center justify-between'>
                      <span>{company.name}</span>
                      <span
                        className={`mx-1 inline-block h-3 w-3 rounded-full ${company.active ? 'bg-amber-500' : ''}`}
                      />
                    </div>
                  </HoverCardTrigger>
                </TabsTrigger>
                <HoverCardContent className='mt-3 w-96'>
                  <div className='flex justify-between space-x-4'>
                    <Avatar>
                      <AvatarImage src={company.image} />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h4 className='text-sm font-semibold'>@{company.name}</h4>
                      <h4 className='text-sm font-semibold'>{company.location}</h4>
                      <p className='text-sm'>{company.description}</p>
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
          {experienceData.map((company) => (
            <TabsContent key={company.name} value={company.name} className='mt-4 w-full md:mt-0'>
              <Card key={`card-${company.name}`} className='border-none shadow-sm outline-none ring-0'>
                <CardHeader>
                  <CardTitle>
                    <LinkPreview url={company.url || '#'}>
                      <span className='px-0 text-2xl'>{company.name}</span>
                    </LinkPreview>
                  </CardTitle>
                  <CardDescription>{company.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Timeline data={createTimelineItems(company.items)} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Container>
  )
}
