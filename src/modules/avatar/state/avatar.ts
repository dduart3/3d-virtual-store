import { atom } from "jotai";
import { Vector3 } from "three";

// Use a Vector3 for position to make it easier to work with Three.js
export const avatarPositionAtom = atom(new Vector3(-165, 0, -59));
export const avatarCameraRotationAtom = atom(-Math.PI / 2);
export const avatarCameraDistanceAtom = atom(15);
