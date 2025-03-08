import { atom } from "jotai";
import { Vector3 } from "three";

export const avatarPositionAtom = atom(new Vector3(-165, 1, -59));
export const avatarCameraRotationAtom = atom(-Math.PI / 2);
export const avatarCameraDistanceAtom = atom(15);
export const avatarRotationAtom = atom(0); // Initial Y rotation

export const avatarUrlAtom = atom<string | null>("https://models.readyplayer.me/67c73014fc7b58705586f455.glb");
