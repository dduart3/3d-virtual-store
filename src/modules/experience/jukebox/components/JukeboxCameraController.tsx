import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { jukeboxCameraTargetAtom, jukeboxModeAtom, originalCameraStateAtom } from "../state/jukebox";
import { avatarCameraDistanceAtom, avatarCameraRotationAtom } from "../../avatar/state/avatar";
import * as THREE from "three";

export function JukeboxCameraController() {
  const [jukeboxMode] = useAtom(jukeboxModeAtom);
  const [jukeboxCameraTarget] = useAtom(jukeboxCameraTargetAtom);
  const [originalCameraState] = useAtom(originalCameraStateAtom);
  const [, setCameraRotation] = useAtom(avatarCameraRotationAtom);
  const [, setCameraDistance] = useAtom(avatarCameraDistanceAtom);
  
  // For smooth camera transitions
  const currentCameraPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);
  
  // Start transition when entering/exiting jukebox mode
  useEffect(() => {
    if (jukeboxMode === 'active' && jukeboxCameraTarget) {
      isTransitioning.current = true;
    } else if (jukeboxMode === 'inactive' && originalCameraState) {
      // Restore original camera state
      setCameraRotation(originalCameraState.rotation);
      setCameraDistance(originalCameraState.distance);
    }
  }, [jukeboxMode, jukeboxCameraTarget, originalCameraState, setCameraRotation, setCameraDistance]);
  
  // Handle camera transitions
  useFrame((state, delta) => {
    if (jukeboxMode === 'active' && jukeboxCameraTarget) {
      // Get the target position
      const targetPos = jukeboxCameraTarget.position;
      
      // Get the target look position - either the lookAt property or calculated from rotation
      const targetLookAt = jukeboxCameraTarget.lookAt || new THREE.Vector3(
        targetPos.x + Math.sin(jukeboxCameraTarget.rotation) * 1.0,
        targetPos.y,
        targetPos.z + Math.cos(jukeboxCameraTarget.rotation) * 1.0
      );
      
      // Initialize current positions if needed
      if (!currentCameraPos.current.lengthSq() || !isTransitioning.current) {
        currentCameraPos.current.copy(state.camera.position);
      }
      if (!currentLookAt.current.lengthSq() || !isTransitioning.current) {
        currentLookAt.current.copy(targetLookAt);
      }
      
      // Smoothly interpolate camera position
      const lerpFactor = Math.min(delta * 4, 0.1); // Adjust for speed
      currentCameraPos.current.lerp(targetPos, lerpFactor);
      currentLookAt.current.lerp(targetLookAt, lerpFactor);
      
      // Apply interpolated camera position and look target
      state.camera.position.copy(currentCameraPos.current);
      state.camera.lookAt(currentLookAt.current);
      
      // Check if transition is complete
      if (currentCameraPos.current.distanceTo(targetPos) < 0.1) {
        isTransitioning.current = false;
      }
    }
  });
  
  return null;
}
