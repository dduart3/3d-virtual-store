import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { Vector3 } from "three";
import {
  avatarCameraDistanceAtom,
  avatarCameraRotationAtom,
} from "../state/avatar";

export const useAvatarControls = (characterRef: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [cameraRotation, setCameraRotation] = useAtom(avatarCameraRotationAtom);
  const [cameraDistance, setCameraDistance] = useAtom(avatarCameraDistanceAtom);
  const { gl } = useThree();

  const MOVEMENT_SPEED = 0.1;
  const MOUSE_SENSITIVITY = 0.003;
  const CAMERA_HEIGHT = 15;
  const MIN_ZOOM = 10;
  const MAX_ZOOM = 25;
  const ZOOM_SPEED = 0.3;

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

  useEffect(() => {
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
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
  }, [gl, isDragging]);

  const updateMovement = (controls: Record<string, boolean>) => {
    if (!characterRef.current) return;

    const moveDirection = new Vector3();
    if (controls.forward) moveDirection.z -= 1;
    if (controls.backward) moveDirection.z += 1;
    if (controls.left) moveDirection.x -= 1;
    if (controls.right) moveDirection.x += 1;

    if (moveDirection.length() > 0) {
      moveDirection.normalize().multiplyScalar(MOVEMENT_SPEED);
      moveDirection.applyAxisAngle(new Vector3(0, 1, 0), cameraRotation);
      characterRef.current.position.add(moveDirection);
      characterRef.current.rotation.y = Math.atan2(
        moveDirection.x,
        moveDirection.z
      );
    }
  };

  const updateCamera = (state: any) => {
    if (!characterRef.current) return;

    const cameraOffset = new Vector3(
      Math.sin(cameraRotation) * cameraDistance,
      CAMERA_HEIGHT * (cameraDistance / MAX_ZOOM),
      Math.cos(cameraRotation) * cameraDistance
    );
    state.camera.position.copy(characterRef.current.position).add(cameraOffset);
    state.camera.lookAt(characterRef.current.position);
  };

  return { updateMovement, updateCamera };
};
