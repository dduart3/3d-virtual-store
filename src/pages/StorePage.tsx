import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../modules/experience/Experience";
import { ViewerUI } from "../modules/experience/product-viewer/components/ViewerUI";
import { UILayout } from "../modules/ui/components/UILayout";
import { useAtom } from "jotai";
import { viewerStateAtom } from "../modules/experience/product-viewer/state/viewer";
import { LoadingScreen } from "../shared/components/LoadingScreen";
import { useRouteHistory } from "../shared/hooks/useRouteHistory";

export function StorePage() {
  const [viewerState] = useAtom(viewerStateAtom);
  useRouteHistory();

  return (
    <div className="w-full h-screen relative overflow-hidden">
      
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
      
        <>
          <UILayout />
          {viewerState.isOpen && <ViewerUI />}
        </>
   
    </div>
  );
}
