import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useMemo } from "react";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
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
          far: 100,
          fov: 30,
        }}
      >
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
