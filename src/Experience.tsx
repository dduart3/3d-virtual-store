import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Fade, FadeHandle } from "./shared/components/Fade";
import { Avatar } from "./modules/avatar/components/Avatar";
import { ViewerScene } from "./modules/product-viewer/components/ViewerScene";
import { useAtom } from "jotai";
import { viewerStateAtom } from "./modules/product-viewer/state/viewer";
import { StoreScene } from "./modules/store/components/StoreScene";
import { Physics } from "@react-three/rapier";
import { fadeRefAtom } from "./shared/state/fade";

export const Experience = () => {
  const fadeRef = useRef<FadeHandle>(null!);
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);
  const [, setFadeRef] = useAtom(fadeRefAtom);

  // Make fadeRef accessible via atom
  useEffect(() => {
    if (fadeRef.current) {
      setFadeRef(fadeRef.current);
    }
  }, [fadeRef, setFadeRef]);

  return (
    <group>
      <ambientLight intensity={0.8} />
      <Environment preset="dawn" />

      {!viewerState.isOpen ? (
        <Physics
          gravity={[0, -9.81, 0]} // Standard Earth gravity
          timeStep={1 / 60} // 60 FPS physics update
          interpolate={true} // Enable interpolation for smoother physics
          debug={!true} // Disable debug rendering
        >
          <StoreScene />
          <Avatar />
        </Physics>
      ) : (
        <ViewerScene />
      )}

      <Fade ref={fadeRef} />
    </group>
  );
};
