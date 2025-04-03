import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StorePage } from "./pages/StorePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ConfirmEmailPage } from "./pages/ConfirmEmailPage";
import { RouteWrapper } from "./shared/components/RouteWrapper";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ErrorPage } from "./pages/ErrorPage";

// Create routes
const rootRoute = createRootRoute({
  component: () => <RouteWrapper />,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: (search) =>{
    return {
      message: search?.message ?? ""
    }
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store",
  component: StorePage
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage
});

// Add this to your existing routes
const confirmEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/confirm",
  component: ConfirmEmailPage,
});

// Add it to your routeTree
const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  confirmEmailRoute, // Add this line
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
