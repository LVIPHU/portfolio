'use client'

import { Blur, ParallaxScroll, ParallaxScrollImage } from '@/components/molecules'
import { t } from '@lingui/macro'
import { Header } from '@/components/organisms'
import { useLingui } from '@lingui/react'
import { Container } from '@/components/atoms'

export const PhotosTemplate = () => {
  const { i18n } = useLingui()
  const imageList: ParallaxScrollImage[] = [
    {
      id: '5015',
      src: '1kvTR0zPTualJFcmKTwetg7Ztda5OeqjN'
    },
    {
      id: '5020',
      src: '1i0rsOybf_IQrbTusWmTa83goIG4l3tOI'
    },
    {
      id: '5021',
      src: '1OGAsQc-jNxPXJb-LARNZSbpFIHZWA224'
    },
    {
      id: '5022',
      src: '15nWHld3fWe7vtzVZuD2qRprgaPTqoiz2'
    },
    {
      id: '5023',
      src: '16Kb0wyJML7q-Att4L3jtPvV6LYN6lhEc'
    },
    {
      id: '5027',
      src: '1nL_HdhVaq0xMdEqT1LMkR3jqQ9XaiDbq'
    },
    {
      id: '5028',
      src: '1yp4HBHCpQ8xMzd5DWxx0dwuNgYeBNl8S'
    },
    {
      id: '5029',
      src: '1a0iJvhOZJ1kT4jzbve125ECPifT9SBtZ'
    },
    {
      id: '5031',
      src: '1hrUmwAq32T3KwDHvAB8uAPGiCS7B0j4z'
    },
    {
      id: '5085',
      src: '1-yM1sOgxpl3ET57bCO-X8aGH3wcQodsT'
    },
    {
      id: '5086',
      src: '11_rkgMWWrtyZUDpnZWKje3mHFNur2cMU'
    },
    {
      id: '5087',
      src: '12VlVsdYLHdplrCZ8Gf5IrKVxztLbV414'
    },
    {
      id: '5094',
      src: '1XWwCsyChk12oiKXJ7jy3Gb3ENiOqn216'
    },
    {
      id: '5095',
      src: '1eYoi4b0OzxeY1I2I2JzgjLDKkm43rtNI'
    },
    {
      id: '5104',
      src: '1ZYw7oV71rvnnr3wasWblBAPrlyhU-Q22'
    },
    {
      id: '5105',
      src: '1WhW9ptbDXtRFKvhioJ3MVlaFFcQoasNS'
    },
    {
      id: '5110',
      src: '1YPQKwfqxyXInUtZu-fmiCFr3wDyrkOuv'
    },
    {
      id: '5112',
      src: '1eAzVYLk_u0lW2fCHt-9REwj3m3vIDfko'
    },
    {
      id: '5113',
      src: '1aH_8AifWx_teN926f7yoRnVay_Mme7SX'
    },
    {
      id: '5116',
      src: '1zXoQ-9rnsV_W9Jqvy4k4-zFHDASc866K'
    },
    {
      id: '5118',
      src: '1H8oZsEJqIBqzDmYbxhK6QQIby7RYoBX3'
    },
    {
      id: '5119',
      src: '1H8oZsEJqIBqzDmYbxhK6QQIby7RYoBX3'
    },
    {
      id: '5122',
      src: '1DME1TdUsvujHv1rTOs6JBGzW7UgMNUwm'
    },
    {
      id: '5124',
      src: '1wfWxM6mrOu_kiwgEstfkMSpJ34KpYKvm'
    },
    {
      id: '5125',
      src: '1lZuIFYJejN_93WU8wA7Ska8ixe1AuQ3o'
    },
    {
      id: '5126',
      src: '1ojLfV8HnmPHqRt4ZjmydckQKhwS2LYQk'
    },
    {
      id: '5128',
      src: '1ls3A86a6v2pOQPExsJ9GxI8ovkFroHBZ'
    },
    {
      id: '5131',
      src: '1ls3A86a6v2pOQPExsJ9GxI8ovkFroHBZ'
    },
    {
      id: '5133',
      src: '1NQMr2rJ5mL2ZiSJs8ilG34vaEquU_jvG'
    },
    {
      id: '5136',
      src: '1bRJvUihQ1AbII9z9xlHeHI96LyT6__W5'
    },
    {
      id: '5137',
      src: '1m128-bF3Uqh4YKDu_YUunmAnq6Y5n9kN'
    },
    {
      id: '5138',
      src: '1HTDwyySnAwQRYRBZ0ShSDdZVbbG711he'
    },
    {
      id: '5139',
      src: '1Pfw87XGOx_TmflYNO7wMP7E9icDIHKZx'
    },
    {
      id: '5144',
      src: '1gsilI3JF3vzL27pFpZOojPJxuD5R9La2'
    },
    {
      id: '5146',
      src: '13ZYgGFOjXJW4IbTdJ6NQNdSMiZbMtSNK'
    },
    {
      id: '5149',
      src: '1NUyC9Hux5IQhMAsXALZStHBzBsD1x04w'
    },
    {
      id: '5189',
      src: '18b0K9_icSQpVIvktcBQRwz5wR886_P89'
    },
    {
      id: '5191',
      src: '1GMle3PM35mdxtfr3npS0ixbzQyqYjuEQ'
    },
    {
      id: '5192',
      src: '1L4toLy75Gm4wHKlPLRBqEgVYVjmi1UKb'
    },
    {
      id: '5194',
      src: '1id73Y9M2VyeXOO3ZY2fA1EPS6vwsDz-C'
    },
    {
      id: '5195',
      src: '1EWUdwYIpM4mLQgrVUILqFBFhgv1V9ltY'
    },
    {
      id: '5196',
      src: '1eauSG0n53FTKSncyFrgLpMMXq8Z0hFyl'
    },
    {
      id: '5255',
      src: '1IBOq9YrI7kw3jgqAkX9WRgYEelJP_gWe'
    },
    {
      id: '5257',
      src: '1FmbKQgDQuFaFNwaeKLFy1NiSyS0l3j2P'
    },
    {
      id: '5259',
      src: '19_zu_JrV0EqaJ2Ull9zFE8Mv3oXhGXtL'
    },
    {
      id: '5261',
      src: '1XNs55-jjVkqbwQgJRBX-4Il7JGwA5Ttf'
    },
    {
      id: '5263',
      src: '1UmTiW77ntZzXWW4OBjomdmjY9JyDnlwK'
    },
    {
      id: '5308',
      src: '1dmP7r8Yr7YqXMuUxbgXlvLZTO0o3r2fH'
    },
    {
      id: '5310',
      src: '1HS28GFSYVGiWkr1qhBdxkglkuJFzklnV'
    },
    {
      id: '5312',
      src: '1wwDSHCJqv_h7Doo-BA9jw4TMqs0fTJ2A'
    },
    {
      id: '5314',
      src: '1_pr-N1Hhod0hQZ9Yj6zqX-5HqZ29Q1zN'
    },
    {
      id: '5317',
      src: '1N5GeGxc7xAJK-HxQgyf05bGL0SCbzrVE'
    },
    {
      id: '5318',
      src: '1rXKDRjlZ-zBZ4Yv9zqjjAAGzucL3nGmb'
    },
    {
      id: '5321',
      src: '1oXNqGEkoclWv1uJyXRh5Z2hMQ53_KbMD'
    },
    {
      id: '5328',
      src: '1tHSXyPRhd7qnUPeCl1Cby06GsGwY7vi2'
    }
  ]
  return (
    <Container>
      <Header title={t(i18n)`Photos`} description={t(i18n)`Photos`} />
      <section className={'items-start'}>
        <ParallaxScroll images={imageList}></ParallaxScroll>
      </section>
      <Blur />
    </Container>
  )
}
