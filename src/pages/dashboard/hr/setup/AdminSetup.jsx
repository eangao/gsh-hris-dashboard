import React from "react";
import { Link, Outlet } from "react-router-dom";

const setupItems = [
  { path: "/admin/setup/account-settings", label: "Account Settings" },
  { path: "/admin/setup/cluster", label: "Cluster Management" },
  { path: "/admin/setup/employment-status", label: "Employment Types" },
  { path: "/admin/setup/holiday", label: "Holiday Calendar" },
  {
    path: "/admin/setup/notification-settings",
    label: "Notification Settings",
  },
  { path: "/admin/setup/position", label: "Position Titles & Levels" },
  { path: "/admin/setup/religion", label: "Religion Masterlist" },
  { path: "/admin/setup/system-settings", label: "System Preferences" },
  { path: "/admin/setup/shift-templates", label: "Shift Schedule Templates" },
];

const AdminSetup = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Setup & Configuration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {setupItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{label}</h2>
            <p className="text-sm text-gray-500">
              Manage {label.toLowerCase()} here.
            </p>
          </Link>
        ))}
      </div>

      {/* 🔽 This renders the nested route below */}
      <Outlet />
    </div>
  );
};

export default AdminSetup;
