import { Canvas } from "@react-three/fiber";
import { Experience } from "./modules/experience/Experience";
import { useMemo } from "react";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { ViewerUI } from "./modules/product-viewer/components/ViewerUI";
enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

function App() {
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
      <ViewerUI />
    </KeyboardControls>
  );
}

export default App;
