import { useAtom } from "jotai";
import { useProgress } from "@react-three/drei";
import { isSceneReadyAtom, criticalModelsLoadingAtom, loadingProgressAtom } from "../state/loading";
import { useEffect, useState } from "react";

export const LoadingScreen = () => {
  const { active, item } = useProgress();
  const [isSceneReady] = useAtom(isSceneReadyAtom);
  const [criticalModels] = useAtom(criticalModelsLoadingAtom);
  const [progress, setProgress] = useAtom(loadingProgressAtom);
  const [isVisible, setIsVisible] = useState(true);

  
  // Calculate loaded and total models count
  const totalModels = Object.keys(criticalModels).length;
  const loadedModels = Object.values(criticalModels).filter(isLoading => !isLoading).length;
  
  // Calculate and update progress based on critical models
  useEffect(() => {
    // Don't calculate if no critical models registered yet
    if (totalModels === 0) return;
    
    // Calculate percentage - ensure it never decreases
    const newProgress = Math.round((loadedModels / totalModels) * 100);
    
    // Important: Only update if new progress is greater than current progress
    // This prevents the progress from going backwards
    setProgress(prev => Math.max(prev, newProgress));
  }, [criticalModels, loadedModels, totalModels]);

  // Hide the loading screen when everything is ready
  useEffect(() => {
    if (isSceneReady && !active) {
      // Force progress to 100% when scene is ready
      setProgress(100);
      
      // Add a small delay for smoother transition
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isSceneReady, active]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto animate-spin text-white opacity-25" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <div className="relative w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-white/70 text-sm">{progress}%</div>
        
        {/* Added model counter here */}
        <div className="mt-1 text-white/60 text-sm">
          Modelos cargados: {loadedModels}/{totalModels}
        </div>
        
        <h2 className="mt-4 text-white text-xl font-light tracking-wider">Cargando tienda virtual</h2>
      </div>
    </div>
  );
};
