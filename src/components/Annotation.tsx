import { Html, Line } from "@react-three/drei"
import { Vector3 } from "three"

type AnnotationProps = {
  position: [number, number, number]
  content: string
  offset?: [number, number, number]
}

export const Annotation = ({ position, content, offset = [0, 1.5, 0] }: AnnotationProps) => {
  const start = new Vector3(...position)
  const end = new Vector3(...position).add(new Vector3(...offset))

  return (
    <>
      <Line 
        points={[start, end]}
        color="white"
        lineWidth={1}
      />
      <Html position={end.toArray()}>
        <div style={{
          transform: 'translate3d(-50%, -50%, 0)',
          background: 'rgba(0,0,0,0.8)',
          padding: '6px 10px',
          borderRadius: '4px',
          color: 'white',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          userSelect: 'none'
        }}>
          {content}
        </div>
      </Html>
    </>
  )
}
