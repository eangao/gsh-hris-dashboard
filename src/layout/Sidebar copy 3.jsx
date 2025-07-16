import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getNav } from "../navigation/index";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useWindowSize } from "../hooks/useWindowSize";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const { role } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const { width } = useWindowSize();

  const [allNav, setAllNav] = useState([]);
  const [openGroup, setOpenGroup] = useState(null);

  const isLargeScreen = width >= 1024;

  useEffect(() => {
    const navs = getNav(role);
    setAllNav(navs);
  }, [role]);

  // useEffect(() => {
  //   const currentGroup = allNav.find((item) => item.path === pathname)?.group;
  //   if (currentGroup) {
  //     setOpenGroup(currentGroup); // ✅ open correct group on page load
  //   }
  // }, [pathname, allNav]);

  const toggleGroup = (groupName) => {
    setOpenGroup((prev) => (prev === groupName ? null : groupName));
  };

  const groupedNav = allNav.reduce((acc, item) => {
    const group = item.group || item.title;
    if (item.isGroupTitle) {
      acc[group] = {
        title: item.title,
        role: item.role,
        icon: item.icon,
        items: [],
      };
    } else {
      const parent = item.group;
      if (!acc[parent]) acc[parent] = { title: parent, items: [] };
      acc[parent].items.push(item);
    }
    return acc;
  }, {});

  return (
    <div>
      {/* Mobile overlay - only show on mobile screens */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${
          !showSidebar ? "invisible" : "visible"
        } w-screen h-screen bg-[#8cbce780] top-0 z-10 lg:hidden`}
      ></div>

      <div
        className={`w-[260px] fixed bg-[#e6e7fb] z-50 top-0 h-screen shadow transition-all duration-300 ${
          showSidebar ? "left-0" : "-left-[260px]"
        }`}
      >
        <div className="h-[70px] flex justify-between items-center px-4">
          <Link to="/" className="w-[200px] h-[50px]">
            <img
              className="w-full h-full"
              src="/images/ahg-logo.png"
              alt="logo"
            />
          </Link>

          {/* Toggle button inside sidebar when expanded */}
          {showSidebar && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="w-[32px] h-[32px] rounded-md bg-[#3B5998] shadow-md hover:bg-[#6A82FB] justify-center items-center cursor-pointer border border-white/20 transition-colors hidden lg:flex"
            >
              <span className="text-white text-sm">
                <BiChevronUp className="rotate-90" />
              </span>
            </button>
          )}
        </div>

        <div className="px-[16px] max-h-[90%] overflow-y-auto">
          <ul>
            {Object.entries(groupedNav)
              // .sort(([a], [b]) => a.localeCompare(b))
              .map(([groupKey, group], i) => {
                const isOpen = openGroup === groupKey;
                return (
                  <li key={i}>
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className={`flex items-center w-full px-[12px] py-[9px] rounded-sm font-bold gap-3 text-left transition-all mb-1 ${
                        isOpen
                          ? "bg-blue-600 text-white shadow duration-500"
                          : "text-[#030811] hover:pl-4 duration-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {group.icon && <span>{group.icon}</span>}{" "}
                        {/* ✅ Icon */}
                        {group.title}
                      </span>
                      <span className="ml-auto">
                        {isOpen ? <BiChevronUp /> : <BiChevronDown />}
                      </span>
                    </button>
                    {isOpen && (
                      <ul>
                        {group.items.map((item, j) => (
                          <li key={j}>
                            <Link
                              to={item.path}
                              onClick={() => {
                                // Only close sidebar on mobile
                                if (!isLargeScreen) {
                                  setShowSidebar(false);
                                }
                              }}
                              className={`${
                                pathname === item.path
                                  ? "bg-blue-600 border-l-4 border-indigo-500 text-white duration-500"
                                  : "text-[#030811] font-bold duration-200"
                              } px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                            >
                              <span>{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
