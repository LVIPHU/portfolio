const SwirlingEffectSpinner = () => {
  return (
    <>
      <style>
        {`@keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        
          @keyframes spin2 {
            0% {
              stroke-dasharray: 1, 800;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 400, 400;
              stroke-dashoffset: -200px;
            }
            100% {
              stroke-dasharray: 800, 1;
              stroke-dashoffset: -800px;
            }
          }
        
          .spin2 {
            transform-origin: center;
            animation: spin2 1.5s ease-in-out infinite,
              spin 2s linear infinite;
            animation-direction: alternate;
          }`}
      </style>
      <svg viewBox='0 0 800 800' className='h-32 w-32' xmlns='http://www.w3.org/2000/svg'>
        <circle
          className='spin2 stroke-primary'
          cx='400'
          cy='400'
          fill='none'
          r='200'
          strokeWidth='50'
          strokeDasharray='700 1400'
          strokeLinecap='round'
        />
      </svg>
    </>
  )
}

export default function Loading() {
  return (
    <div className={'flex min-h-screen w-full items-center justify-center'}>
      <SwirlingEffectSpinner />
    </div>
  )
}
