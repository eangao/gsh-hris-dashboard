import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  // Pages where you want to hide the Header and Sidebar
  // Add print route prefix to hide layout for print pages
  const hideLayout =
    location.pathname === "/change-password" ||
    location.pathname.startsWith("/hr/duty-schedule/print");

  return (
    <div className="bg-[#cdcae9] w-full min-h-screen">
      {!hideLayout && (
        <>
          <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        </>
      )}

      <div
        className={`${
          !hideLayout ? "ml-0 lg:ml-[260px] pt-[95px]" : ""
        } transition-all`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
