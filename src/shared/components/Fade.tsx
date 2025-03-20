import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useImperativeHandle, useRef } from "react"
import * as THREE from "three"
import { useAtom } from "jotai"
import { transitionStateAtom, afterFadeCallbackAtom } from "../state/fade"

export type FadeHandle = {
  fadeToBlack: () => Promise<void>
  fadeFromBlack: () => Promise<void>
}

export const Fade = forwardRef<FadeHandle>((_, ref) => {
  const fadeRef = useRef<THREE.Mesh>(null!)
  const targetOpacity = useRef(0)
  const { camera } = useThree()
  const [transitionState, setTransitionState] = useAtom(transitionStateAtom)
  const [afterFadeCallback, setAfterFadeCallback] = useAtom(afterFadeCallbackAtom)

  useImperativeHandle(ref, () => ({
    fadeToBlack: () => {
      return new Promise<void>((resolve) => {
        targetOpacity.current = 1
        setTransitionState('fading-out')
        
        // Store the callback to be executed when fade out is complete
        setAfterFadeCallback(() => {
          setTransitionState('loading')
          resolve()
        })
      })
    },
    fadeFromBlack: () => {
      return new Promise<void>((resolve) => {
        targetOpacity.current = 0
        setTransitionState('fading-in')
        
        // Store the callback to be executed when fade in is complete
        setAfterFadeCallback(() => {
          setTransitionState('idle')
          resolve()
        })
      })
    }
  }))
  
  useFrame(() => {
    if (!fadeRef.current) return
    const material = fadeRef.current.material as THREE.MeshBasicMaterial
    const prevOpacity = material.opacity
    
    // Smoothly interpolate opacity
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity.current, 0.1)
    
    // Position the fade plane in front of the camera
    const distance = 1
    fadeRef.current.position.copy(camera.position)
    fadeRef.current.quaternion.copy(camera.quaternion)
    fadeRef.current.translateZ(-distance)
    
    // Check if fade transition is complete
    if (transitionState === 'fading-out' && material.opacity > 0.95 && prevOpacity <= material.opacity) {
      // Fade out complete
      if (afterFadeCallback) {
        afterFadeCallback()
        setAfterFadeCallback(null)
      }
    } else if (transitionState === 'fading-in' && material.opacity < 0.05 && prevOpacity >= material.opacity) {
      // Fade in complete
      if (afterFadeCallback) {
        afterFadeCallback()
        setAfterFadeCallback(null)
      }
    }
  })

  return (
    <mesh ref={fadeRef}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial color="black" transparent opacity={0} depthTest={false} side={THREE.DoubleSide} />
    </mesh>
  )
})
