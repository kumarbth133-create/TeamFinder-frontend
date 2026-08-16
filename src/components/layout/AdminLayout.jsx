import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../common/ThemeToggle";
import AppLogo from "../common/AppLogo";
import { FiGrid, FiUsers, FiFolder, FiLogOut, FiMenu, FiShield } from "react-icons/fi";

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };
  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/admin/dashboard", icon: <FiGrid size={17} />, label: "Dashboard" },
    { to: "/admin/students",  icon: <FiUsers size={17} />, label: "Students" },
    { to: "/admin/projects",  icon: <FiFolder size={17} />, label: "Projects" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-dark-600 flex items-center gap-2">
        <AppLogo size="sm" />
        <span className="text-lg font-bold dark:text-white text-slate-900">TeamUp</span>
        <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 px-1.5 py-0.5 rounded font-medium border border-red-200 dark:border-red-800/50 ml-1 flex items-center gap-1">
          <FiShield className="w-3 h-3" /> Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setSidebarOpen(false)}
            className={isActive(link.to) ? "nav-item-active" : "nav-item"}>
            <span className={isActive(link.to) ? "text-primary-600 dark:text-primary-300" : ""}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-dark-600">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-semibold dark:text-gray-200 text-slate-900 truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 dark:text-gray-500 truncate">{user?.email}</p>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium">
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-900 text-slate-800 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 lg:w-60 flex-col flex-shrink-0 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-600">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-600 z-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center gap-4 px-6 bg-white dark:bg-dark-800 border-b border-slate-200 dark:border-dark-600">
          <button onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-dark-600 rounded-xl transition">
            <FiMenu size={20} />
          </button>
          <div className="hidden md:block">
            <p className="text-sm font-bold dark:text-gray-200 text-slate-900">Admin Control Panel</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
