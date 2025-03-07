import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Suspense } from "react";
import { Experience } from "../modules/store/Experience";
import { ViewerUI } from "../modules/product-viewer/components/ViewerUI";
import { UILayout } from "../modules/ui/components/UILayout";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../modules/product-viewer/state/viewer";

export function StoreExperience() {
  const [viewerState] = useAtom(viewerStateAtom);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
          { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
        ]}
      >
        <Canvas
          shadows
          camera={{
            near: 0.1,
            far: 1000,
            fov: 30,
          }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
        {/* UI Elements */}
        <UILayout />
        {viewerState.isOpen && <ViewerUI />}
      </KeyboardControls>
    </div>
  );
}
