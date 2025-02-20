import { Html } from '@react-three/drei'
import { useAtom } from 'jotai'
import { viewerStateAtom } from '../state/viewer'

export const ViewerControls = () => {
  const [viewerState, setViewerState] = useAtom(viewerStateAtom)

  const handleNext = () => {
    setViewerState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.catalog.length,
      currentProduct: prev.catalog[(prev.currentIndex + 1) % prev.catalog.length]
    }))
  }

  const handlePrev = () => {
    setViewerState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.catalog.length) % prev.catalog.length,
      currentProduct: prev.catalog[(prev.currentIndex - 1 + prev.catalog.length) % prev.catalog.length]
    }))
  }

  const handleClose = () => {
    setViewerState(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <group>
      <Html position={[-1.5, 0, 0]}>
        <button 
          onClick={handlePrev}
          className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 cursor-pointer"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      </Html>

      <Html position={[1.4, 0, 0]}>
        <button 
          onClick={handleNext}
          className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 cursor-pointer"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </Html>

      <Html position={[1.5, 0.7, 0]}>
        <button 
          onClick={handleClose}
          className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 cursor-pointer"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </Html>
    </group>
  )
}
