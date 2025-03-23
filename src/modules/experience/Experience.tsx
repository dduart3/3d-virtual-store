import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Fade, FadeHandle } from "../../shared/components/Fade";
import { Avatar } from "../experience/avatar/components/Avatar";
import { ViewerScene } from "./product-viewer/components/ViewerScene";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../experience/product-viewer/state/viewer";
import { StoreScene } from "./store/components/StoreScene";
import { Physics } from "@react-three/rapier";
import { fadeRefAtom } from "../../shared/state/fade";
import { hideCanvasLoader } from "../../shared/utils/loaderUtils";
import { avatarUrlAtom } from "./avatar/state/avatar";
import { OnlineAvatars } from "./avatar/components/OnlineAvatars";
import { useJukeboxCamera } from "./jukebox/hooks/useJukeboxCamera";

export const Experience = () => {
  const fadeRef = useRef<FadeHandle>(null!);
  const [viewerState] = useAtom(viewerStateAtom);
  const [, setFadeRef] = useAtom(fadeRefAtom);
  const [avatarUrl] = useAtom(avatarUrlAtom);
  
  // Initialize jukebox camera system
  useJukeboxCamera();

  // Make fadeRef accessible via atom
  useEffect(() => {
    if (fadeRef.current) {
      setFadeRef(fadeRef.current);
    }
  }, [fadeRef, setFadeRef]);

  useEffect(() => {
    // Call after scene is loaded
    hideCanvasLoader();
  }, []);

  return (
    <group>
      <ambientLight intensity={0.8} />
      <Environment preset="dawn" />

      {!viewerState.isOpen ? (
        <Physics
          gravity={[0, -9.81, 0]} // Standard Earth gravity
          timeStep={1 / 60} // 60 FPS physics update
          interpolate={true} // Enable interpolation for smoother physics
          debug={false} // Disable debug rendering
        >
          <StoreScene />
          <Avatar key={avatarUrl} />
          <OnlineAvatars />
        </Physics>
      ) : (
        <ViewerScene />
      )}

      <Fade ref={fadeRef} />
    </group>
  );
};
