import { useTexture } from "@react-three/drei"
import { MeshProps } from "@react-three/fiber"

export function Background(props: MeshProps) {
    const texture = useTexture('/textures/background.jpg')
    return (
      <mesh {...props}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    )
  }
  