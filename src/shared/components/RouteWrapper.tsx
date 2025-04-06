import { Outlet } from "@tanstack/react-router";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks/useAuth";

const PUBLIC_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/confirm-email",
];
const PROTECTED_ROUTES = ["/store", "/profile"];
const SPECIAL_AUTH_ROUTES = ["/reset-password"]; // Routes that can be accessed even when authenticated

export function RouteWrapper() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const routerState = useRouterState();

  // Get current path
  const currentPath = routerState.location.pathname;

  // Skip redirects while auth is loading
  if (loading) return null;

  // Redirect authenticated users away from public-only routes
  // EXCEPT when they're in a password reset flow and trying to access the reset-password page
  if (
    user &&
    PUBLIC_ONLY_ROUTES.some((route) => currentPath.startsWith(route)) &&
    !(
      SPECIAL_AUTH_ROUTES.some((route) => currentPath.startsWith(route))
    )
  ) {
    router.navigate({ to: "/" });
    return null;
  }

  // Redirect unauthenticated users away from protected routes
  if (
    !user &&
    PROTECTED_ROUTES.some((route) => currentPath.startsWith(route))
  ) {
    router.navigate({ to: "/login", search: { message: "" } });
    return null;
  }

  // Render the matched route using Outlet
  return <Outlet />;
}
