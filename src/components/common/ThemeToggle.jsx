import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme mode"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 border shadow-sm select-none cursor-pointer active:scale-95 ${
        isDark
          ? "bg-dark-800 hover:bg-dark-700 text-amber-300 border-dark-600 shadow-black/40"
          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-slate-200/80"
      } ${className}`}
    >
      {isDark ? (
        <FiSun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <FiMoon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
