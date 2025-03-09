export const Blur = () => {
  return (
    <div
      className='fixed bottom-0 w-full backdrop-blur-sm pointer-events-none'
      style={{
        height: 'clamp(80px,10vh,200px)',
        maskImage: 'radial-gradient(to top, rgba(0, 0, 0, 1) 25%, transparent)',
        WebkitMaskImage: 'radial-gradient(to top, rgba(0, 0, 0, 1) 25%, transparent)'
      }}
    />
  )
}
