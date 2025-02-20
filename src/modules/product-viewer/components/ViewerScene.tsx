import { useThree } from '@react-three/fiber'
import { useAtom } from 'jotai'
import { Vector3 } from 'three'
import { viewerStateAtom } from '../state/viewer'
import { ProductStage } from './ProductStage'
import { ViewerControls } from './ViewerControls'

export const ViewerScene = () => {
  const [viewerState] = useAtom(viewerStateAtom)
  const { camera } = useThree()

  if (!viewerState.isOpen) return null

  const direction = camera.getWorldDirection(new Vector3())
  const distance = 3
  const position = camera.position.clone().add(direction.multiplyScalar(distance))

  return (
    <>
      {/* Full screen overlay */}
      <ambientLight intensity={10} />
      <mesh position={position.clone().sub(direction.multiplyScalar(0.1))}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="black" transparent opacity={0.5} depthTest={false} />
      </mesh>

      {/* Viewer panel */}
      <group position={position}>
        <mesh>
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial color="white" transparent opacity={0.9} />
        </mesh>
        <ProductStage />
        <ViewerControls />
      </group>
    </>
  )
}