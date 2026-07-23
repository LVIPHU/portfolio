'use client'

import { useEffect, useRef, useState } from 'react'
import { ListItem } from '../effects/list-item'
import { AppearTitle } from '../effects/appear-title'
import s from './sections.module.css'

// Port .in-use: danh sách dự án reveal khi cuộn tới (IntersectionObserver → ListItem visible).
export function ProjectsSection({
  heading,
  projects,
}: {
  heading: string
  projects: { title: string; source: string; href: string }[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section data-earth-step='6' className={s.projects}>
      <div className={s.projectsHead}>
        <h2 className='h3'>
          <AppearTitle>{heading}</AppearTitle>
        </h2>
      </div>
      <div ref={ref} className={s.projectsList}>
        {projects.map((p, i) => (
          <ListItem key={p.href + i} title={p.title} source={p.source} href={p.href} index={i} visible={visible} />
        ))}
      </div>
    </section>
  )
}
