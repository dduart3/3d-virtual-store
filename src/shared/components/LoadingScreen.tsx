import { useAtom } from 'jotai';
import { useEffect, useState, useRef } from 'react';
import { loadingProgressAtom } from '../state/loading';

// Tips that will rotate during loading - feel free to customize these!
const LOADING_TIPS = [
  "Utiliza las teclas WASD para moverte por la tienda",
  "Puedes hacer zoom con la rueda del mouse",
  "Haz clic en los productos para ver más detalles",
  "Explora diferentes secciones para descubrir nuevos productos",
  "Usa el chat para recibir ayuda de nuestros asistentes",
  "Pulsa ESC para abrir el menú principal",
  "Puedes girar la cámara manteniendo presionado el click izquierdo",
  "Acércate a los mostradores para ver los productos disponibles",
  "Revisa tu carrito de compras para finalizar tu pedido",
];

export const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress] = useAtom(loadingProgressAtom);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentTip, setCurrentTip] = useState(
    Math.floor(Math.random() * LOADING_TIPS.length)
  );
  const prevTipRef = useRef(currentTip);
  
  // Smoothly update the displayed progress
  useEffect(() => {
    setProgress(prev => Math.max(prev, loadingProgress));
    
    // Force completion if we reach 100%
    if (loadingProgress >= 99) {
      const forceComplete = setTimeout(() => {
        setProgress(100);
        setFadeOut(true);
      }, 300);
      return () => clearTimeout(forceComplete);
    }
  }, [loadingProgress]);
  
  // Hide the loading screen when progress reaches 100%
  useEffect(() => {
    if (fadeOut) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 800);
      
      return () => clearTimeout(timeout);
    }
  }, [fadeOut]);
  
  // Rotate through tips randomly every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Get a random index, but make sure it's not the same as current tip
      let newTipIndex;
      do {
        newTipIndex = Math.floor(Math.random() * LOADING_TIPS.length);
      } while (newTipIndex === prevTipRef.current && LOADING_TIPS.length > 1);
      
      setCurrentTip(newTipIndex);
      prevTipRef.current = newTipIndex;
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-between py-20 transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Top section with title */}
      <div className="text-center">
        <h1 className="text-white text-4xl font-light tracking-wider mb-4">Uribe's Boutique</h1>
      </div>
      
      {/* Center section with spinner and loading text */}
      <div className="text-center">
        {/* Spinning SVG Loader */}
        <div className="mb-4 flex justify-center">
          <svg className="animate-spin h-16 w-16 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        {/* "Cargando experiencia" text */}
        <p className="text-white/70 text-lg font-light tracking-wide mb-8">
          Cargando experiencia
        </p>
        
        {/* Progress bar and percentage */}
        <div className="w-64 h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-white/70 text-sm mt-1">
          {progress}%
        </div>
      </div>
      
      {/* Bottom section with random tip */}
      <div className="text-center max-w-lg px-6">
        <p className="text-white/80 text-sm font-light transition-opacity duration-500">
          {LOADING_TIPS[currentTip]}
        </p>
      </div>
    </div>
  );
};
