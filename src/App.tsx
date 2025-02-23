import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { ViewerUI } from "./modules/product-viewer/components/ViewerUI";
import { Experience } from "./Experience";
import { devModeAtom } from "./shared/state/dev";
import { useAtom } from "jotai";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

function App() {
  const [isDevMode] = useAtom(devModeAtom);
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );
  return (
    <KeyboardControls map={map}>
      <Canvas
        shadows
        camera={{
          near: 0.1,
          far: 9000000000000000,
          fov: 30,
        }}
      >
        <Experience />
      </Canvas>
      {!isDevMode && <ViewerUI />}
    </KeyboardControls>
  );
}

export default App;
