import { atom } from 'jotai'
import { FadeHandle } from '../components/Fade'

export const fadeRefAtom = atom<FadeHandle | null>(null)