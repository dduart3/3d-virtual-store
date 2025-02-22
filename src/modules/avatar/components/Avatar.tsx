import {  useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Group } from "three";
import { useEffect, useRef } from "react";
import { useAvatarControls } from "../hooks/useAvatarControls";
import { useAtom } from "jotai";
import { avatarPositionAtom } from "../state/avatar";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

export const Avatar = () => {
  const characterRef = useRef<Group>(null)
  const [position, setPosition] = useAtom(avatarPositionAtom)
  const [, get] = useKeyboardControls<Controls>()
  const { updateMovement, updateCamera } = useAvatarControls(characterRef)

  useEffect(() => {
    if (characterRef.current) {
      characterRef.current.position.copy(position)
    }
  }, [])

  useFrame((state) => {
    if (!characterRef.current) return
    updateMovement(get())
    updateCamera(state)
    setPosition(characterRef.current.position.clone())
  })

  return (
    <group position={position} ref={characterRef}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  )
}
