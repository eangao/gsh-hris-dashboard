import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useWindowSize } from "../hooks/useWindowSize";

const MainLayout = () => {
  const { width } = useWindowSize();
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const isLargeScreen = useMemo(() => width >= 1024, [width]);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    setShowSidebar(isLargeScreen);
  }, [isLargeScreen]);

  // Memoize the route checking logic to prevent unnecessary recalculations
  const hideLayout = useMemo(() => {
    const hideLayoutRoutes = ["/change-password"];
    const hideLayoutPrefixes = [
      "/hr/duty-schedule/print",
      "/manager/duty-schedule/print",
      "/director/duty-schedule/print",
      "/employee/duty-schedule/print",
      "/admin/duty-schedule/print",
    ];

    return (
      hideLayoutRoutes.includes(location.pathname) ||
      hideLayoutPrefixes.some((prefix) => location.pathname.startsWith(prefix))
    );
  }, [location.pathname]);

  // Memoize the sidebar toggle function to prevent unnecessary re-renders
  const handleSidebarToggle = useCallback((value) => {
    setShowSidebar(value);
  }, []);

  // Memoize the main content className to prevent unnecessary recalculations
  const mainContentClassName = useMemo(() => {
    if (hideLayout) return "";

    const marginClass = showSidebar ? "ml-0 lg:ml-[260px]" : "ml-0";
    return `${marginClass} pt-14 transition-all duration-300`;
  }, [hideLayout, showSidebar]);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 w-full min-h-screen">
      {!hideLayout && (
        <>
          <Header
            showSidebar={showSidebar}
            setShowSidebar={handleSidebarToggle}
          />
          <Sidebar
            showSidebar={showSidebar}
            setShowSidebar={handleSidebarToggle}
          />
        </>
      )}

      <div className={mainContentClassName}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
