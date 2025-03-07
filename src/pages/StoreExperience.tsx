import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Experience } from  '../modules/store/Experience'
import { Chat } from '../modules/chat/components/Chat'
import { ViewerUI } from '../modules/product-viewer/components/ViewerUI'
import { CartPanel } from '../modules/cart/components/CartPanel'
import { UserMenu } from '../modules/auth/components/UserMenu'
import { useAuth } from '../modules/auth/hooks/useAuth'
import { fadeRefAtom } from '../shared/state/fade'
import { useAtom } from 'jotai'
import { useRef, useEffect } from 'react'
import { FadeHandle } from '../shared/components/Fade'

export function StoreExperience() {
  const { loading } = useAuth()
  const fadeRef = useRef<FadeHandle>(null)
  const [, setFadeRef] = useAtom(fadeRefAtom)
  
  // Set up the fade ref for transitions
  useEffect(() => {
    if (fadeRef.current) {
      setFadeRef(fadeRef.current)
      fadeRef.current.fadeFromBlack()
    }
  }, [fadeRef, setFadeRef])
  
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
          { name: "run", keys: ["ShiftLeft", "ShiftRight"] }
        ]}
      >
        <Canvas shadows>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
        
        {/* UI Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <Chat />
          <ViewerUI />
          <CartPanel />
          <UserMenu />
        </div>
      </KeyboardControls>
      
      {/* Loading indicator for initial canvas load */}
      <div id="canvas-loader" className="absolute inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-1000">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Loading Virtual Store...</p>
        </div>
      </div>
    </div>
  )
}
