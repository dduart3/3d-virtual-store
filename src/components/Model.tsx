import { GroupProps } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"

export const Model = ({ modelName, ...props }: { modelName: string } & GroupProps) => {
  const path = `/models/${modelName}.glb`;
  const { scene } = useGLTF(path);
  useGLTF.preload(path);
  
  return <primitive object={scene.clone(true)} {...props} />
}