'use client'
import React, { useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useIsomorphicLayoutEffect } from '@/hooks'

interface AnimatedContentProps {
  children: ReactNode
  distance?: number
  direction?: 'vertical' | 'horizontal'
  reverse?: boolean
  initialOpacity?: number
  animateOpacity?: boolean
  scale?: number
  threshold?: number
  delay?: number
  endDuration?: number
  className?: string
}

export const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 50,
  direction = 'vertical',
  reverse = false,
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  endDuration = 0.5,
  className,
}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [threshold])

  // Determine initial translate values based on direction and reverse
  const initialX = direction === 'horizontal' ? (reverse ? -distance : distance) : 0
  const initialY = direction === 'vertical' ? (reverse ? -distance : distance) : 0

  // Handle opacity animation
  const initialOpacityValue = animateOpacity ? initialOpacity : 1
  const finalOpacityValue = animateOpacity ? 1 : initialOpacityValue

  return (
    <motion.div
      layout
      ref={ref}
      initial={{ x: initialX, y: initialY, opacity: initialOpacityValue, scale }}
      animate={isVisible ? { x: 0, y: 0, opacity: finalOpacityValue, scale: 1 } : {}}
      exit={{ opacity: initialOpacityValue, filter: 'blur(8px)', transition: { duration: endDuration } }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
