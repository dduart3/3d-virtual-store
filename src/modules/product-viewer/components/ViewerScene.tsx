import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../state/viewer";
import { ProductStage } from "./ProductStage";
import { ViewerControls } from "./ViewerControls";
import * as THREE from "three";

export const ViewerScene = () => {
  // Always call your hooks
  const [viewerState] = useAtom(viewerStateAtom);
  const { camera } = useThree();
  const panelRef = useRef<THREE.Group>(null);

  // Attach the panel to the camera when viewer is open.
  useEffect(() => {
    if (viewerState.isOpen && panelRef.current) {
      // Reset camera orientation to face forward

    camera.updateMatrixWorld()
    camera.add(panelRef.current)
    }
    return () => {
      if (panelRef.current) {
        camera.remove(panelRef.current);
      }
    };
  }, [viewerState.isOpen, camera]);

  // Update panel transform each frame, regardless of viewer state.
  useFrame(() => {
    if (panelRef.current && viewerState.isOpen) {
      // Always position the panel 3 units in front of the camera.
      panelRef.current.position.set(0, 0, -3);
      panelRef.current.rotation.set(0, 0, 0);
      panelRef.current.updateMatrixWorld();
    }
  });

  // Now, conditionally return null if the viewer is not active.
  if (!viewerState.isOpen) return null;

  return (
    <group ref={panelRef} renderOrder={10}>
      {/* Dark overlay behind the viewer panel */}
      <mesh position={[0, 0, -0.2]} renderOrder={8}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="black"
          transparent
          opacity={0.6}
          depthTest={false}
        />
      </mesh>

      {/* The viewer "modal" panel */}
      <group position={[0, 0, 0]} renderOrder={9}>
        {/* Panel background */}
        <mesh renderOrder={9.1}>
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} />
        </mesh>

        {/* Product model panel: offset forward so it appears on top of the background */}
        <group position={[0, 0, 0.3]} renderOrder={10}>
          <ProductStage />
        </group>
        {/* Viewer controls */}
        <ViewerControls />
      </group>
    </group>
  );
};
