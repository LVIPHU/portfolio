'use client'
import React from 'react'
import { Boxes } from '@/components/atoms'

export const HomeTemplate = () => {
  // const { width = 0, height = 0 } = useWindowSize({ initializeWithValue: true })
  // const rotateRef = useRef(0);
  // const animationIdRef = useRef<number | null>(null);
  // const [isDragging, setIsDragging] = useState(false);
  // const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  // const handleMouseDown = (e: React.MouseEvent) => {
  //   if (e.button !== 0) return;
  //   e.preventDefault();
  //   setIsDragging(true);
  //   setStartPos({ x: e.clientX, y: e.clientY })
  //   if (animationIdRef.current) {
  //     cancelAnimationFrame(animationIdRef.current);
  //   }
  // }

  // const handleMouseMove = (e: MouseEvent) => {
  //   console.log('mouse move', e)
  //   if (!isDragging) return;
  //
  //   const delta = calculateAngle({
  //     x1: startPos.x,
  //     y1: startPos.y,
  //     x2: width/2,
  //     y2: height/2,
  //     x3: e.clientX,
  //     y3: e.clientY
  //   }) * 0.2;
  //
  //   const clampedDelta = Math.max(-24, Math.min(24, 11));
  //
  //   animationIdRef.current = requestAnimationFrame(() => {
  //     rotateRef.current = clampedDelta;
  //   });
  // }

  // const handleMouseUp = () => {
  //   console.log('mouse up')
  //   setIsDragging(false);
  //   rotateRef.current = 0;
  // }

  // useIsomorphicLayoutEffect(() => {
  //   window.addEventListener("mousemove", handleMouseMove);
  //   window.addEventListener("mouseup", handleMouseUp);
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [isDragging]);
  return (
    <section
      // onMouseDown={handleMouseDown}
      // style={{cursor: isDragging ? 'grabbing' : 'grab'}}
      className='relative min-h-screen w-screen overflow-hidden bg-background flex flex-col items-center justify-center'
    >
      <div className='absolute inset-0 w-full h-full bg-background z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />
      <Boxes
      // rotate={rotate}
      // isDragging={isDragging}
      />
    </section>
  )
}
