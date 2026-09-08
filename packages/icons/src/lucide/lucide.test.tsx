import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement, createRef } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import gsap from 'gsap'
import * as lucide from './index'
import type { AnimatedIconHandle } from './animated-icon'

const NAMES = [
  'ArrowLeft',
  'ArrowRight',
  'Book',
  'Check',
  'CheckIcon',
  'ChevronDownIcon',
  'ChevronLeft',
  'ChevronLeftIcon',
  'ChevronRight',
  'ChevronRightIcon',
  'ChevronUpIcon',
  'ChevronsUp',
  'Clock',
  'CloudSun',
  'Command',
  'Construction',
  'Copy',
  'Dot',
  'Download',
  'Eye',
  'FileUser',
  'FolderGit',
  'GalleryHorizontal',
  'GitFork',
  'House',
  'Info',
  'Layers',
  'LayoutGrid',
  'Link',
  'List',
  'Mail',
  'MailIcon',
  'MapPinIcon',
  'MessageSquareText',
  'MonitorCog',
  'Moon',
  'MoreHorizontalIcon',
  'MoveLeft',
  'PanelBottomClose',
  'PanelBottomOpen',
  'Paperclip',
  'PhoneIcon',
  'Search',
  'Share2',
  'Signature',
  'Sun',
  'Tags',
  'TriangleAlert',
  'User',
  'XIcon',
] as const

afterEach(() => cleanup())

describe('lucide GSAP (T4)', () => {
  it('T4.1 barrel exports all 50 names (animated + static)', async () => {
    expect(NAMES).toHaveLength(50)
    const lucideStatic = await import('./static')
    for (const name of NAMES) {
      expect(lucide[name], name).toBeTruthy()
      expect(lucideStatic[name], `static ${name}`).toBeTruthy()
    }
  })

  it('T4.2 each icon renders one 24×24 svg', () => {
    for (const name of NAMES) {
      const Icon = lucide[name]
      const { container, unmount } = render(createElement(Icon))
      const svg = container.querySelector('svg')
      expect(svg, name).toBeTruthy()
      expect(container.querySelectorAll('svg'), name).toHaveLength(1)
      expect(svg?.getAttribute('width'), name).toBe('24')
      expect(svg?.getAttribute('height'), name).toBe('24')
      unmount()
    }
  })

  it('T4.3 ref exposes startAnimation / stopAnimation', () => {
    const ref = createRef<AnimatedIconHandle>()
    render(<lucide.Check ref={ref} />)
    expect(ref.current?.startAnimation).toBeTypeOf('function')
    expect(ref.current?.stopAnimation).toBeTypeOf('function')
  })

  it('T4.4 caller mouse handlers still fire', () => {
    const enters: number[] = []
    const leaves: number[] = []
    const { container } = render(
      <lucide.Check
        onMouseEnter={() => {
          enters.push(1)
        }}
        onMouseLeave={() => {
          leaves.push(1)
        }}
      />
    )
    const svg = container.querySelector('svg')!
    fireEvent.mouseEnter(svg)
    fireEvent.mouseLeave(svg)
    expect(enters).toHaveLength(1)
    expect(leaves).toHaveLength(1)
  })

  it('T4.5 reduced-motion hover does not add tweens', () => {
    const original = window.matchMedia
    window.matchMedia = (query: string) => {
      const reduce = /prefers-reduced-motion:\s*reduce/.test(query)
      return {
        matches: reduce,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false
        },
      }
    }
    const before = gsap.globalTimeline.getChildren().length
    const { container } = render(<lucide.Check />)
    const svg = container.querySelector('svg')!
    fireEvent.mouseEnter(svg)
    fireEvent.mouseLeave(svg)
    expect(gsap.globalTimeline.getChildren().length).toBe(before)
    window.matchMedia = original
  })

  it('T4.6 lucide sources do not import motion / framer-motion', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    const files = readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((name) => /\.(tsx|ts)$/.test(name))
    for (const name of files) {
      const src = readFileSync(join(dir, name), 'utf8')
      expect(src, name).not.toMatch(/from ['"]motion(\/react)?['"]/)
      expect(src, name).not.toMatch(/from ['"]framer-motion['"]/)
    }
  })

  it('T4.7 rest state is fully drawn (not from-state of paused fromTo)', () => {
    const { container } = render(<lucide.Check />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    const opacity = path?.style.opacity
    expect(opacity === '' || opacity === '1', `opacity=${opacity}`).toBe(true)
    const offset = path?.style.strokeDashoffset
    expect(offset === '' || offset === '0' || offset === '0px', `dashoffset=${offset}`).toBe(true)
  })

  it('T4.8 hover play() activates a tween', async () => {
    const ref = createRef<AnimatedIconHandle>()
    render(<lucide.Check ref={ref} />)
    await waitFor(() => {
      expect(ref.current?.startAnimation).toBeTypeOf('function')
    })
    ref.current?.startAnimation()
    await waitFor(() => {
      const active = gsap.globalTimeline.getChildren(true).some((tw) => tw.isActive())
      expect(active).toBe(true)
    })
  })
})
