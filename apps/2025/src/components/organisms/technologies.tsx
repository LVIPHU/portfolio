'use client'
import { useTranslations } from 'next-intl'
import {
  AnimatedContent,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  NavigationLink,
  Pagination,
  PaginationContent,
  PaginationItem,
  SocialIcons,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms'
import { useState } from 'react'
import { type Skill2025 as Skill, SKILLS_2025 as SKILLS } from '@portfolio/content/data2025'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function filterSkillsData(skillsData: Skill[]) {
  const acc: Record<string, Skill[]> = { 'Most Used': [] }

  skillsData.forEach((skill) => {
    if (!skill.hidden) {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)

      // If the skill is most used, add it to the "Most Used" category
      if (skill.mostUsed) {
        acc['Most Used'].push(skill)
      }
    }
  })

  return acc
}

export const Technologies = () => {
  const t = useTranslations()
  const filteredSkillsData = filterSkillsData(SKILLS)
  const categories = Object.keys(filteredSkillsData)
  const [tabIndex, setTabIndex] = useState(0)

  const onTabChange = (value: string) => {
    const index = categories.indexOf(value)
    setTabIndex(index)
  }

  const onNextTab = () => {
    const nextIndex = (tabIndex + 1) % categories.length
    setTabIndex(nextIndex)
  }

  const onPrevTab = () => {
    const prevIndex = (tabIndex - 1 + categories.length) % categories.length
    setTabIndex(prevIndex)
  }

  return (
    <Container className={'py-5 md:py-10'}>
      <AnimatedContent direction={'horizontal'} reverse={true}>
        <h3
          className={
            'md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl'
          }
        >
          {t('Technologies.technologiesIVeWorked')}
        </h3>
      </AnimatedContent>
      <TooltipProvider>
        <Tabs
          value={categories[tabIndex]}
          defaultValue={categories[0]}
          onValueChange={onTabChange}
          className={'mt-5 md:mt-10'}
        >
          <TabsList className='h-27 grid w-full grid-cols-2 gap-2 md:h-9 md:grid-cols-4 md:gap-1 xl:gap-2'>
            {categories.map((category) => (
              <TabsTrigger key={'trigger-' + category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => {
            return (
              <TabsContent key={'content-' + category} value={category}>
                <Card>
                  <CardHeader>
                    <AnimatedContent direction={'horizontal'}>
                      <CardTitle>{t('Technologies.msg', { category })}</CardTitle>
                      {category === 'Most Used' && (
                        <CardDescription>{t('Technologies.theseAreMyMost')}</CardDescription>
                      )}
                    </AnimatedContent>
                  </CardHeader>
                  <CardContent>
                    <AnimatedContent
                      distance={20}
                      className='grid grid-cols-5 gap-4 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-10'
                    >
                      {filteredSkillsData[category].map((skill) => (
                        <Tooltip key={`${category}-icon-${skill.name}`}>
                          <TooltipTrigger render={<NavigationLink className={'w-full'} href={skill.href} />}>
                            <Button
                              variant={'outline'}
                              className={`h-14 w-full p-2 sm:p-2 ${skill.level === 'learning' ? 'border border-amber-500' : ''}`}
                            >
                              <SocialIcons className={'size-5 md:size-10'} kind={skill.id} iconType={'icon'} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{skill.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </AnimatedContent>
                  </CardContent>
                  {category !== 'Most Used' && (
                    <CardFooter className='bg-muted/50 flex flex-row items-center justify-between border-t px-6 py-3'>
                      <div className='text-muted-foreground flex items-center text-xs'>
                        <span className='mx-1 inline-block h-3 w-3 rounded-full bg-amber-500'></span>
                        <span>{t('Technologies.currentlyLearning')}</span>
                      </div>
                      <Pagination className='ml-auto mr-0 w-auto'>
                        <PaginationContent>
                          <PaginationItem>
                            <Button onClick={onPrevTab} size={'icon'} variant={'outline'}>
                              <ChevronLeft />
                            </Button>
                          </PaginationItem>
                          <PaginationItem>
                            <Button onClick={onNextTab} size={'icon'} variant={'outline'}>
                              <ChevronRight />
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </TooltipProvider>
    </Container>
  )
}
