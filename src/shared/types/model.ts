import { Euler, Vector3 } from "three";

export type Model = {
  path: string;
  position: [number, number, number] | Vector3;
  rotation?: [number, number, number] | Euler;
  scale?: number | [number, number, number];
  label?: string;
};