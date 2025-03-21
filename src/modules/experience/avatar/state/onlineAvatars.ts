import { atom } from "jotai";
import { Vector3 } from "three";

export interface OnlineAvatar {
  id: string;
  username: string;
  avatar_url: string;
  position: Vector3;
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
  lastUpdated: number;
}

// Store all online avatars
export const onlineAvatarsAtom = atom<Record<string, OnlineAvatar>>({});
