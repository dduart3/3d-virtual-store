import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Background } from "./Background";
import { Environment, OrbitControls } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { ProductStage } from "./ProductStage";
import { useProductRotation } from "../hooks/useProductRotation";
export const ViewerScene = () => {
  const { isDragging, rotationSpeed } = useProductRotation();

  const { camera } = useThree();

  // Set up the camera for the viewer scene
  useEffect(() => {
    camera.position.set(0, 0, 10);

    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <group>
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.1}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI / 2}
        maxAzimuthAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
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
