import { atom } from 'jotai';

// Track which critical models are currently loading
export const criticalModelsLoadingAtom = atom<Record<string, boolean>>({});

// Derived atom that tells us if ALL critical models have loaded
export const isSceneReadyAtom = atom(
  (get) => {
    const loadingModels = get(criticalModelsLoadingAtom);
    // If any critical model is still loading, scene is not ready
    return Object.values(loadingModels).every(isLoading => !isLoading) && 
           Object.keys(loadingModels).length > 0; // Must have started loading models
  }
);

// Atom to track the overall loading progress (0-100)
export const loadingProgressAtom = atom<number>(0);
