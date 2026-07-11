import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Link/redirect/usePathname/useRouter locale-aware — dùng thay next/link, next/navigation
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
