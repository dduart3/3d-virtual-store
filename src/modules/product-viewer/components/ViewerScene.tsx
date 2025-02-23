import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Background } from "./Background";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { ProductStage } from "./ProductStage";

export const ViewerScene = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const lastX = useRef(0);

  const { camera } = useThree();

  // Set up the camera for the viewer scene
  useEffect(() => {
    camera.position.set(0, 0, 10);

    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          lastX.current = e.clientX;
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (isDragging) {
            const delta = (e.clientX - lastX.current) * 0.005;
            setRotationSpeed(delta);
            lastX.current = e.clientX;
          }
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          setIsDragging(false);
          setTimeout(() => setRotationSpeed(0), 150);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setIsDragging(false);
          setTimeout(() => setRotationSpeed(0), 150);
        }}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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

      <ProductStage
  
        isDragging={isDragging}
        rotationSpeed={rotationSpeed}
      />
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.3} />
      </EffectComposer>
    </group>
  );
};