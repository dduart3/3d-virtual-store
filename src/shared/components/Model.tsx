import { GroupProps } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { criticalModelsLoadingAtom, criticalModelsProgressAtom } from "../state/loading";

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
  const [, setCriticalProgress] = useAtom(criticalModelsProgressAtom);
  const progressUpdated = useRef(false);
  
  // Track this model in the critical models list when it starts loading
  useEffect(() => {
    if (isCritical) {
      setCriticalLoading(prev => ({
        ...prev,
        [modelPath]: true
      }));
      
      // Initialize progress at 0%
      setCriticalProgress(prev => ({
        ...prev,
        [modelPath]: 0
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
        
        setCriticalProgress(prev => {
          const newState = { ...prev };
          delete newState[modelPath];
          return newState;
        });
      }
    };
  }, [modelPath, isCritical]);

  // Load the model with progress tracking
  const { scene } = useGLTF(path, undefined, undefined, (loader) => {
    if (isCritical) {
      loader.load(
        path,
        (gltf) => {
          // Model fully loaded (100%)
          setCriticalProgress(prev => ({
            ...prev,
            [modelPath]: 100
          }));
          
          // Add a small timeout to ensure the progress is updated before
          // marking as completed
          setTimeout(() => {
            setCriticalLoading(prev => ({
              ...prev,
              [modelPath]: false
            }));
          }, 50);
          
          progressUpdated.current = true;
        },
        (progressEvent) => {
          // Update progress percentage
          const progressPercent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setCriticalProgress(prev => ({
            ...prev,
            [modelPath]: progressPercent
          }));
        },
        (error) => {
          console.error(`Error loading model ${modelPath}:`, error);
          // Mark as loaded to avoid hanging the application
          setCriticalLoading(prev => ({
            ...prev,
            [modelPath]: false
          }));
        }
      );
    }
  });

  // Ensure model is properly marked as loaded when scene is available
  useEffect(() => {
    if (scene && isCritical && !progressUpdated.current) {
      console.log(`Model ${modelPath} loaded, marking as complete`);
      setCriticalProgress(prev => ({
        ...prev,
        [modelPath]: 100
      }));
      
      setCriticalLoading(prev => ({
        ...prev,
        [modelPath]: false
      }));
      
      progressUpdated.current = true;
    }
  }, [scene, modelPath, isCritical]);

  // Only render the model if it's loaded
  return scene ? <primitive object={scene.clone(true)} {...props} /> : null;
}
