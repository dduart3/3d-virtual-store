import { atom } from 'jotai';

// Track which critical models are currently loading
export const criticalModelsLoadingAtom = atom<Record<string, boolean>>({});

// Track progress percentage for each critical model (0-100)
export const criticalModelsProgressAtom = atom<Record<string, number>>({});

// Calculate overall loading progress based on all models
export const loadingProgressAtom = atom(
  (get) => {
    const progressData = get(criticalModelsProgressAtom);
    const models = Object.keys(progressData);
    
    // If no models are being tracked yet, return 0
    if (models.length === 0) return 0;
    
    // Calculate average progress across all models
    const totalProgress = Object.values(progressData).reduce((sum, progress) => sum + progress, 0);
    const averageProgress = Math.round(totalProgress / models.length);
    
    // Add a safety mechanism - if all models show 100% but some are still marked as loading,
    // force progress to 99% until they're properly marked as complete
    const loadingModels = get(criticalModelsLoadingAtom);
    const stillLoading = Object.values(loadingModels).some(isLoading => isLoading);
    
    if (averageProgress >= 100 && stillLoading) {
      // Some models report 100% but are still marked as loading, cap at 99%
      return 99;
    }
    
    return averageProgress;
  }
);

// Derived atom that tells us if ALL critical models have loaded
export const isSceneReadyAtom = atom(
  (get) => {
    const loadingModels = get(criticalModelsLoadingAtom);
    // If any critical model is still loading, scene is not ready
    return Object.values(loadingModels).every(isLoading => !isLoading) && 
           Object.keys(loadingModels).length > 0; // Must have started loading models
  }
);
