import { GroupProps } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"

export const Model = ({ modelPath, ...props }: { modelPath: string } & GroupProps) => {
  const path = `/models/${modelPath}.glb`;
  const { scene } = useGLTF(path);
  
  return <primitive object={scene.clone(true)} {...props} />
}