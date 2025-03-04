import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { Vector3 } from "three";
import {
  avatarCameraDistanceAtom,
  avatarCameraRotationAtom,
} from "../state/avatar";
import { chatInputFocusedAtom } from "../../chat/state/chat";

export const useAvatarControls = (characterRef: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [cameraRotation, setCameraRotation] = useAtom(avatarCameraRotationAtom);
  const [cameraDistance, setCameraDistance] = useAtom(avatarCameraDistanceAtom);
  const { gl } = useThree();
  const [chatInputFocused] = useAtom(chatInputFocusedAtom);

  const MOVEMENT_SPEED = 15;
  const MOUSE_SENSITIVITY = 0.003;
  const CAMERA_HEIGHT = 15;
  const MIN_ZOOM = 10;
  const MAX_ZOOM = 25;
  const ZOOM_SPEED = 0.3;

  // Camera zoom with mouse wheel
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

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Camera rotation with mouse drag
  useEffect(() => {
    const handleMouseDown = () => {
      if (!chatInputFocused) setIsDragging(true);
    };
    
    const handleMouseUp = () => setIsDragging(false);
    
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && !chatInputFocused) {
        setCameraRotation((prev) => prev - event.movementX * MOUSE_SENSITIVITY);
      }
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("mouseup", handleMouseUp);
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("mouseleave", handleMouseUp);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mouseup", handleMouseUp);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [gl, isDragging, chatInputFocused]);

  // Update character movement based on keyboard controls
  const updateMovement = (controls: Record<string, boolean>) => {
    if (!characterRef.current) return;

    if (!chatInputFocused) {
      const moveDirection = new Vector3();
      
      // Calculate movement direction from keyboard input
      if (controls.forward) moveDirection.z -= 1;
      if (controls.backward) moveDirection.z += 1;
      if (controls.left) moveDirection.x -= 1;
      if (controls.right) moveDirection.x += 1;

      // Apply movement if there's input
      if (moveDirection.length() > 0) {
        // Normalize and scale the movement
        moveDirection.normalize().multiplyScalar(MOVEMENT_SPEED);
        
        // Apply camera rotation to movement direction
        moveDirection.applyAxisAngle(new Vector3(0, 1, 0), cameraRotation);
        
        // Set linear velocity for physics movement
        characterRef.current.setLinvel({
          x: moveDirection.x,
          y: 0,
          z: moveDirection.z
        }, true);
        
        // Update rotation to face movement direction
        const angle = Math.atan2(moveDirection.x, moveDirection.z);
        characterRef.current.setRotation({
          x: 0,
          y: Math.sin(angle/2),
          z: 0,
          w: Math.cos(angle/2)
        }, true);
      } else {
        // Stop movement when no keys are pressed
        characterRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
  };

  // Update camera position to follow character
  const updateCamera = (state: any) => {
    if (!characterRef.current) return;
    
    // Get character position from physics
    const physicsPos = characterRef.current.translation();
    
    // Calculate camera position based on distance and rotation
    const cameraOffset = new Vector3(
      Math.sin(cameraRotation) * cameraDistance,
      CAMERA_HEIGHT * (cameraDistance / MAX_ZOOM),
      Math.cos(cameraRotation) * cameraDistance
    );
    
    // Get character position
    const characterPosition = new Vector3(
      physicsPos.x,
      physicsPos.y,
      physicsPos.z
    );
    
    // Position camera and look at character
    state.camera.position.copy(characterPosition).add(cameraOffset);
    state.camera.lookAt(characterPosition);
  };

  return { updateMovement, updateCamera };
};
