/**
 * Data projects của portfolio 2025 — hút từ apps/2025/data/main.ts (C2).
 * MessageDescriptor → Localized theo D-05: catalog .po KHÔNG chứa các msgid này
 * (Lingui chỉ extract từ src/), nên vi = en (đúng hành vi production hiện tại).
 * Đường dẫn image giữ nguyên /static/... vì ảnh vẫn nằm trong public của apps/2025.
 */
import type { Localized } from './types'
import type { Skill2025 } from './skills2025'

export interface Project2025 {
  type: 'work' | 'self'
  title: string
  description?: Localized
  image: string
  url?: string
  repo?: string
  technologies: Skill2025['id'][]
  hidden?: boolean
}

export const PROJECTS_2025: Project2025[] = [
  {
    type: 'work',
    title: 'Bạc Hà',
    image: '/static/images/projects/1.jpg',
    technologies: [],
  },
  {
    type: 'work',
    title: 'Hồng Vĩ Automations',
    image: '/static/images/projects/2.jpg',
    technologies: [],
  },
  {
    type: 'work',
    title: 'Zerohomstay',
    image: '/static/images/projects/3.jpg',
    description: {
      // TODO dịch (msgstr không có trong catalog vi-VN)
      vi: 'Homstay management system',
      en: 'Homstay management system',
    },
    repo: 'hotel-management',
    url: 'https://zerohomstay.vercel.app',
    technologies: ['nextjs', 'tailwindcss', 'shadcn', 'sanity', 'stripe'],
  },
  {
    type: 'self',
    title: 'AppChat',
    image: '/static/images/projects/4.jpg',
    description: {
      // TODO dịch (msgstr không có trong catalog vi-VN)
      vi: 'A real-time chat app that enables secure, seamless messaging and effortless group collaboration.',
      en: 'A real-time chat app that enables secure, seamless messaging and effortless group collaboration.',
    },
    repo: 'AppChat-v2.0.0',
    technologies: ['mongodb', 'nodejs', 'expressjs', 'react', 'antd', 'socket.io'],
  },
  {
    type: 'self',
    title: 'Shopology',
    image: '/static/images/projects/5.jpg',
    description: {
      // TODO dịch (msgstr không có trong catalog vi-VN)
      vi: 'ECommerce platform built with MERN stack.',
      en: 'ECommerce platform built with MERN stack.',
    },
    repo: 'MERN_SHOP',
    technologies: ['mongodb', 'nodejs', 'expressjs', 'react', 'bootstrap'],
  },
]
