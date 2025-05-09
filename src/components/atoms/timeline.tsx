'use client'
import '@/libs/dayjs'
import { useScroll, useTransform, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'
import dayjs from 'dayjs'
import { useLingui } from '@lingui/react'
import { dayjsLocaleMap, dayjsLocales } from '@/libs/dayjs'
import { t } from '@lingui/macro'
import { AnimatedContent } from '@/components/atoms/animated-content'

interface TimelineEntry {
  title: string
  content: React.ReactNode
}

export const Timeline = ({ data, className }: { data: TimelineEntry[]; className?: string }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!wrapperRef.current) return

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
    })

    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      <div ref={wrapperRef} className='relative'>
        {data.map((item, idx) => (
          <div key={idx} className='flex justify-start pb-8'>
            <TimelineItemBullet />
            <AnimatedContent direction={'horizontal'} delay={idx * 0.1} className='relative ml-5 w-full pl-6'>
              <TimelineItemTitle>{item.title}</TimelineItemTitle>
              {item.content}
            </AnimatedContent>
          </div>
        ))}

        <div
          style={{ height: `${height}px` }}
          className='absolute left-5 top-0 z-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-200 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700'
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className='w-full bg-gradient-to-t from-amber-500 via-orange-600 to-transparent'
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
  const { i18n } = useLingui()
  if (dayjsLocales[i18n.locale]) {
    void dayjsLocales[i18n.locale]()
    dayjs.locale(dayjsLocaleMap[i18n.locale])
  }

  const formattedStartDate = dayjs(startDate).format('MMM YYYY')
  const formattedEndDate = endDate ? dayjs(endDate).format('MMM YYYY') : t(i18n)`Present`
  const monthDiff = endDate
    ? dayjs.duration(dayjs(endDate).diff(dayjs(startDate)))
    : dayjs.duration(dayjs(new Date()).diff(dayjs(startDate)))

  const years = monthDiff.years()
  const months = monthDiff.months()

  const durationEng =
    years > 0
      ? `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`
      : `${months} mo${months > 1 ? 's' : ''}`

  const durationVie = years > 0 ? `${years} năm ${months} tháng` : `${months} tháng`

  return (
    <div className='pt-1 text-sm'>{`${formattedStartDate} - ${formattedEndDate} · ${i18n.locale === 'en-US' ? durationEng : durationVie}`}</div>
  )
}
