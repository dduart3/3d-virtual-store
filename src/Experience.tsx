import { Environment } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Fade, FadeHandle } from "./shared/components/Fade";
import { Avatar } from "./modules/avatar/components/Avatar";
import { ViewerScene } from "./modules/product-viewer/components/ViewerScene";
import { useAtom } from "jotai";
import { viewerStateAtom } from "./modules/product-viewer/state/viewer";
import { StoreScene } from "./modules/store/components/StoreScene";
import { fadeRefAtom } from "./shared/state/fade";

export const Experience = () => {
  const fadeRef = useRef<FadeHandle>(null!);
  const [viewerState] = useAtom(viewerStateAtom);
  const [, setFadeRef] = useAtom(fadeRefAtom);

  // Set the fade ref in the atom when it's available
  useEffect(() => {
    if (fadeRef.current) {
      setFadeRef(fadeRef.current);
    }
  }, [setFadeRef]);
  
  return (
    <group>
      <ambientLight intensity={0.8} />
      <Environment preset="dawn" />

      {!viewerState.isOpen ? (
        <group>
          <StoreScene />
          <Avatar />
        </group>
      ) : (
        <ViewerScene />
      )}

      <Fade ref={fadeRef} />
    </group>
  );
};
