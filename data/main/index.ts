export interface Skill {
  name: string
  id: string
  category: 'Languages' | 'Web Dev' | 'DevOps & Tools'
  field?: string
  subfield?: string
  description?: string
  imgSrc?: string
  level: 'beginner' | 'learning' | 'familiar' | 'proficient' | 'advanced' | 'expert'
  hidden?: boolean
  href?: string
  mostUsed?: boolean
}

export interface Project {
  type: 'work' | 'self'
  title: string
  description?: string
  imgSrc: string
  url?: string
  repo?: string
  builtWith: Skill['id'][]
  hidden?: boolean
}

export interface Experience {
  title: string
  roleType: 'Fulltime' | 'Part-time' | 'Consultant' | 'Freelance'
  startDate: string
  endDate?: string
  description: string
  active?: boolean
  techStack?: Skill['id'][]
  hidden?: boolean
}

export interface Company {
  name: string
  location?: string
  imgSrc?: string
  startDate?: string
  endDate?: string
  url?: string
  active?: boolean
  hidden?: boolean
  description?: string
  descCard?: string
  items: Experience[]
}

export const skillsData: Skill[] = [
  {
    name: 'Javascript',
    id: 'javascript',
    category: 'Languages',
    level: 'advanced',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    mostUsed: true
  },
  {
    name: 'Typescript',
    id: 'typescript',
    category: 'Languages',
    level: 'advanced',
    href: 'https://www.typescriptlang.org/',
    mostUsed: true
  },
  {
    name: 'React',
    id: 'react',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'advanced',
    href: 'https://react.dev/',
    mostUsed: true
  },
  {
    name: 'Vue.js',
    id: 'vuejs',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'advanced',
    href: 'https://vuejs.org/',
    mostUsed: true
  },
  {
    name: 'Next.js',
    id: 'nextjs',
    category: 'Web Dev',
    field: 'Fullstack',
    subfield: 'Frameworks',
    level: 'advanced',
    href: 'https://nextjs.org/',
    mostUsed: true
  },
  {
    name: 'Tailwindcss',
    id: 'tailwindcss',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://tailwindcss.com/',
    mostUsed: true
  },
  {
    name: 'Bootstrap',
    id: 'bootstrap',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://getbootstrap.com/'
  },
  {
    name: 'Shadcn/ui',
    id: 'shadcn',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://ui.shadcn.com/'
  },
  {
    name: 'CSS',
    id: 'css',
    category: 'Web Dev',
    field: 'Frontend',
    subfield: 'Styling',
    level: 'advanced',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
  },
  {
    name: 'HTML',
    id: 'html',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'advanced',
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
  },
  {
    name: 'Prisma',
    id: 'prisma',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'ORM',
    level: 'familiar',
    href: 'https://www.prisma.io/'
  },
  {
    name: 'Python',
    id: 'python',
    category: 'Languages',
    level: 'learning',
    href: 'https://www.python.org/'
  },
  {
    name: 'Node.js',
    id: 'nodejs',
    category: 'Web Dev',
    field: 'Backend',
    level: 'proficient',
    href: 'https://nodejs.org/en/'
  },
  {
    name: 'Express.js',
    id: 'expressjs',
    category: 'Web Dev',
    field: 'Backend',
    level: 'proficient',
    href: 'https://expressjs.com/'
  },
  {
    name: 'NestJS',
    id: 'nestjs',
    category: 'Web Dev',
    field: 'Backend',
    level: 'proficient',
    mostUsed: true,
    href: 'https://nestjs.com/'
  },
  {
    name: 'Git',
    id: 'git',
    category: 'DevOps & Tools',
    field: 'Source Control',
    level: 'advanced',
    href: 'https://git-scm.com/'
  },
  {
    name: 'Github',
    id: 'github',
    category: 'DevOps & Tools',
    field: 'Source Control',
    level: 'advanced',
    href: 'https://github.com/'
  },
  {
    name: 'SQL',
    id: 'sql',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'familiar',
    hidden: true
  },
  {
    name: 'NoSQL',
    id: 'nosql',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'familiar',
    href: 'https://www.mongodb.com/',
    hidden: true
  },
  {
    name: 'MongoDB',
    id: 'mongodb',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'familiar',
    href: 'https://www.mongodb.com/',
    mostUsed: true
  },
  {
    name: 'PostgreSQL',
    id: 'postgres',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'learning',
    href: 'https://www.postgresql.org/'
  },
  {
    name: 'MySQL',
    id: 'mysql',
    category: 'Web Dev',
    field: 'Backend',
    subfield: 'Databases',
    level: 'learning',
    href: 'https://www.mysql.com/'
  },
  {
    name: 'Postman',
    id: 'postman',
    category: 'DevOps & Tools',
    field: 'Tools',
    level: 'familiar',
    href: 'https://www.postman.com/'
  },
  {
    name: 'Vercel',
    id: 'vercel',
    category: 'DevOps & Tools',
    field: 'Cloud Providers',
    level: 'familiar',
    href: 'https://vercel.com/'
  },
  {
    name: 'Jira',
    id: 'jira',
    category: 'DevOps & Tools',
    field: 'DevOps & Tools',
    subfield: 'Fullstack',
    level: 'familiar',
    href: 'https://www.atlassian.com/software/jira',
    hidden: true
  },
  {
    name: 'Vite',
    id: 'vite',
    category: 'DevOps & Tools',
    field: 'DevOps & Tools',
    level: 'familiar',
    href: 'https://vitejs.dev/'
  },
  {
    name: 'Yarn',
    id: 'yarn',
    category: 'DevOps & Tools',
    field: 'DevOps & Tools',
    level: 'familiar',
    href: 'https://yarnpkg.com/',
    hidden: true
  },
  {
    name: 'Three.js',
    id: 'threejs',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'learning',
    href: 'https://threejs.org/'
  },
  {
    name: 'PNPM',
    id: 'pnpm',
    category: 'DevOps & Tools',
    field: 'Tools',
    level: 'familiar',
    href: 'https://pnpm.io/',
    hidden: true
  },
  {
    name: 'Framer Motion',
    id: 'framermotion',
    category: 'Web Dev',
    field: 'Frontend',
    level: 'learning',
    href: 'https://www.framer.com/motion/'
  },
  {
    name: 'Datadog',
    id: 'datadog',
    category: 'DevOps & Tools',
    field: 'Analytics',
    level: 'learning'
  }
]

// export let projectsData: Project[] = []
//
// export let experienceData: Experience[] = []
//
// export let companiesData: Company[] = []
