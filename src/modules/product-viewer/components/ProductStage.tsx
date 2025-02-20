
import { useAtom } from 'jotai'
import { viewerStateAtom } from '../state/viewer'
import { Model } from '../../../components/Model'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Group } from 'three'

export const ProductStage = () => {
  const [viewerState] = useAtom(viewerStateAtom)
  const groupRef = useRef<Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })
  
  
  return (
    <group ref={groupRef} position={[0, 0, -3]} scale={[0.5, 0.5, 0.5]}>
      <Model 
        modelPath={'/products/men/shoes/oxford'}
        position={[0, -0.5, 0]}
      />
    </group>
  )
}
