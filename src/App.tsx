import { useMemo } from "react";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import { ToastProvider } from "./shared/context/ToastContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { AuthDataLoader } from "./shared/components/AuthDataLoader";
import { SocketProvider } from "./modules/experience/multiplayer/context/SocketProvider";
import { SmoothScroller } from "./shared/components/SmoothScroller";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

function App() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.run, keys: ["ShiftLeft", "ShiftRight"] },
    ],
    []
  );
  return (
    <ToastProvider>
      <KeyboardControls map={map}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SocketProvider>
              <AuthDataLoader />
              <SmoothScroller />
              <RouterProvider router={router} />
            </SocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </KeyboardControls>
    </ToastProvider>
  );
}

export default App;
