import { useState, useRef, useEffect } from 'react'

export const useProductRotation = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const lastX = useRef(0)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      lastX.current = e.clientX
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const delta = (e.clientX - lastX.current) * 0.005
        setRotationSpeed(delta)
        lastX.current = e.clientX
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setTimeout(() => setRotationSpeed(0), 150)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [isDragging])

  return { isDragging, rotationSpeed }
}
