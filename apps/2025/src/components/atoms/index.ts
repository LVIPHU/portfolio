// C8 (D-06): shim barrel — component shadcn-derived re-export từ @portfolio/ui
// (nguồn UI chung duy nhất của repo), atoms đặc thù app (D-12) giữ file local.
// Named exports bắt buộc: `export *` qua ranh giới 'use client' làm Turbopack vỡ
// (bug ownKeys, xem C7-01). Organisms/templates vẫn import từ '@/components/atoms'.

// ── shadcn-derived → @portfolio/ui ──
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  badgeVariants,
  Button,
  buttonVariants,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ScrollArea,
  ScrollBar,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  Toggle,
  toggleVariants,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@portfolio/ui'

// ── atoms đặc thù app (D-12) → file local ──
export { AnimatedContent } from './animated-content'
export { Authors } from './authors'
export { Blur } from './blur'
export { Boxes } from './boxes'
export { Container } from './container'
export { DiscussOnX } from './discuss-on-x'
export { EditOnGithub } from './edit-on-github'
export { FadeContent } from './fade-content'
export { GridBackground } from './grid-background'
export { GritBackground } from './grit-background'
export { GrowingUnderline } from './growing-underline'
export { Image, Zoom } from './image'
export type { ImageProps } from './image'
export { LinkPreview } from './link-preview'
export { Logo } from './logo'
export { NavigationLink } from './navigation-link'
export { SearchArticles } from './search-articles'
export { SocialIcons } from './social-icons'
export type { TypeOfIconsMap } from './social-icons'
export {
  Timeline,
  TimelineItemTitle,
  TimelineItemDescription,
  TimelineItemSmallText,
  TimelineItemDateRange,
} from './timeline'
export { TableOfContents } from './toc'
export { VideoCard } from './video-card'
export { ViewsCounter } from './views-counter'
