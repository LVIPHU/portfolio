export interface Skill {
  name: string
  id: string
  category: 'Languages' | 'Web Dev' | 'DevOps & Tools'
  field?: string
  subfield?: string
  description?: string
  level: 'beginner' | 'learning' | 'familiar' | 'proficient' | 'advanced' | 'expert'
  hidden?: boolean
  href?: string
  mostUsed?: boolean
}

export interface Project {
  type: 'work' | 'self'
  title: string
  description?: string
  image: string
  url?: string
  repo?: string
  technologies: Skill['id'][]
  hidden?: boolean
}

export interface Experience {
  title: string
  roleType: 'Fulltime' | 'Part-time' | 'Consultant' | 'Freelance'
  type: 'Product' | 'Outsource'
  startDate: string
  endDate?: string
  description: string
  active?: boolean
  technologies?: Skill['id'][]
  hidden?: boolean
}

export interface Company {
  name: string
  location?: string
  image?: string
  startDate?: string
  endDate?: string
  url?: string
  active?: boolean
  hidden?: boolean
  description?: string
  descCard?: string
  items: Experience[]
}

export const SKILLS: Skill[] = [
  {
    name: 'Javascript',
    id: 'javascript',
    category: 'Languages',
    level: 'advanced',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    mostUsed: true,
  },
  {
    name: 'Typescript',
    id: 'typescript',
    category: 'Languages',
    level: 'advanced',
    href: 'https://www.typescriptlang.org/',
    mostUsed: true,
  },
  {
    name: 'React',
    id: 'react',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'advanced',
    href: 'https://react.dev/',
    mostUsed: true,
  },
  {
    name: 'Vue.js',
    id: 'vuejs',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'advanced',
    href: 'https://vuejs.org/',
    mostUsed: true,
  },
  {
    name: 'Next.js',
    id: 'nextjs',
    category: 'Web Dev',
    field: 'Fullstack',
    subfield: 'Frameworks',
    level: 'advanced',
    href: 'https://nextjs.org/',
    mostUsed: true,
  },
  {
    name: 'Tailwindcss',
    id: 'tailwindcss',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://tailwindcss.com/',
    mostUsed: true,
  },
  {
    name: 'Bootstrap',
    id: 'bootstrap',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://getbootstrap.com/',
  },
  {
    name: 'Shadcn/ui',
    id: 'shadcn',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://ui.shadcn.com/',
  },
  {
    name: 'Ant Design',
    id: 'antd',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://ant.design/',
  },
  {
    name: 'CSS',
    id: 'css',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },
  {
    name: 'HTML',
    id: 'html',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'advanced',
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },
  {
    name: 'Prisma',
    id: 'prisma',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'ORM',
    level: 'familiar',
    href: 'https://www.prisma.io/',
  },
  {
    name: 'Python',
    id: 'python',
    category: 'Languages',
    level: 'learning',
    href: 'https://www.python.org/',
  },
  {
    name: 'Node.js',
    id: 'nodejs',
    category: 'Web Dev',
    field: 'Backend',
    level: 'proficient',
    href: 'https://nodejs.org/en/',
  },
  {
    name: 'Express.js',
    id: 'expressjs',
    category: 'Web Dev',
    field: 'Backend',
    level: 'proficient',
    href: 'https://expressjs.com/',
  },
  {
    name: 'NestJS',
    id: 'nestjs',
    category: 'Web Dev',
    field: 'Backend',
    level: 'proficient',
    mostUsed: true,
    href: 'https://nestjs.com/',
  },
  {
    name: 'Git',
    id: 'git',
    category: 'DevOps & Tools',
    field: 'Source Control',
    level: 'advanced',
    href: 'https://git-scm.com/',
  },
  {
    name: 'Github',
    id: 'github',
    category: 'DevOps & Tools',
    field: 'Source Control',
    level: 'advanced',
    href: 'https://github.com/',
  },
  {
    name: 'Socket.io',
    id: 'socketio',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Real-time',
    level: 'familiar',
    href: 'https://socket.io/',
  },
  {
    name: 'SQL',
    id: 'sql',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'familiar',
    hidden: true,
  },
  {
    name: 'NoSQL',
    id: 'nosql',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'familiar',
    href: 'https://www.mongodb.com/',
    hidden: true,
  },
  {
    name: 'MongoDB',
    id: 'mongodb',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'familiar',
    href: 'https://www.mongodb.com/',
    mostUsed: true,
  },
  {
    name: 'PostgreSQL',
    id: 'postgres',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'learning',
    href: 'https://www.postgresql.org/',
  },
  {
    name: 'MySQL',
    id: 'mysql',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'learning',
    href: 'https://www.mysql.com/',
  },
  {
    name: 'Postman',
    id: 'postman',
    category: 'DevOps & Tools',
    field: 'Tools',
    level: 'familiar',
    href: 'https://www.postman.com/',
  },
  {
    name: 'Vercel',
    id: 'vercel',
    category: 'DevOps & Tools',
    field: 'Cloud Providers',
    level: 'familiar',
    href: 'https://vercel.com/',
  },
  {
    name: 'Jira',
    id: 'jira',
    category: 'DevOps & Tools',
    field: 'DevOps & Tools',
    subfield: 'Fullstack',
    level: 'familiar',
    href: 'https://www.atlassian.com/software/jira',
    hidden: true,
  },
  {
    name: 'Vite',
    id: 'vite',
    category: 'DevOps & Tools',
    field: 'DevOps & Tools',
    level: 'familiar',
    href: 'https://vitejs.dev/',
  },
  {
    name: 'Yarn',
    id: 'yarn',
    category: 'DevOps & Tools',
    field: 'DevOps & Tools',
    level: 'familiar',
    href: 'https://yarnpkg.com/',
    hidden: true,
  },
  {
    name: 'Three.js',
    id: 'threejs',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'learning',
    href: 'https://threejs.org/',
  },
  {
    name: 'PNPM',
    id: 'pnpm',
    category: 'DevOps & Tools',
    field: 'Tools',
    level: 'familiar',
    href: 'https://pnpm.io/',
    hidden: true,
  },
  {
    name: 'Framer Motion',
    id: 'framermotion',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'learning',
    href: 'https://www.framer.com/motion/',
  },
  {
    name: 'Datadog',
    id: 'datadog',
    category: 'DevOps & Tools',
    field: 'Monitoring & Analytics',
    level: 'learning',
    href: 'https://www.datadoghq.com/',
  },
]

export const PROJECTS: Project[] = [
  {
    type: 'work',
    title: 'Bạc Hà',
    image: '/static/images/projects/1.jpg',
    description: '',
    technologies: [],
  },
  {
    type: 'work',
    title: 'Hồng Vĩ Automations',
    image: '/static/images/projects/2.jpg',
    description: '',
    technologies: [],
  },
  {
    type: 'work',
    title: 'Zerohomstay',
    image: '/static/images/projects/3.jpg',
    description: 'Homstay management system',
    repo: 'hotel-management',
    url: 'https://zerohomstay.vercel.app',
    technologies: ['nextjs', 'tailwindcss', 'shadcn', 'sanity', 'stripe'],
  },
  {
    type: 'self',
    title: 'AppChat',
    image: '/static/images/projects/4.jpg',
    description: 'A real-time chat app that enables secure, seamless messaging and effortless group collaboration.',
    repo: 'AppChat-v2.0.0',
    technologies: ['mongodb', 'nodejs', 'expressjs', 'react', 'antd', 'socket.io'],
  },
  {
    type: 'self',
    title: 'Shopology',
    image: '/static/images/projects/5.jpg',
    description: 'ECommerce platform built with MERN stack.',
    repo: 'MERN_SHOP',
    technologies: ['mongodb', 'nodejs', 'expressjs', 'react', 'bootstrap'],
  },
]

export const EXPERIENCES: Company[] = [
  {
    name: 'PVS Solution',
    location: '60 Đ. D1, Khu đô thị Him Lam, Quận 7, Hồ Chí Minh',
    description:
      'PVS là doanh nghiệp chuyên cung cấp các giải pháp và tập trung xây dựng và phát triển các ứng dụng phần mềm và các dịch vụ giá trị trong lĩnh vực Viễn Thông, Công Nghệ Thông tin và Y Tế, ...',
    image: 'https://pvssolution.com/wp-content/uploads/2023/08/logo-pvs-1024x629.png',
    url: 'https://pvssolution.com/',
    active: true,
    items: [
      {
        title: 'Frontend Developer - Pinance',
        type: 'Product',
        roleType: 'Fulltime',
        startDate: '2024/02/04',
        description:
          'Pinance is an automated electronic invoice management software that helps businesses input, control, and report invoices efficiently while providing real-time connectivity with tax authorities.',
        technologies: ['bootstrap', 'vuejs', 'datadog', 'socketio'],
        active: true,
      },
      {
        title: 'Frontend Developer - Rainbow',
        type: 'Outsource',
        roleType: 'Fulltime',
        startDate: '2023/11/04',
        endDate: '2024/02/18',
        description:
          'The Rainbow Kindergarten management panel provides streamlined oversight of kindergarten operations through an integrated dashboard and modules for managing teachers, students, attendance, supplies, branches, and expenditures.',
        technologies: ['antd', 'react', 'vite'],
      },
      {
        title: 'Frontend Developer - Mobi 8 - Admin',
        type: 'Outsource',
        roleType: 'Fulltime',
        startDate: '2023/02/03',
        endDate: '2023/11/22',
        description:
          'An internal admin panel for the Mobi 8 web platform, enabling efficient content management and real-time synchronization with the client-facing website.',
        technologies: ['antd', 'react', 'redux'],
      },
      {
        title: 'Frontend Developer - Mobi 8 - Client',
        type: 'Outsource',
        roleType: 'Fulltime',
        startDate: '2022/06/20',
        endDate: '2024/03/27',
        description:
          'The official website of Mobifone Region 8, providing digital telecommunication services such as mobile plans, internet packages, digital solutions, and customer support.',
        technologies: ['nextjs', 'react', 'tailwindcss'],
      },
    ],
  },
]
