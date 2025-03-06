import Image from 'next/image'
import { Header, Layout } from '@/components/organisms'
import { PreviousPage } from '@/components/molecules'

export default async function NotFound() {
  return (
    <Layout>
      <Header title={'Oop!'} description={'Có vẻ như trang cậu tìm không có! Hãy quay trở lại!'} />
      <div className={'w-full h-[50vh] relative'}>
        <Image src={'/errors/404.svg'} fill={true} alt={'not found'} className={'object-contain'} />
      </div>
      <PreviousPage />
    </Layout>
  )
}
