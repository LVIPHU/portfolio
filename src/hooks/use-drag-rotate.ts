import { useEffect, useRef, useState } from 'react'
import { calculateAngle } from '@/utils/math'

const MIN_ANGLE = -25
const MAX_ANGLE = 25

export function useDragRotate() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [angle, setAngle] = useState<number>(0)
  const targetAngleRef = useRef<number>(0)
  const animationRef = useRef<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const animate = () => {
    animationRef.current = requestAnimationFrame(animate)
    setAngle((prev) => {
      const diff = targetAngleRef.current - prev
      return Math.abs(diff) < 0.1 ? targetAngleRef.current : prev + diff * 0.1 // smooth easing
    })
  }

  useEffect(() => {
    if (!isDragging && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [isDragging])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!ref.current) return

    setIsDragging(true)
    animate()

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

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const animateBackToZero = () => {
    const startAngle = angle
    let start: number | null = null

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = (timestamp - start) / 300
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startAngle * (1 - eased)

      if (progress < 1) {
        setAngle(current)
        requestAnimationFrame(step)
      } else {
        setAngle(0)
      }
    }

    requestAnimationFrame(step)
  }

  return { ref, angle, isDragging, onMouseDown }
}
