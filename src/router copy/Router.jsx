/**
 * Router Component
 *
 * A centralized routing component that handles:
 * - Route rendering with React Router
 * - Loading states with Suspense
 * - Error boundary for route-related errors
 * - Professional loading UI
 *
 * @component
 * @param {Object} props
 * @param {Array} props.allRoutes - Array of route configurations
 */

import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

/**
 * Professional Loading Component
 * Provides a better user experience during route transitions
 */
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto"
          style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
        ></div>
      </div>

      {/* Loading text */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
      <p className="text-gray-500">Please wait while we prepare your content</p>
    </div>
  </div>
);

/**
 * Main Router Component
 *
 * Handles route rendering with proper error boundaries and loading states
 */
const Router = ({ allRoutes }) => {
  // Debug logging
  console.log("Router: Received routes:", allRoutes);

  // Generate routes using React Router's useRoutes hook
  // Note: Hooks must be called at the top level, before any conditional logic
  const routes = useRoutes(allRoutes || []);

  // Validate routes prop after hooks
  if (!allRoutes || !Array.isArray(allRoutes)) {
    console.error("Router: allRoutes must be a valid array");
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Configuration Error
          </h2>
          <p className="text-red-600">Invalid route configuration provided</p>
        </div>
      </div>
    );
  }

  return <Suspense fallback={<LoadingSpinner />}>{routes}</Suspense>;
};

export default Router;
