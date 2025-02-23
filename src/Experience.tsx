import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Fade, FadeHandle } from "./shared/components/Fade";
import { Avatar } from "./modules/avatar/components/Avatar";
import { ViewerScene } from "./modules/product-viewer/components/ViewerScene";
import { useAtom, useSetAtom } from "jotai";
import { viewerStateAtom } from "./modules/product-viewer/state/viewer";
import { StoreScene } from "./modules/store/components/StoreScene";
import { fadeRefAtom } from "./shared/state/fade";
import { devModeAtom } from "./shared/state/dev";

export const Experience = () => {
  const fadeRef = useRef<FadeHandle>(null!)
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);
  const setFadeRef = useSetAtom(fadeRefAtom);
  const  [isDevMode, setDevMode] = useAtom(devModeAtom);

  const toggleViewer = () => {
    fadeRef.current.fadeToBlack();
    setTimeout(() => {
      setViewerState(prev => ({ ...prev, isOpen: !prev.isOpen }));
      fadeRef.current.fadeFromBlack();
    }, 1000);
  }

  const toggleDevMode = () => {
    setDevMode(prev => !prev);
  }

  useEffect(() => {
    const button = document.getElementById("viewer");
    const button2 = document.getElementById("dev");

    if (button && button2) {
      button.onclick = toggleViewer;
      button2.onclick = toggleDevMode;
    }
    setFadeRef(fadeRef.current);
  }, [])

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
