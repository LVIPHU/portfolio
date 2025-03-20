import { Boxes, HoverVideoPin, SocialIcons } from '@/components/atoms'

export const HomeTemplate = () => {
  return (
    <main className='relative flex min-h-screen w-full flex-col overflow-hidden bg-background'>
      <div className='pointer-events-none absolute inset-0 z-10 bg-background [mask-image:radial-gradient(transparent,white)]' />
      <Boxes>
        <div
          className={'absolute z-20'}
          style={{
            gridColumn: '12 / 16',
            gridRow: '10 / span 2',
          }}
        >
          <HoverVideoPin name={'2'} height={300} />
        </div>

        <div className={'absolute left-3.5 top-32 z-10'}>
          <HoverVideoPin name={'1'} />
        </div>

        <div
          style={{
            gridColumn: '14 / 15',
            gridRow: '13 / span 1',
          }}
          className={'pointer-events-none absolute z-10'}
        >
          <SocialIcons kind={'logolight'} iconType={'icon'} size={96} />
        </div>
      </Boxes>
    </main>
  )
}
