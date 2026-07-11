import { useTranslations } from 'next-intl'
import { ThemeSwitch } from './theme-switch'
import { LocaleSwitch } from './locale-switch'
import { Label } from '@/components/atoms'

export const Setting = () => {
  const t = useTranslations()
  return (
    <div className='grid gap-4'>
      <div className='space-y-2'>
        <h4 className='font-medium leading-none'>{t('Common.setting')}</h4>
      </div>
      <div className='grid gap-2'>
        <div className='grid grid-cols-3 items-center gap-4'>
          <Label>{t('Common.language')}</Label>
          <div className='col-span-2'>
            <LocaleSwitch />
          </div>
        </div>
        <div className='grid grid-cols-3 items-center gap-4'>
          <Label>{t('Setting.theme')}</Label>
          <div className='col-span-2 flex justify-center'>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  )
}
