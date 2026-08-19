import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";
import ThemeToggle from "../common/ThemeToggle";
import AppLogo from "../common/AppLogo";
import {
  FiGrid, FiFolder, FiSearch, FiUsers, FiUserCheck,
  FiBell, FiSettings, FiLogOut,
  FiMenu, FiPlus, FiAward, FiBookOpen, FiZap,
} from "react-icons/fi";
import API from "../../api/axios";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await API.get("/notifications");
        setUnreadCount(data.unreadCount || 0);
      } catch { /* silent */ }
    };
    fetchUnread();
    const t = setInterval(fetchUnread, 30000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/students?search=${encodeURIComponent(search.trim())}`);
  };

  const isActive = (path) =>
    path === "/projects"
      ? location.pathname === "/projects" || location.pathname === "/my-projects"
      : location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    { to: "/dashboard",    icon: <FiGrid size={18} />,        label: "Dashboard" },
    { to: "/my-projects",  icon: <FiFolder size={18} />,      label: "Projects" },
    { to: "/projects",     icon: <FiSearch size={18} />,      label: "Browse Projects" },
    { to: "/students",     icon: <FiUsers size={18} />,       label: "Find Students" },
    { to: "/mentors",      icon: <FiAward size={18} />,       label: "Find Mentors" },
    { to: "/courses",      icon: <FiBookOpen size={18} />,    label: "Courses" },
    { to: "/game-zone",    icon: <FiZap size={18} />,         label: "Game Zone" },
    { to: "/my-requests",  icon: <FiUserCheck size={18} />,   label: "Requests" },
    { to: "/notifications",icon: <FiBell size={18} />,        label: "Notifications",
      badge: unreadCount > 0 ? unreadCount : null },
    { to: "/profile",      icon: <FiSettings size={18} />,    label: "Settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2.5 border-b border-slate-200 dark:border-dark-600 flex-shrink-0">
        <AppLogo size="sm" />
        <span className="text-lg font-bold dark:text-white text-slate-900">
          Team<span className="text-primary-600">Up</span>
        </span>
        <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-800/50 dark:text-primary-300 px-1.5 py-0.5 rounded font-medium border border-primary-200 dark:border-primary-700/50">
          Beta
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setSidebarOpen(false)}
            className={isActive(link.to) ? "nav-item-active" : "nav-item"}
          >
            <span className={isActive(link.to) ? "text-[#ca0019] dark:text-rose-400" : "text-slate-500 dark:text-gray-400 group-hover:text-[#ca0019] dark:group-hover:text-rose-400 transition-colors"}>
              {link.icon}
            </span>
            <span className="flex-1">{link.label}</span>
            {link.badge && (
              <span className="bg-[#ca0019] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {link.badge > 9 ? "9+" : link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-dark-600 flex-shrink-0 space-y-1">
        <Link
          to="/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-600 transition"
        >
          <Avatar src={user?.profilePicture} name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium dark:text-gray-100 text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-gray-500 truncate">Student</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
        >
          <FiLogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-900 text-slate-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 lg:w-60 flex-col flex-shrink-0 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-600">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-60 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-600 z-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 flex items-center gap-3 px-4 lg:px-6 bg-white dark:bg-dark-800 border-b border-slate-200 dark:border-dark-600 flex-shrink-0 shadow-sm">
          {/* Mobile menu trigger */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-dark-600 rounded-xl transition"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={20} />
          </button>

          {/* Global Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, students..."
                className="w-full bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 text-slate-800 dark:text-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm
                           hover:border-[#ca0019]/60 hover:shadow-sm hover:shadow-[#ca0019]/10
                           focus:outline-none focus:ring-2 focus:ring-[#ca0019]/25 focus:border-[#ca0019] focus:shadow-md focus:shadow-[#ca0019]/15
                           placeholder-slate-400 dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>
          </form>

          {/* Header Action Items */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Quick Create Project */}
            <Link to="/projects/create"
              className="hidden sm:flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white
                         text-xs font-semibold px-3 py-2 rounded-xl transition shadow-sm">
              <FiPlus size={14} /> Create Project
            </Link>

            {/* Dark & Light Theme Switcher */}
            <ThemeToggle className="ml-1" />

            {/* Notifications Button */}
            <Link to="/notifications"
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-dark-600 rounded-xl transition">
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white dark:ring-dark-800" />
              )}
            </Link>

            {/* User Profile Avatar */}
            <Link to="/profile" className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-dark-600 rounded-xl transition">
              <Avatar src={user?.profilePicture} name={user?.name} size="sm" />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold dark:text-gray-200 text-slate-900 leading-none">{user?.name?.split(" ")[0]}</p>
                <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-0.5">Student</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
