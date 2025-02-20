import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../state/viewer";
import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { Model } from "../../../components/Model";

export const ViewerScene = () => {
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);
  const { camera } = useThree();
  const productRef = useRef<Group>(null);
  const viewerRef = useRef<Group>(null);

  // Position the viewer relative to the camera
  useFrame((state) => {
    if (viewerRef.current && viewerState.isOpen) {
      // Calculate a position 3 units in front of the camera
      const offset = new Vector3(0, 0, -3);
      offset.applyQuaternion(camera.quaternion); // Adjust for camera rotation
      viewerRef.current.position.copy(camera.position).add(offset);

      // Align the viewer with the camera's rotation
      viewerRef.current.quaternion.copy(camera.quaternion);
    }

    // Rotate the product slowly
    if (productRef.current) {
      productRef.current.rotation.y += 0.01;
    }
  });

  // Close the viewer
  const handleClose = () => {
    setViewerState((prev) => ({ ...prev, isOpen: false }));
  };

  // Navigate to the next product
  const handleNext = () => {
    setViewerState((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.catalog.length,
      currentProduct: prev.catalog[(prev.currentIndex + 1) % prev.catalog.length],
    }));
  };

  // Navigate to the previous product
  const handlePrev = () => {
    setViewerState((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.catalog.length) % prev.catalog.length,
      currentProduct: prev.catalog[(prev.currentIndex - 1 + prev.catalog.length) % prev.catalog.length],
    }));
  };

  if (!viewerState.isOpen) return null;

  return (
    <group ref={viewerRef}>
      {/* Dark overlay */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="black" transparent opacity={0.6} />
      </mesh>

      {/* Product display */}
      <group ref={productRef} position={[0, 0, 0]}>
        <Model
          modelPath={'/products/men/shoes/oxford'}
          position={[0, 0, 0]}
        />
      </group>

      {/* Controls */}
      <Html center>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <button onClick={handlePrev} style={{ marginRight: "10px" }}>Previous</button>
          <button onClick={handleNext} style={{ marginRight: "10px" }}>Next</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </Html>
    </group>
  );
};