import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useImperativeHandle, useRef } from "react"
import * as THREE from "three"

export type FadeHandle = {
  fadeToBlack: () => void
  fadeFromBlack: () => void
}

export const Fade = forwardRef<FadeHandle>((_, ref) => {
  const fadeRef = useRef<THREE.Mesh>(null!)
  const targetOpacity = useRef(0)
  const { camera } = useThree()

  useImperativeHandle(ref, () => ({
    fadeToBlack: () => targetOpacity.current = 1,
    fadeFromBlack: () => targetOpacity.current = 0
  }))
  
  useFrame(() => {
    if (!fadeRef.current) return
    const material = fadeRef.current.material as THREE.MeshBasicMaterial
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity.current, 0.1)

    const distance = 1
    fadeRef.current.position.copy(camera.position)
    fadeRef.current.quaternion.copy(camera.quaternion)
    fadeRef.current.translateZ(-distance)
  })

  return (
    <mesh ref={fadeRef}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial color="black" transparent opacity={0} depthTest={false} side={THREE.DoubleSide} />
    </mesh>
  )
})
