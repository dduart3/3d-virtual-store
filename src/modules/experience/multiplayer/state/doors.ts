import { atom } from 'jotai';

export type DoorStatus = 'open' | 'closed';
export const doorStatusAtom = atom<DoorStatus>('closed');
