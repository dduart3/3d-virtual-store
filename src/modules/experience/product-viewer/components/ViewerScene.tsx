import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Background } from "./Background";
import { Environment } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { ProductStage } from "./ProductStage";
import { useProductRotation } from "../hooks/useProductRotation";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../state/viewer";
import { fadeRefAtom } from "../../../../shared/state/fade";

export const ViewerScene = () => {
  const { isDragging, rotationSpeed } = useProductRotation();
  const { camera } = useThree();
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);
  const [fadeRef] = useAtom(fadeRefAtom);

  // Set up the camera for the viewer scene
  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    
    // Mark scene as ready after a short delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsSceneReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [camera]);
  
  // When scene is ready, fade in if we were loading
  useEffect(() => {
    if (isSceneReady && viewerState.isLoading && fadeRef) {
      // Scene is ready, start fade in
      fadeRef.fadeFromBlack();
      
      // Update viewer state to not loading
      setViewerState({
        ...viewerState,
        isLoading: false
      });
    }
  }, [isSceneReady, viewerState, fadeRef, setViewerState]);

  return (
    <group>
      <ambientLight intensity={0.7} />
      <Background position={[0, 0, 3.7]} />
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, -5]}
        castShadow
      />
      <Environment preset="city" background blur={1} />

      <ProductStage isDragging={isDragging} rotationSpeed={rotationSpeed} />
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.3} />
      </EffectComposer>
    </group>
  );
};
