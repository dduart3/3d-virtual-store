import { GroupProps } from "@react-three/fiber"
import { Model } from "../Model"
import { useState } from "react"
import { Euler, Vector3 } from "three"

type DoorsStatus = "open" | "closed"

const DOOR_POSITIONS = {
  closed: {
    left: { position: [-159.15, -0.45, -58.75], rotation: [0, 0, 0] },
    right: { position: [-159.15, -0.45, -59.8], rotation: [0, 0, 0] }
  },
  open: {
    left: { position: [-159.15, -0.45, -58.75], rotation: [0, -Math.PI / 1.5, 0] },
    right: { position: [-159.15, -0.45, -60.8], rotation: [0, -Math.PI / 3, 0] }
  }
} as const

const useHoverCursor = () => ({
  onPointerOver: () => (document.body.style.cursor = "pointer"),
  onPointerOut: () => (document.body.style.cursor = "default")
})

const Door = ({ side, status }: { side: 'left' | 'right', status: DoorsStatus }) => (
  <Model
    name={`${side}Door`}
    modelName="/misc/door"
    position={new Vector3(...DOOR_POSITIONS[status][side].position)}
    rotation={new Euler(...DOOR_POSITIONS[status][side].rotation)}
  />
)

export const Doors = (props: GroupProps) => {
  const [status, setStatus] = useState<DoorsStatus>("closed")
  const hoverProps = useHoverCursor()
  
  return (
    <group
      {...props}
      {...hoverProps}
      onClick={() => setStatus(prev => prev === "closed" ? "open" : "closed")}
    >
      <Door side="left" status={status} />
      <Door side="right" status={status} />
    </group>
  )
}