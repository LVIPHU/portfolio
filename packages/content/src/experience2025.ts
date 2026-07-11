/**
 * Data kinh nghiệm làm việc của portfolio 2025 — hút từ apps/2025/data/main.ts (C2).
 * MessageDescriptor → Localized theo D-05: catalog .po không chứa các msgid này,
 * nên vi = en (đúng hành vi production hiện tại). Field date/logo/url giữ literal.
 */
import type { Localized } from './types'
import type { Skill2025 } from './skills2025'

export interface Experience2025 {
  title: Localized
  roleType: Localized
  type: Localized
  startDate: string
  endDate?: string
  description: Localized
  active?: boolean
  technologies?: Skill2025['id'][]
  hidden?: boolean
}

export interface Company2025 {
  name: string
  location?: Localized
  image?: string
  startDate?: string
  endDate?: string
  url?: string
  active?: boolean
  hidden?: boolean
  description?: Localized
  descCard?: string
  items: Experience2025[]
}

// TODO dịch (toàn bộ msgid dưới đây không có msgstr trong catalog vi-VN)
const FULLTIME: Localized = { vi: 'Fulltime', en: 'Fulltime' }
const OUTSOURCE: Localized = { vi: 'Outsource', en: 'Outsource' }

export const EXPERIENCES_2025: Company2025[] = [
  {
    name: 'PVS Solution',
    location: {
      vi: '60 D1 St., Him Lam Urban Area, District 7, Ho Chi Minh City', // TODO dịch
      en: '60 D1 St., Him Lam Urban Area, District 7, Ho Chi Minh City',
    },
    description: {
      // TODO dịch
      vi: 'PVS is a company specializing in providing solutions and focusing on building and developing software applications and value-added services in the fields of Telecommunications, Information Technology, and Healthcare, ...',
      en: 'PVS is a company specializing in providing solutions and focusing on building and developing software applications and value-added services in the fields of Telecommunications, Information Technology, and Healthcare, ...',
    },
    image: 'https://pvssolution.com/wp-content/uploads/2023/08/logo-pvs-1024x629.png',
    url: 'https://pvssolution.com/',
    active: true,
    items: [
      {
        title: { vi: 'Frontend Developer - Pinance', en: 'Frontend Developer - Pinance' },
        type: { vi: 'Product', en: 'Product' }, // TODO dịch
        roleType: FULLTIME,
        startDate: '2024/02/04',
        description: {
          // TODO dịch
          vi: 'Pinance is an automated electronic invoice management software that helps businesses input, control, and report invoices efficiently while providing real-time connectivity with tax authorities.',
          en: 'Pinance is an automated electronic invoice management software that helps businesses input, control, and report invoices efficiently while providing real-time connectivity with tax authorities.',
        },
        technologies: ['bootstrap', 'vuejs', 'datadog', 'socketio'],
        active: true,
      },
      {
        title: { vi: 'Frontend Developer - Rainbow', en: 'Frontend Developer - Rainbow' },
        type: OUTSOURCE,
        roleType: FULLTIME,
        startDate: '2023/11/04',
        endDate: '2024/02/18',
        description: {
          // TODO dịch
          vi: 'The Rainbow Kindergarten management panel provides streamlined oversight of kindergarten operations through an integrated dashboard and modules for managing teachers, students, attendance, supplies, branches, and expenditures.',
          en: 'The Rainbow Kindergarten management panel provides streamlined oversight of kindergarten operations through an integrated dashboard and modules for managing teachers, students, attendance, supplies, branches, and expenditures.',
        },
        technologies: ['antd', 'react', 'vite'],
      },
      {
        title: { vi: 'Frontend Developer - Mobi 8 - Admin', en: 'Frontend Developer - Mobi 8 - Admin' },
        type: OUTSOURCE,
        roleType: FULLTIME,
        startDate: '2023/02/03',
        endDate: '2023/11/22',
        description: {
          // TODO dịch
          vi: 'An internal admin panel for the Mobi 8 web platform, enabling efficient content management and real-time synchronization with the client-facing website.',
          en: 'An internal admin panel for the Mobi 8 web platform, enabling efficient content management and real-time synchronization with the client-facing website.',
        },
        technologies: ['antd', 'react', 'redux'],
      },
      {
        title: { vi: 'Frontend Developer - Mobi 8 - Client', en: 'Frontend Developer - Mobi 8 - Client' },
        type: OUTSOURCE,
        roleType: FULLTIME,
        startDate: '2022/06/20',
        endDate: '2024/03/27',
        description: {
          // TODO dịch
          vi: 'The official website of Mobifone Region 8, providing digital telecommunication services such as mobile plans, internet packages, digital solutions, and customer support.',
          en: 'The official website of Mobifone Region 8, providing digital telecommunication services such as mobile plans, internet packages, digital solutions, and customer support.',
        },
        technologies: ['nextjs', 'react', 'tailwindcss'],
      },
    ],
  },
]
