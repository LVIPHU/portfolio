import { Trans } from '@lingui/react/macro'
import { ThemeSwitch } from './theme-switch'
import { LocaleSwitch } from './locale-switch'

export const Setting = () => {
  return (
    <div className='grid gap-4'>
      <div className='space-y-2'>
        <h4 className='font-medium leading-none'>
          <Trans>Setting</Trans>
        </h4>
      </div>
      <div className='grid gap-2'>
        <div className='grid grid-cols-3 items-center gap-4'>
          <Trans>Language</Trans>
          <div className='col-span-2'>
            <LocaleSwitch />
          </div>
        </div>
        <div className='grid grid-cols-3 items-center gap-4'>
          <Trans>Theme</Trans>
          <div className='col-span-2 flex justify-center'>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  )
}
