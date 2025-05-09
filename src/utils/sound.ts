import { NOTES } from '@/constants/boxes'

const audioCache: Record<string, HTMLAudioElement> = {}

export const initAudio = () => {
  if (typeof window === 'undefined') return

  NOTES.forEach((note) => {
    const audio = new Audio(`/static/sounds/piano-${note}.wav`)
    audio.load()
    audioCache[note] = audio
  })
}

export const playRandomNote = () => {
  if (typeof window === 'undefined') return

  const note = NOTES[Math.floor(Math.random() * NOTES.length)]
  const audio = audioCache[note]

  if (!audio) return

  const clone = audio.cloneNode(true) as HTMLAudioElement
  clone.play()
}
