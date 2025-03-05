import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useState, useEffect, RefObject } from "react";
import { Vector3, Quaternion, Euler } from "three";
import {
  avatarCameraDistanceAtom,
  avatarCameraRotationAtom,
} from "../state/avatar";
import { chatInputFocusedAtom } from "../../chat/state/chat";

export const useAvatarControls = (characterRef: RefObject<any>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [cameraRotation, setCameraRotation] = useAtom(avatarCameraRotationAtom);
  const [cameraDistance, setCameraDistance] = useAtom(avatarCameraDistanceAtom);
  const { gl } = useThree();
  const [chatInputFocused] = useAtom(chatInputFocusedAtom);

  // Constants
  const MOVEMENT_SPEED = 0.1;
  const MOUSE_SENSITIVITY = 0.003;
  const CAMERA_HEIGHT = 15;
  const MIN_ZOOM = 10;
  const MAX_ZOOM = 25;
  const ZOOM_SPEED = 0.3;
  const GROUND_OFFSET = 0.1; // Small offset to keep character slightly above ground

  // Set up mouse and wheel controls
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const zoomDirection = event.deltaY > 0 ? 1 : -1;
      setCameraDistance((prev) =>
        Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, prev + zoomDirection * ZOOM_SPEED)
        )
      );
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setCameraRotation((prev) => prev - event.movementX * MOUSE_SENSITIVITY);
      }
    };

    window.addEventListener("wheel", handleWheel);
    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("mouseup", handleMouseUp);
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("mouseleave", handleMouseUp);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mouseup", handleMouseUp);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [gl, isDragging]);

  // Update character movement based on keyboard controls
// In your updateMovement function

// Only modify the updateMovement function - keep everything else as you have it
const updateMovement = (controls: Record<string, boolean>) => {
  if (!characterRef.current || chatInputFocused) return;

  // Get current position and linear velocity
  const currentPos = characterRef.current.translation();
  const currentVel = characterRef.current.linvel();
  
  // Get raw input direction
  const inputDirection = new Vector3(0, 0, 0);
  let isMoving = false;
  let isRunning = false;
  
  // Process key inputs
  if (controls.forward) {
    inputDirection.z -= 1;
    isMoving = true;
  }
  if (controls.backward) {
    inputDirection.z += 1;
    isMoving = true;
  }
  if (controls.left) {
    inputDirection.x -= 1;
    isMoving = true;
  }
  if (controls.right) {
    inputDirection.x += 1;
    isMoving = true;
  }
  
  isRunning = isMoving && controls.shift;
  
  // Fall protection
  if (currentPos.y < -2) {
    characterRef.current.setTranslation(
      { x: currentPos.x, y: GROUND_OFFSET, z: currentPos.z },
      true
    );
    characterRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
  }
  
  if (isMoving && inputDirection.length() > 0) {
    // Normalize input direction
    inputDirection.normalize();
    
    // Apply camera rotation to make movement relative to camera
    const moveDirection = inputDirection.clone()
      .applyAxisAngle(new Vector3(0, 1, 0), cameraRotation);
    
    // Set velocity for movement - horizontal only, preserve vertical
    const moveSpeed = MOVEMENT_SPEED * (isRunning ? 1.8 : 1) * 10;
    characterRef.current.setLinvel(
      { 
        x: moveDirection.x * moveSpeed, 
        y: currentVel.y,  
        z: moveDirection.z * moveSpeed 
      },
      true
    );
    
    // Always update rotation when there's input - this is the key fix
    // Calculate target rotation based on movement direction
    const targetAngle = Math.atan2(moveDirection.x, moveDirection.z);
    
    // Create Euler rotation (rotates around Y axis only)
    const euler = new Euler(0, targetAngle, 0);
    
    // Convert to quaternion for physics engine
    const quat = new Quaternion().setFromEuler(euler);
    
    // Apply rotation directly through the RigidBody API
    characterRef.current.setRotation(
      { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
      true
    );
  } else {
    // When not moving, stop horizontal velocity but keep vertical
    characterRef.current.setLinvel(
      { x: 0, y: currentVel.y, z: 0 },
      true
    );
  }

  // Return animation state info
  return { 
    isMoving, 
    isRunning, 
    isJumping: Boolean(controls.jump)
  };
};


  // Update camera position to follow character
  const updateCamera = (state: any) => {
    if (!characterRef.current) return;

    const characterPosition = characterRef.current.translation();
    
    const cameraOffset = new Vector3(
      Math.sin(cameraRotation) * cameraDistance,
      CAMERA_HEIGHT * (cameraDistance / MAX_ZOOM),
      Math.cos(cameraRotation) * cameraDistance
    );
    
    state.camera.position.copy(new Vector3(
      characterPosition.x, 
      characterPosition.y, 
      characterPosition.z
    )).add(cameraOffset);
    
    state.camera.lookAt(
      characterPosition.x,
      characterPosition.y + 1,
      characterPosition.z
    );
  };

  return { updateMovement, updateCamera };
};
