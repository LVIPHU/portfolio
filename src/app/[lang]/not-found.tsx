import Image from 'next/image'
import { Header, Layout } from '@/components/organisms'
import { PreviousPage } from '@/components/molecules'

export default async function NotFound() {
  return (
    <Layout>
      <Header title={'Oop!'} description={'Có vẻ như trang cậu tìm không có! Hãy quay trở lại!'} />
      <Image src={'/errors/404.svg'} width={700} height={700} alt={'not found'} />
      <PreviousPage />
    </Layout>
  )
}
