import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Fade, FadeHandle } from "./components/Fade";
import { Scene } from "./modules/store/Scene";
import { Avatar } from "./modules/avatar/components/Avatar";
import { ViewerScene } from "./modules/product-viewer/components/ViewerScene";
import { useAtom } from "jotai";
import { viewerStateAtom } from "./modules/product-viewer/state/viewer";

export const Experience = () => {
  const fadeRef = useRef<FadeHandle>(null!);
  const [viewerState, setViewerState] = useAtom(viewerStateAtom);

  const toggleViewer = () => {
    fadeRef.current.fadeToBlack();
    setTimeout(() => {
      setViewerState(prev => ({ ...prev, isOpen: !prev.isOpen }));
      fadeRef.current.fadeFromBlack();
    }, 1000);
  }

  useEffect(() => {
    const button = document.getElementById("toggle-viewer-button");
    if (button) {
      button.onclick = toggleViewer;
    }
  }, []);
  
  return (
    <group>
      <ambientLight intensity={0.8} />
      <Environment preset="dawn" />

      {!viewerState.isOpen ? (
        <group>
          <Scene />
          <Avatar />
        </group>
      ) : (
        <ViewerScene />
      )}

      <Fade ref={fadeRef} />
    </group>
  );
};
