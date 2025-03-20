import { atom } from 'jotai'
import { FadeHandle } from '../components/Fade'

export const fadeRefAtom = atom<FadeHandle | null>(null)

// Add a more comprehensive transition state
export type TransitionState = 'idle' | 'fading-out' | 'loading' | 'fading-in'
export const transitionStateAtom = atom<TransitionState>('idle')

// Add a callback atom to run after fade completes
export const afterFadeCallbackAtom = atom<(() => void) | null>(null)
