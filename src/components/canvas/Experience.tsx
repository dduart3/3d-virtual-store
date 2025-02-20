import { Environment, Sky, useKeyboardControls } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Group } from "three"
import { useAtom } from "jotai"
import { viewerStateAtom } from "../../modules/product-viewer/state/viewer"
import { Scene } from "./Scene"
import { ViewerScene } from "../../modules/product-viewer/components/ViewerScene"

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

export const Experience = () => {
  const characterRef = useRef<Group>(null)
  const [, get] = useKeyboardControls<Controls>()
  const [cameraDistance, setCameraDistance] = useState(15)
  const [cameraRotation, setCameraRotation] = useState(-Math.PI / 2)
  const [isDragging, setIsDragging] = useState(false)
  const { gl, camera } = useThree()

  const MOVEMENT_SPEED = 0.1
  const CAMERA_HEIGHT = 15
  const MIN_ZOOM = 10
  const MAX_ZOOM = 25
  const ZOOM_SPEED = 0.3
  const MOUSE_SENSITIVITY = 0.003

  useEffect(() => {

    const handleMouseDown = () => setIsDragging(true)
    const handleMouseUp = () => setIsDragging(false)
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setCameraRotation((prev) => prev - event.movementX * MOUSE_SENSITIVITY)
      }
    }
    const handleWheel = (event: WheelEvent) => {
      const zoomDirection = event.deltaY > 0 ? 1 : -1
      setCameraDistance((prev) =>
        Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + zoomDirection * ZOOM_SPEED))
      )
    }
    gl.domElement.addEventListener("mousedown", handleMouseDown)
    gl.domElement.addEventListener("mouseup", handleMouseUp)
    gl.domElement.addEventListener("mousemove", handleMouseMove)
    gl.domElement.addEventListener("mouseleave", handleMouseUp)
    window.addEventListener("wheel", handleWheel)

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown)
      gl.domElement.removeEventListener("mouseup", handleMouseUp)
      gl.domElement.removeEventListener("mousemove", handleMouseMove)
      gl.domElement.removeEventListener("mouseleave", handleMouseUp)
      window.removeEventListener("wheel", handleWheel)
    }
  }, [gl, isDragging])

  // In the animation loop, update character movement and camera position only if viewer is NOT active.
  useFrame((state) => {
    if (!characterRef.current) return

      const { forward, backward, left, right } = get()
      const moveDirection = new Vector3()
      if (forward) moveDirection.z -= 1
      if (backward) moveDirection.z += 1
      if (left) moveDirection.x -= 1
      if (right) moveDirection.x += 1

      if (moveDirection.length() > 0) {
        moveDirection.normalize()
        // Rotate movement relative to current camera rotation.
        moveDirection.applyAxisAngle(new Vector3(0, 1, 0), cameraRotation)
        characterRef.current.position.add(moveDirection.multiplyScalar(MOVEMENT_SPEED))
        characterRef.current.rotation.y = Math.atan2(moveDirection.x, moveDirection.z)
      }

      // Update the camera so that it follows the character using your rotation/zoom logic.
      const cameraOffset = new Vector3(
        Math.sin(cameraRotation) * cameraDistance,
        CAMERA_HEIGHT * (cameraDistance / MAX_ZOOM),
        Math.cos(cameraRotation) * cameraDistance
      )
      state.camera.position.copy(characterRef.current.position).add(cameraOffset)
      state.camera.lookAt(characterRef.current.position)

  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <Environment preset="city" />
      <Sky />
      <Scene />
      <group position={[-165, 0, -59]} ref={characterRef}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </group>

    </>
  )
}
