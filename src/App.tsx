import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { ViewerUI } from "./modules/product-viewer/components/ViewerUI";
import { Experience } from "./Experience";
import { CartPanel } from "./modules/cart/components/CartPanel";
import { UILayout } from "./modules/ui/components/UILayout";
import { ToastProvider } from "./shared/context/ToastContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

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
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <KeyboardControls map={map}>
          <Canvas
            shadows
            camera={{
              near: 0.1,
              far: 1000,
              fov: 30,
            }}
          >
            <Experience />
          </Canvas>
          <ViewerUI />
          <UILayout>
            <CartPanel />
          </UILayout>
        </KeyboardControls>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
