import { atom } from 'jotai';
import { Vector3 } from 'three';

// Define types
export type JukeboxMode = 'inactive' | 'active';
export type JukeboxState = 'idle' | 'processing' | 'playing';

export type Song = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  addedBy: string;
  filePath: string;
};

export type CameraState = {
  rotation: number;
  distance: number;
};

export type CameraTarget = {
  position: Vector3;
  rotation: number;
  distance: number;
  lookAt?: Vector3;
};

// Define atoms
export const jukeboxModeAtom = atom<JukeboxMode>('inactive');
export const jukeboxStateAtom = atom<JukeboxState>('idle');
export const currentSongAtom = atom<Song | null>(null);
export const originalCameraStateAtom = atom<CameraState | null>(null);
export const jukeboxCameraTargetAtom = atom<CameraTarget | null>(null);
