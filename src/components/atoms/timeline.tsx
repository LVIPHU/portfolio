'use client'
import '@/libs/dayjs'
import { useScroll, useTransform, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/libs/utils'
import dayjs from 'dayjs'
import { useLingui } from '@lingui/react'
import { dayjsLocaleMap, dayjsLocales } from '@/libs/dayjs'
import { t } from '@lingui/macro'

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
    offset: ['start 10%', 'end 50%']
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      <div ref={wrapperRef} className='relative'>
        {data.map((item, index) => (
          <div key={index} className='flex justify-start pb-8'>
            <TimelineItemBullet />
            <div className='relative ml-5 pl-6 w-full'>
              <TimelineItemTitle>{item.title}</TimelineItemTitle>
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{ height: `${height}px` }}
          className='absolute left-5 top-0 w-[2px] z-0 bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-700 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]'
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform
            }}
            className='w-full bg-gradient-to-t from-amber-500 via-orange-600 to-transparent'
          />
        </div>
      </div>
    </div>
  )
}

const TimelineItemBullet = () => (
  <div className='sticky flex items-center top-40 self-start z-10'>
    <div className='h-10 -top-3.5 absolute w-10 rounded-full bg-white dark:bg-black flex items-center justify-center'>
      <div className='h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2' />
    </div>
  </div>
)

export const TimelineItemTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className='mb-1 text-base font-semibold leading-none'>{children}</div>
}

export const TimelineItemDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export const TimelineItemSmallText = ({ children }: { children: React.ReactNode }) => {
  return <div className='pt-1 text-xs'>{children}</div>
}

export const TimelineItemDateRange = ({ startDate, endDate }: { startDate: Date; endDate?: Date }) => {
  const {i18n} = useLingui()
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

  const durationVie =
    years > 0
      ? `${years} năm ${months} tháng`
      : `${months} tháng`

  return <div className='pt-1 text-xs'>{`${formattedStartDate} - ${formattedEndDate} · ${i18n.locale === 'en-US' ? durationEng : durationVie}`}</div>
}
