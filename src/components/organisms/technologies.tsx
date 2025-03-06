'use client'
import { Trans } from '@lingui/react/macro'
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
  SocialIcons,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/atoms'
import { useState } from 'react'
import { Skill, skillsData } from '@data/main'
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
  const filteredSkillsData = filterSkillsData(skillsData)
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
    <div className={'my-8'}>
      <h3
        className={
          'text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl md:leading-14'
        }
      >
        <Trans>Các công nghệ mà tôi đã sử dụng</Trans>
      </h3>
      <TooltipProvider>
        <Tabs value={categories[tabIndex]} defaultValue={categories[0]} onValueChange={onTabChange} className={'mt-5'}>
          <TabsList className='grid w-full grid-cols-4'>
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
                    <CardTitle>
                      <Trans>{category}</Trans>
                    </CardTitle>
                    {category === 'Most Used' && (
                      <CardDescription>
                        <Trans>Đây là những công nghệ tôi sử dụng nhiều nhất</Trans>
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className='grid grid-cols-5 gap-4 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-10'>
                    {filteredSkillsData[category].map((skill) => (
                      <Tooltip key={`${category}-icon-${skill.name}`}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={`h-14 p-2 sm:p-2 ${skill.level === 'learning' ? 'border border-green-300' : ''}`}
                          >
                            <SocialIcons kind={skill.id} size={10} iconType={'icon'} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{skill.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </CardContent>
                  <CardFooter className='flex flex-row justify-between items-center border-t bg-muted/50 px-6 py-3'>
                    <div className='flex items-center text-xs text-muted-foreground'>
                      <span className='mx-1 inline-block h-3 w-3 rounded-full bg-green-300'></span>
                      <span>
                        <Trans>Đang học</Trans>
                      </span>
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
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </TooltipProvider>
    </div>
  )
}
