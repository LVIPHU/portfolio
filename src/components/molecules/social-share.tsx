'use client'

import { Facebook, Link, Linkedin, Share2, XIcon } from 'lucide-react'
import { useState } from 'react'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share'
import {
  Button,
  DiscussOnX,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EditOnGithub,
} from '@/components/atoms'
import { cn } from '@/utils'

type SocialButtonsProps = {
  postUrl: string
  filePath: string
  title: string
  className?: string
}

export function SocialShare({ postUrl, filePath, title, className }: SocialButtonsProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyLink() {
    navigator.clipboard.writeText(postUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='More links'
          className={cn('flex items-center gap-1 px-3 py-1 font-medium text-gray-500 dark:text-gray-400', className)}
          data-umami-event='social-share'
        >
          <span>Share</span>
          <Share2 strokeWidth={1.5} size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCopyLink}>
            <Link strokeWidth={1.5} size={18} />
            <span>{copied ? 'Copied' : 'Copy link'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <TwitterShareButton url={postUrl} title={title}>
              <XIcon strokeWidth={1.5} size={18} />
              <span>Share on X (Twitter)</span>
            </TwitterShareButton>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LinkedinShareButton url={postUrl} title={title}>
              <Linkedin strokeWidth={1.5} size={18} />
              <span>Share on LinkedIn</span>
            </LinkedinShareButton>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FacebookShareButton url={postUrl}>
              <Facebook strokeWidth={1.5} size={18} />
              <span>Share on Facebook</span>
            </FacebookShareButton>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DiscussOnX postUrl={postUrl} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditOnGithub filePath={filePath} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
