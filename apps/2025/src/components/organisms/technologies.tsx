'use client'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Pagination,
  PaginationContent,
  PaginationItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@portfolio/ui'
import { SkillIcon } from '@portfolio/icons'
import { useLocale, useTranslations } from 'next-intl'
import { Reveal } from '@portfolio/ui/motion'
import { Container, NavigationLink } from '@/components/atoms'
import { useState } from 'react'
import { type Skill, me, SKILL_CATEGORIES, type Locale } from '@portfolio/content/data2025'
import { ChevronLeft, ChevronRight } from '@portfolio/icons/lucide'

const MOST_USED_ID = 'most-used'

function filterSkillsData(skillsData: Skill[]) {
  const mostUsed: Skill[] = []
  const acc: Record<string, Skill[]> = { [MOST_USED_ID]: mostUsed }

  skillsData.forEach((skill) => {
    if (skill.hidden) return
    const bucket = acc[skill.category] ?? (acc[skill.category] = [])
    bucket.push(skill)
    if (skill.mostUsed) mostUsed.push(skill)
  })

  return acc
}

export const Technologies = () => {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const filteredSkillsData = filterSkillsData(me.skills)
  const categories = [
    { id: MOST_USED_ID, label: locale === 'vi' ? 'Dùng nhiều' : 'Most Used' },
    ...SKILL_CATEGORIES.map((c) => ({ id: c.id, label: c.label[locale] })),
  ]
  const [tabIndex, setTabIndex] = useState(0)

  const onTabChange = (value: string) => {
    const index = categories.findIndex((c) => c.id === value)
    if (index >= 0) setTabIndex(index)
  }

  const onNextTab = () => {
    setTabIndex((tabIndex + 1) % categories.length)
  }

  const onPrevTab = () => {
    setTabIndex((tabIndex - 1 + categories.length) % categories.length)
  }

  return (
    <Container className={'py-5 md:py-10'}>
      <Reveal direction={'horizontal'} reverse={true}>
        <h3 className='heading-section'>{t('Technologies.technologiesIVeWorked')}</h3>
      </Reveal>
      <TooltipProvider>
        <Tabs
          value={categories[tabIndex]?.id}
          defaultValue={categories[0]?.id}
          onValueChange={onTabChange}
          className={'mt-5 md:mt-10'}
        >
          {/* 10 tab — cuộn ngang trên mobile, không grid-cols-2/4 */}
          <TabsList className='flex h-auto w-full flex-nowrap justify-start gap-1 overflow-x-auto md:flex-wrap'>
            {categories.map((category) => (
              <TabsTrigger key={'trigger-' + category.id} value={category.id} className='shrink-0'>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => {
            return (
              <TabsContent key={'content-' + category.id} value={category.id}>
                <Card>
                  <CardHeader>
                    <Reveal direction={'horizontal'}>
                      <CardTitle>{t('Technologies.msg', { category: category.label })}</CardTitle>
                      {category.id === MOST_USED_ID && (
                        <CardDescription>{t('Technologies.theseAreMyMost')}</CardDescription>
                      )}
                    </Reveal>
                  </CardHeader>
                  <CardContent>
                    <Reveal distance={20} className='grid grid-cols-5 gap-4 md:grid-cols-8 xl:grid-cols-10'>
                      {(filteredSkillsData[category.id] ?? []).map((skill) => {
                        const trigger = skill.href ? (
                          <NavigationLink className={'w-full'} href={skill.href} />
                        ) : (
                          <div className='w-full' />
                        )
                        return (
                          <Tooltip key={`${category.id}-icon-${skill.name}`}>
                            <TooltipTrigger render={trigger}>
                              <Button
                                variant={'outline'}
                                className={`h-14 w-full p-2 ${skill.level === 'learning' ? 'border border-amber-500' : ''}`}
                              >
                                <SkillIcon className={'size-5 md:size-10'} id={skill.id} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{skill.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </Reveal>
                  </CardContent>
                  {category.id !== MOST_USED_ID && (
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
