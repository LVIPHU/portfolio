'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
const calculateAngle = ({ cx, cy, ex, ey }: { cx: number; cy: number; ex: number; ey: number }) => {
  const dy = ey - cy
  const dx = ex - cx
  const rad = Math.atan2(dy, dx)
  return (rad * 180) / Math.PI
}

const MIN_ANGLE = -25
const MAX_ANGLE = 25

export function useDragRotate() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [angle, setAngle] = useState<number>(0)
  const targetAngleRef = useRef<number>(0)
  const animationRef = useRef<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const animate = useCallback(() => {
    if (!isDragging) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    setAngle((prev) => {
      const diff = targetAngleRef.current - prev
      if (Math.abs(diff) < 0.1) {
        return targetAngleRef.current
      }
      return prev + diff * 0.1 // smooth easing
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [isDragging])

  useEffect(() => {
    if (isDragging && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    } else if (!isDragging && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isDragging, animate])

  const animateBackToZero = useCallback(() => {
    const startAngle = targetAngleRef.current
    let start: number | null = null
    let rafId: number | null = null

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = (timestamp - start) / 300
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startAngle * (1 - eased)

      if (progress < 1) {
        setAngle(current)
        rafId = requestAnimationFrame(step)
      } else {
        setAngle(0)
        targetAngleRef.current = 0
        rafId = null
      }
    }

    rafId = requestAnimationFrame(step)
  }, [])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const onMouseMove = (e: MouseEvent) => {
      const newAngle = calculateAngle({ cx: centerX, cy: centerY, ex: e.clientX, ey: e.clientY })
      if (newAngle >= MIN_ANGLE && newAngle <= MAX_ANGLE) {
        targetAngleRef.current = newAngle
      }
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      setIsDragging(false)
      animateBackToZero()
    }

    setIsDragging(true)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return { ref, angle, isDragging, onMouseDown }
}
