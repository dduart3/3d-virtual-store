import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

// Create atoms to store route history
const currentRouteAtom = atom<string>("/");
const previousRouteAtom = atom<string | null>(null);

/**
 * Hook to track current and previous routes
 * @returns Object containing current and previous routes
 */
export function useRouteHistory() {
  const [currentRoute, setCurrentRoute] = useAtom(currentRouteAtom);
  const [previousRoute, setPreviousRoute] = useAtom(previousRouteAtom);
  const location = useLocation();
  const pathname = location.pathname;

  console.log("Current Route:", pathname);
  useEffect(() => {

    // Only update if the path has actually changed
    if (pathname !== currentRoute) {
      // Save current as previous before updating
      setPreviousRoute(currentRoute);
      // Update current
      setCurrentRoute(pathname);
    }
  }, [location.pathname, currentRoute, setCurrentRoute, setPreviousRoute]);

  return {
    currentRoute,
    previousRoute,
  };
}
