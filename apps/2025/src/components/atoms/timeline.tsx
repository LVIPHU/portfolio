'use client'
import '@/libs/dayjs'
import React, { useRef } from 'react'
import { cn } from '@/utils'
import dayjs from 'dayjs'
import { useLocale, useTranslations } from 'next-intl'
import { dayjsLocaleMap, dayjsLocales } from '@/libs/dayjs'
import { Reveal, useScrollProgress } from '@portfolio/ui/motion'

interface TimelineEntry {
  title: string
  content: React.ReactNode
}

export const Timeline = ({ data, className }: { data: TimelineEntry[]; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<HTMLDivElement>(null)

  // C9 (M-02 #4): beam vẽ theo scroll bằng ScrollTrigger scrub (scaleY 0→1),
  // thay useScroll+useTransform + đo height thủ công của framer.
  useScrollProgress(containerRef, beamRef, { start: 'top 10%', end: 'bottom 50%' })

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      <div className='relative'>
        {data.map((item, idx) => (
          <div key={idx} className='flex justify-start pb-8'>
            <TimelineItemBullet />
            <Reveal direction={'horizontal'} delay={idx * 0.1} className='relative ml-5 w-full pl-6'>
              <TimelineItemTitle>{item.title}</TimelineItemTitle>
              {item.content}
            </Reveal>
          </div>
        ))}

        <div className='absolute bottom-0 left-5 top-0 z-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-200 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700'>
          <div
            ref={beamRef}
            className='h-full w-full origin-top bg-gradient-to-t from-amber-500 via-orange-600 to-transparent'
          />
        </div>
      </div>
    </div>
  )
}

const TimelineItemBullet = () => (
  <div className='sticky top-40 z-10 flex items-center self-start'>
    <div className='absolute -top-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-black'>
      <div className='h-4 w-4 rounded-full border border-neutral-300 bg-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800' />
    </div>
  </div>
)

export const TimelineItemTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className='mb-1 text-lg font-semibold leading-none'>{children}</div>
}

export const TimelineItemDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn('text-muted-foreground', className)}>{children}</p>
}

export const TimelineItemSmallText = ({ children }: { children: React.ReactNode }) => {
  return <div className='pt-1 text-sm'>{children}</div>
}

export const TimelineItemDateRange = ({ startDate, endDate }: { startDate: Date; endDate?: Date }) => {
  const locale = useLocale()
  const t = useTranslations()
  if (dayjsLocales[locale]) {
    void dayjsLocales[locale]()
    dayjs.locale(dayjsLocaleMap[locale])
  }

  const formattedStartDate = dayjs(startDate).format('MMM YYYY')
  const formattedEndDate = endDate ? dayjs(endDate).format('MMM YYYY') : t('Timeline.present')
  const monthDiff = endDate
    ? dayjs.duration(dayjs(endDate).diff(dayjs(startDate)))
    : dayjs.duration(dayjs(new Date()).diff(dayjs(startDate)))

  const years = monthDiff.years()
  const months = monthDiff.months()

  // Format duration based on locale
  let duration = ''
  if (years > 0) {
    switch (locale) {
      case 'en':
        duration = `${years} ${years === 1 ? 'yr' : 'yrs'} ${months} ${months === 1 ? 'mo' : 'mos'}`
        break
      case 'vi':
        duration = `${years} năm ${months} tháng`
        break
      default:
        duration = `${years} ${years === 1 ? 'yr' : 'yrs'} ${months} ${months === 1 ? 'mo' : 'mos'}`
    }
  } else {
    switch (locale) {
      case 'en':
        duration = `${months} ${months === 1 ? 'mo' : 'mos'}`
        break
      case 'vi':
        duration = `${months} tháng`
        break
      default:
        duration = `${months} ${months === 1 ? 'mo' : 'mos'}`
    }
  }

  return <div className='pt-1 text-sm'>{`${formattedStartDate} - ${formattedEndDate} · ${duration}`}</div>
}
