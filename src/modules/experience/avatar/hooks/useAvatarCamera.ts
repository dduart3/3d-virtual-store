import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, RefObject } from 'react';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { avatarCameraRotationAtom, avatarCameraDistanceAtom } from '../state/avatar';
import { chatOpenAtom } from '../../../chat/state/chat';
import { RapierRigidBody } from '@react-three/rapier';
import { jukeboxModeAtom, jukeboxCameraTargetAtom } from '../../jukebox/state/jukebox';

export function useAvatarCamera(rigidBodyRef: RefObject<RapierRigidBody>) {
  const [cameraRotation, setCameraRotation] = useAtom(avatarCameraRotationAtom);
  const [cameraDistance, setCameraDistance] = useAtom(avatarCameraDistanceAtom);
  const [isChatOpen] = useAtom(chatOpenAtom);
  const [jukeboxMode] = useAtom(jukeboxModeAtom);
  const [jukeboxCameraTarget] = useAtom(jukeboxCameraTargetAtom);
  
  const isDragging = useRef(false);
  const { gl } = useThree();
  
  // Camera settings for Sims-like top-down view
  const CAMERA_HEIGHT_ANGLE = 0.7; // Angle between 0 (behind) and Math.PI/2 (directly above)
  const MIN_ZOOM = 8;
  const MAX_ZOOM = 25;
  const ZOOM_SPEED = 0.5;
  const MOUSE_SENSITIVITY = 0.003;
  
  // For smooth interpolation
  const currentCameraPos = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());
  
  // Camera interpolation settings
  const CAMERA_LERP_FACTOR = 0.08; // Lower for smoother, higher for more responsive
  const LOOKAT_LERP_FACTOR = 0.12; // Lower for smoother, higher for more responsive
  
  // Subtle camera animation
  const cameraAnimTime = useRef(0);
  const CAMERA_ANIM_SPEED = 0.5;
  const CAMERA_ANIM_AMOUNT = 0.15; // How much the camera subtly moves
  
  // Set up mouse controls for camera
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Don't start dragging if we clicked on the chat
      if (isChatOpen && isEventFromChat(e)) {
        return;
      }
      
      // Don't allow camera rotation when jukebox is active
      if (jukeboxMode === 'active') {
        return;
      }
      
      isDragging.current = true;
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setCameraRotation((prev) => prev - e.movementX * MOUSE_SENSITIVITY);
      }
    };
    
    const handleWheel = (e: WheelEvent) => {
      // Check if the wheel event originated from the chat
      if (isChatOpen && isEventFromChat(e)) {
        return; // Skip camera zoom if scrolling in chat
      }
      
      // Don't allow camera zoom when jukebox is active
      if (jukeboxMode === 'active') {
        return;
      }
      
      const zoomDirection = e.deltaY > 0 ? 1 : -1;
      setCameraDistance((prev) => 
        Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + zoomDirection * ZOOM_SPEED))
      );
    };
    
    // Helper function to check if an event originated from the chat
    const isEventFromChat = (e: Event): boolean => {
      // Check if the event target is inside the chat element
      const chatElement = document.querySelector('#chat-container');
      if (!chatElement) return false;
      
      return chatElement.contains(e.target as Node) || 
             chatElement === e.target;
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('mouseleave', handleMouseUp);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [gl, isChatOpen, jukeboxMode, setCameraRotation, setCameraDistance]);
  
  // Update camera position to follow avatar with Sims-like perspective
  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;
    
    // Handle jukebox camera mode
    if (jukeboxMode === 'active' && jukeboxCameraTarget) {
      // When jukebox is active, move camera to face the jukebox
      const targetPosition = jukeboxCameraTarget.position;
      
      // Calculate target camera position for jukebox view
      // We want to be in front of the jukebox, looking at it
      const jukeboxRotation = jukeboxCameraTarget.rotation;
      const jukeboxDistance = jukeboxCameraTarget.distance;
      
      // Calculate position in front of the jukebox
      const targetCameraPos = new Vector3(
        targetPosition.x - Math.sin(jukeboxRotation) * jukeboxDistance,
        targetPosition.y + 1, // Slightly above eye level
        targetPosition.z - Math.cos(jukeboxRotation) * jukeboxDistance
      );
      
      // Look directly at the jukebox
      const targetLookAt = new Vector3(
        targetPosition.x,
        targetPosition.y + 1, // Look at the middle of the jukebox
        targetPosition.z
      );
      
      // Smoothly move to the target position
      currentCameraPos.current.lerp(targetCameraPos, CAMERA_LERP_FACTOR * 1.5);
      currentLookAt.current.lerp(targetLookAt, LOOKAT_LERP_FACTOR * 1.5);
      
      // Apply camera position and look target
      state.camera.position.copy(currentCameraPos.current);
      state.camera.lookAt(currentLookAt.current);
      
      return;
    }
    
    // Normal camera behavior when not in jukebox mode
    // Update animation time for subtle camera movement
    cameraAnimTime.current += delta * CAMERA_ANIM_SPEED;
    
    const characterPos = rigidBodyRef.current.translation();
    const characterPosition = new Vector3(characterPos.x, characterPos.y, characterPos.z);
    
    // Calculate target camera position based on distance, rotation, and height angle
    const horizontalDistance = Math.cos(CAMERA_HEIGHT_ANGLE) * cameraDistance;
    const verticalDistance = Math.sin(CAMERA_HEIGHT_ANGLE) * cameraDistance;
    
    // Add subtle animation to camera position
    const animX = Math.sin(cameraAnimTime.current) * CAMERA_ANIM_AMOUNT;
    const animZ = Math.cos(cameraAnimTime.current * 0.7) * CAMERA_ANIM_AMOUNT;
    
    const targetCameraPos = new Vector3(
      characterPosition.x + Math.sin(cameraRotation) * horizontalDistance + animX,
      characterPosition.y + verticalDistance,
      characterPosition.z + Math.cos(cameraRotation) * horizontalDistance + animZ
    );
    
    // Calculate target look position (slightly ahead of character based on facing direction)
    const lookAheadDistance = 2;
    const lookAheadX = Math.sin(cameraRotation) * lookAheadDistance * 0.5;
    const lookAheadZ = Math.cos(cameraRotation) * lookAheadDistance * 0.5;
    
    const targetLookAt = new Vector3(
      characterPosition.x + lookAheadX,
      characterPosition.y + 1, // Look slightly above character's base
      characterPosition.z + lookAheadZ
    );
    
    // Initialize current positions if needed
    if (!currentCameraPos.current.lengthSq()) {
      currentCameraPos.current.copy(targetCameraPos);
    }
    if (!currentLookAt.current.lengthSq()) {
      currentLookAt.current.copy(targetLookAt);
    }
    
    // Smoothly interpolate camera position
    currentCameraPos.current.lerp(targetCameraPos, CAMERA_LERP_FACTOR);
    currentLookAt.current.lerp(targetLookAt, LOOKAT_LERP_FACTOR);
    
    // Apply interpolated camera position and look target
    state.camera.position.copy(currentCameraPos.current);
    state.camera.lookAt(currentLookAt.current);
  });
  
  return { cameraRotation, cameraDistance };
}
