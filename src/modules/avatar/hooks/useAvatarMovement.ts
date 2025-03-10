import { useRef, RefObject, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { RapierRigidBody } from '@react-three/rapier';
import { useAtom } from 'jotai';
import { avatarPositionAtom, avatarCameraRotationAtom, avatarRotationAtom } from '../state/avatar';
import { chatInputFocusedAtom } from '../../chat/state/chat';
import * as THREE from 'three';

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
  run = "run",
}

export function useAvatarMovement(
  rigidBodyRef: RefObject<RapierRigidBody>,
  modelRef: RefObject<THREE.Group>
) {
  const [position, setPosition] = useAtom(avatarPositionAtom);
  const [rotation, setRotation] = useAtom(avatarRotationAtom);
  const [cameraRotation] = useAtom(avatarCameraRotationAtom);
  const [chatInputFocused] = useAtom(chatInputFocusedAtom);
  const [, getKeys] = useKeyboardControls<Controls>();
  
  // Direction vector for smooth rotation
  const currentVelocity = useRef(new Vector3());
  
  // Initialize position and rotation on mount
  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation(
        { x: position.x, y: position.y, z: position.z },
        true
      );
    }
    
    if (modelRef.current) {
      modelRef.current.rotation.y = rotation;
    }
  }, []);
  
  // Movement settings
  const MOVE_SPEED = 3.0;
  const RUN_MULTIPLIER = 2.5;
  const ROTATION_SPEED = 10.0;
  
  useFrame((_state, delta) => {
    if (!rigidBodyRef.current || !modelRef.current || chatInputFocused) return;
    
    // Get input state
    const { forward, backward, left, right, run } = getKeys();
    
    // Get current physics state
    const physicsPos = rigidBodyRef.current.translation();
    const physicsVel = rigidBodyRef.current.linvel();
    
    // Calculate movement direction from input
    const inputDir = new Vector3(0, 0, 0);
    let isMoving = false;
    
    if (forward) { inputDir.z -= 1; isMoving = true; }
    if (backward) { inputDir.z += 1; isMoving = true; }
    if (left) { inputDir.x -= 1; isMoving = true; }
    if (right) { inputDir.x += 1; isMoving = true; }
    
    // Apply movement if there's input
    if (isMoving && inputDir.lengthSq() > 0) {
      // Normalize and apply camera rotation
      inputDir.normalize();
      const moveDir = inputDir.clone().applyAxisAngle(
        new Vector3(0, 1, 0), 
        cameraRotation
      );
      
      // Calculate speed
      const isRunning = run;
      const speed = MOVE_SPEED * (isRunning ? RUN_MULTIPLIER : 1.0);
      
      // Set velocity
      const newVelocity = {
        x: moveDir.x * speed,
        y: physicsVel.y, // Preserve vertical velocity
        z: moveDir.z * speed
      };
      
      rigidBodyRef.current.setLinvel(newVelocity, true);
      
      // Store current velocity for rotation
      currentVelocity.current.set(newVelocity.x, 0, newVelocity.z);
      
      // Calculate rotation based on movement direction
      if (currentVelocity.current.lengthSq() > 0.01) {
        const targetRotationY = Math.atan2(moveDir.x, moveDir.z);
        
        // Smoothly rotate to target direction
        const currentRotationY = modelRef.current.rotation.y;
        let newRotationY = currentRotationY;
        
        // Find the shortest path to the target rotation
        const deltaRotation = targetRotationY - currentRotationY;
        const deltaRotationNormalized = ((deltaRotation + Math.PI) % (Math.PI * 2)) - Math.PI;
        
        newRotationY += deltaRotationNormalized * Math.min(delta * ROTATION_SPEED, 1.0);
        modelRef.current.rotation.y = newRotationY;
        
        // Update rotation atom when model rotation changes
        if (newRotationY !== rotation) {
          setRotation(newRotationY);
        }
      }
    } else {
      // Stop horizontal movement when no input
      rigidBodyRef.current.setLinvel({
        x: 0,
        y: physicsVel.y,
        z: 0
      }, true);
    }
    
    // Update position atom
    setPosition(new Vector3(physicsPos.x, physicsPos.y, physicsPos.z));
    
    return {
      isMoving,
      isRunning: isMoving && run,
    };
  });
  
  return { position, rotation };
}