import { atom } from "jotai";

export interface OnlineAvatar {
  id: string;
  username: string;
  avatar_url: string;
  position: [number, number, number];
  rotation: number;
  last_updated: number;
  isMoving: boolean;
  isRunning: boolean;
}

// Store all online avatars
export const onlineAvatarsAtom = atom<Record<string, OnlineAvatar>>({});

// Current user's avatar ID (to exclude from rendering)
export const currentAvatarIdAtom = atom<string | null>(null);
