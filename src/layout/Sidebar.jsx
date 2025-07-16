/**
 * Sidebar Component
 *
 * A responsive sidebar navigation component that provides:
 * - Role-based navigation menu
 * - Collapsible group organization
 * - Mobile-responsive behavior
 * - Smooth animations and transitions
 * - Accessibility features
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.showSidebar - Controls sidebar visibility
 * @param {Function} props.setShowSidebar - Function to toggle sidebar visibility
 */

import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { getNav } from "../navigation/index";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useWindowSize } from "../hooks/useWindowSize";

const Sidebar = memo(({ showSidebar, setShowSidebar }) => {
  // ===============================
  // HOOKS & STATE MANAGEMENT
  // ===============================
  const { role } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const { width } = useWindowSize();

  // Local state for navigation and UI
  const [allNav, setAllNav] = useState([]);
  const [openGroups, setOpenGroups] = useState(new Set());

  // Screen size detection - memoized to prevent unnecessary recalculations
  const isLargeScreen = useMemo(() => width >= 1024, [width]);

  // ===============================
  // NAVIGATION DATA PROCESSING
  // ===============================

  /**
   * Fetch and set navigation items based on user role
   * Only re-run when role changes
   */
  useEffect(() => {
    const navs = getNav(role);
    setAllNav(navs);
  }, [role]);

  /**
   * Auto-expand the group containing the current route
   * Only re-run when pathname or navigation changes
   */
  useEffect(() => {
    if (allNav.length === 0) return;

    const currentGroup = allNav.find((item) => item.path === pathname)?.group;
    if (currentGroup) {
      setOpenGroups((prev) => {
        if (!prev.has(currentGroup)) {
          return new Set([...prev, currentGroup]);
        }
        return prev;
      });
    }
  }, [pathname, allNav]);

  /**
   * Process navigation items into grouped structure
   * Memoized to prevent unnecessary recalculations
   */
  const groupedNav = useMemo(() => {
    if (allNav.length === 0) return {};

    return allNav.reduce((acc, item) => {
      if (item.isGroupTitle) {
        // Create group header using the title as the key
        acc[item.title] = {
          title: item.title,
          role: item.role,
          icon: item.icon,
          items: [],
        };
      } else {
        // Add item to existing group or create new one
        const parent = item.group;
        if (parent && !acc[parent]) {
          acc[parent] = { title: parent, items: [] };
        }
        if (parent) {
          acc[parent].items.push(item);
        }
      }
      return acc;
    }, {});
  }, [allNav]);

  // ===============================
  // EVENT HANDLERS
  // ===============================

  /**
   * Toggle group expansion with animation handling
   */
  const toggleGroup = useCallback((groupName) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  }, []);

  /**
   * Handle navigation item click - memoized to prevent unnecessary re-renders
   */
  const handleNavClick = useCallback(() => {
    if (!isLargeScreen) {
      setShowSidebar(false);
    }
  }, [isLargeScreen, setShowSidebar]);

  // ===============================
  // MEMOIZED COMPONENTS
  // ===============================

  /**
   * Memoized navigation item component to prevent unnecessary re-renders
   */
  const NavigationItem = memo(({ item, isActive, onClick }) => (
    <Link
      to={item.path}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 mx-2 rounded-lg font-medium transition-all duration-200 group
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
            : "text-gray-700 hover:text-white hover:bg-blue-600 hover:shadow-md"
        }
      `}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Navigation Item Icon */}
      {item.icon && (
        <span className="text-lg flex-shrink-0" aria-hidden="true">
          {item.icon}
        </span>
      )}

      {/* Navigation Item Title */}
      <span className="text-sm font-medium truncate">{item.title}</span>

      {/* Active Indicator */}
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0" />
      )}
    </Link>
  ));

  /**
   * Memoized navigation group component to prevent unnecessary re-renders
   */
  const NavigationGroup = memo(({ group, items, isOpen, onToggle }) => {
    const hasItems = items && items.length > 0;

    return (
      <>
        {/* Group Header Button */}
        <button
          onClick={() => onToggle(group.title)}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-left rounded-lg font-medium transition-all duration-200 
            ${
              isOpen
                ? "bg-blue-100 text-blue-800 shadow-md"
                : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
            }
          `}
          aria-expanded={isOpen}
          aria-controls={`group-${group.title}`}
          disabled={!hasItems}
        >
          <div className="flex items-center space-x-3">
            {/* Group Icon */}
            {group.icon && (
              <span className="text-lg flex-shrink-0" aria-hidden="true">
                {group.icon}
              </span>
            )}

            {/* Group Title */}
            <span className="text-sm font-medium truncate">{group.title}</span>
          </div>

          {/* Expand/Collapse Indicator */}
          {hasItems && (
            <span className="flex-shrink-0 ml-auto">
              <BiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          )}
        </button>

        {/* Group Items */}
        {hasItems && (
          <div
            id={`group-${group.title}`}
            className={`ml-2 mt-1 space-y-1 overflow-hidden transition-all duration-200 ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="space-y-1 pl-4 border-l-2 border-blue-200">
              {items.map((item, itemIndex) => (
                <li key={item.path || itemIndex}>
                  <NavigationItem
                    item={item}
                    isActive={pathname === item.path}
                    onClick={handleNavClick}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  });

  // ===============================
  // UTILITY FUNCTIONS
  // ===============================

  // ===============================
  // RENDER COMPONENT
  // ===============================

  return (
    <div>
      {/* Mobile Overlay - Provides backdrop for mobile sidebar */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 lg:hidden ${
          showSidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main Navigation"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            aria-label="Go to homepage"
          >
            <img
              className="h-10 w-auto object-contain"
              src="/images/ahg-logo.png"
              alt="Company Logo"
            />
          </Link>

          {/* Desktop Toggle Button - Only visible on large screens when sidebar is open */}
          {isLargeScreen && (
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              aria-label="Close sidebar"
            >
              <BiChevronUp className="w-4 h-4 rotate-90" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2" role="navigation">
          <ul className="space-y-2">
            {Object.entries(groupedNav).map(([groupKey, group], index) => (
              <li key={groupKey || index}>
                <NavigationGroup
                  group={group}
                  items={group.items || []}
                  isOpen={openGroups.has(groupKey)}
                  onToggle={toggleGroup}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            © 2025 AHG HRIS
          </div>
        </div>
      </aside>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
