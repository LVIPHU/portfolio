import { generateRSS } from './rss'

async function postbuild() {
  await generateRSS()
}

postbuild()
