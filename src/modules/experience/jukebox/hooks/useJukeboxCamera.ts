import { useFrame } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { 
  jukeboxModeAtom, 
  jukeboxCameraTargetAtom, 
  originalCameraStateAtom 
} from '../state/jukebox';
import { 
  avatarCameraRotationAtom, 
  avatarCameraDistanceAtom 
} from '../../avatar/state/avatar';

export function useJukeboxCamera() {
  const [jukeboxMode, setJukeboxMode] = useAtom(jukeboxModeAtom);
  const [jukeboxCameraTarget, setJukeboxCameraTarget] = useAtom(jukeboxCameraTargetAtom);
  const [originalCameraState, setOriginalCameraState] = useAtom(originalCameraStateAtom);
  const [cameraRotation, setCameraRotation] = useAtom(avatarCameraRotationAtom);
  const [cameraDistance, setCameraDistance] = useAtom(avatarCameraDistanceAtom);
  
  // Animation state
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const animationDuration = 1.5; // seconds
  
  // Target values for smooth animation
  const targetRotation = useRef(cameraRotation);
  const targetDistance = useRef(cameraDistance);
  
  // Handle mode changes
  useEffect(() => {
    if (jukeboxMode === 'active' && jukeboxCameraTarget) {
      // Start animation to jukebox
      isAnimating.current = true;
      animationProgress.current = 0;
      
      // Set target values
      targetRotation.current = jukeboxCameraTarget.rotation;
      targetDistance.current = jukeboxCameraTarget.distance;
    } else if (jukeboxMode === 'inactive' && originalCameraState) {
      // Start animation back to original position
      isAnimating.current = true;
      animationProgress.current = 0;
      
      // Set target values
      targetRotation.current = originalCameraState.rotation;
      targetDistance.current = originalCameraState.distance;
      
      // Clear target and original state
      setJukeboxCameraTarget(null);
      setOriginalCameraState(null);
    }
  }, [jukeboxMode, jukeboxCameraTarget, originalCameraState]);
  
  // Handle camera animation
  useFrame((_, delta) => {
    if (isAnimating.current) {
      // Update animation progress
      animationProgress.current += delta / animationDuration;
      
      if (animationProgress.current >= 1) {
        // Animation complete
        animationProgress.current = 1;
        isAnimating.current = false;
        
        // Set final values
        setCameraRotation(targetRotation.current);
        setCameraDistance(targetDistance.current);
      } else {
        // Smooth easing function (ease in-out)
        const t = animationProgress.current;
        const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        
        // Interpolate values
        const newRotation = lerpAngle(cameraRotation, targetRotation.current, easedT);
        const newDistance = lerp(cameraDistance, targetDistance.current, easedT);
        
        // Apply interpolated values
        setCameraRotation(newRotation);
        setCameraDistance(newDistance);
      }
    }
  });
  
  // Helper function to interpolate angles (handles wrapping)
  function lerpAngle(a: number, b: number, t: number): number {
    // Find the shortest path
    const diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
    return a + diff * t;
  }
  
  // Helper function for linear interpolation
  function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
  
  // Function to exit jukebox mode
  const exitJukeboxMode = () => {
    if (jukeboxMode === 'active') {
      setJukeboxMode('inactive');
    }
  };
  
  return { exitJukeboxMode };
}
