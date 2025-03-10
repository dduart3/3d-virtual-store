import { GroupProps } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { criticalModelsLoadingAtom } from "../state/loading";

interface ModelProps extends GroupProps {
  modelPath: string;
  isCritical?: boolean;
}

export const Model = ({ 
  modelPath, 
  isCritical = false,
  ...props 
}: ModelProps) => {
  const path = `/models/${modelPath}.glb`;
  const [, setCriticalLoading] = useAtom(criticalModelsLoadingAtom);
  
  // Track this model in the critical models list when it starts loading
  useEffect(() => {
    if (isCritical) {
      setCriticalLoading(prev => ({
        ...prev,
        [modelPath]: true
      }));
    }
    
    return () => {
      // Cleanup when component unmounts
      if (isCritical) {
        setCriticalLoading(prev => {
          const newState = { ...prev };
          delete newState[modelPath];
          return newState;
        });
      }
    };
  }, [modelPath, isCritical]);

  // Load the model
  const { scene } = useGLTF(path);
  
  // Update the critical model status when it finishes loading
  useEffect(() => {
    if (scene && isCritical) {
      setCriticalLoading(prev => ({
        ...prev,
        [modelPath]: false
      }));
    }
  }, [scene, modelPath, isCritical]);

  // Only render the model if it's loaded
  return scene ? <primitive object={scene.clone(true)} {...props} /> : null;
}