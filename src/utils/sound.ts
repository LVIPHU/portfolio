import { NOTES } from '@/constants/boxes'

export const playRandomNote = () => {
  const note = NOTES[Math.floor(Math.random() * NOTES.length)]
  const audio = new Audio(`/static/sounds/piano-${note}.wav`)
  audio.play()
}
