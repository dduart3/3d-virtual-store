import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StoreExperience } from "./pages/StoreExperience";
import { ProfilePage } from "./pages/ProfilePage";

// Create routes
const rootRoute = createRootRoute();

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store",
  component: StoreExperience,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

// Create and export the router
const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  storeRoute,
  profileRoute,
]);

export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
